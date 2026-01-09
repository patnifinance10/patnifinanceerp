import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Client from '@/lib/models/Client';
import Loan from '@/lib/models/Loan';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { logActivity } from '@/lib/activity-logger';
import { cookies } from 'next/headers';
import { verifyJWT, AUTH_COOKIE_NAME } from '@/lib/auth';
import { PERMISSIONS } from '@/lib/constants/permissions';

async function checkAccess(req: Request, requiredPermission: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return false;
    
    const payload = await verifyJWT(token);
    if (!payload) return false;

    const userPayload = payload as any; 
    // Admin bypass
    if (userPayload.role === 'Admin' || userPayload.role === 'super_admin') return true;

    return userPayload.permissions?.includes(requiredPermission);
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        
        // 1. Auth & Permission Check
        const hasAccess = await checkAccess(req, PERMISSIONS.CREATE_LOAN);
        if (!hasAccess) {
            return NextResponse.json({ error: "Unauthorized: Missing 'create_loan' permission" }, { status: 403 });
        }

        const body = await req.json();
        const {
            // Customer Info
            firstName, lastName, mobile, email, address, aadhar, pan, customerImage,
            
            // Loan Config
            loanAmount, interestRate, tenureMonths, loanScheme,
            interestType, interestRateUnit, interestPaidInAdvance,
            repaymentFrequency, processingFeePercent, startDate,
            indefiniteTenure,
            
            // Splits
            paymentModes
        } = body;

        // 2. Validate essential fields
        if (!firstName || !lastName || !mobile || !loanAmount || !interestRate || !startDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 3. Handle Image Upload
        let photoUrl = null;
        if (customerImage) {
            try {
                // If it's a base64 string, upload it
                if (customerImage.startsWith('data:image')) {
                    photoUrl = await uploadToCloudinary(customerImage);
                }
            } catch (err) {
                console.error("Image upload failed, proceeding without image:", err);
            }
        }

        // 4. Find or Create Client
        // Check if client exists by Mobile or PAN
        let client = await Client.findOne({ $or: [{ mobile }, { pan: pan ? pan : "NO_MATCH" }] });

        if (client) {
            // Update existing client
            client.firstName = firstName;
            client.lastName = lastName;
            client.email = email;
            client.address = address;
            if (aadhar) client.aadhar = aadhar;
            if (pan) client.pan = pan;
            if (photoUrl) client.photoUrl = photoUrl; // Update photo if new one provided
            await client.save();
        } else {
            // Create new client
            client = await Client.create({
                firstName,
                lastName,
                mobile,
                email,
                address,
                aadhar,
                pan,
                photoUrl
            });
        }

        // 5. Server-side Calculation Validation
        // Re-calculate to ensure data integrity
        const P = parseFloat(loanAmount);
        let R = parseFloat(interestRate);
        const N = parseFloat(tenureMonths) || 0; // 0 if indefinite
        const PF_Percent = parseFloat(processingFeePercent) || 0;

        // Determine Frequency Factors
        let frequencyDivisor = 12; // Default Monthly
        if (repaymentFrequency === 'Weekly') frequencyDivisor = 52;
        if (repaymentFrequency === 'Daily') frequencyDivisor = 365;

        let annualRate = R;        
        if(interestRateUnit === "Monthly") annualRate = R * 12;

        const periodicRate = annualRate / frequencyDivisor / 100;

        // Calculate ACTUAL Number of Installments (N_effective)
        // The input 'N' is always in "Months"
        let numberOfInstallments = N; // Default for Monthly
        if (repaymentFrequency === 'Weekly') {
             // Months -> Weeks
             numberOfInstallments = (N / 12) * 52;
        }
        if (repaymentFrequency === 'Daily') {
             // Months -> Days
             numberOfInstallments = (N / 12) * 365;
        }
        numberOfInstallments = Math.ceil(numberOfInstallments);

        let emi = 0;
        let totalInterest = 0;
        let totalPayable = 0;
        let firstMonthInterest = 0; // First Period Interest

        if (loanScheme === "InterestOnly") {
             firstMonthInterest = P * periodicRate;
             emi = firstMonthInterest;
             
             if(indefiniteTenure) {
                 totalInterest = 0;
                 totalPayable = 0;
             } else {
                 totalInterest = firstMonthInterest * numberOfInstallments;
                 totalPayable = P + totalInterest;
             }
        } else {
             if (interestType === "Flat") {
                totalInterest = (P * annualRate * (N / 12)) / 100; // Flat interest based on Tenure Years (N/12)
                totalPayable = P + totalInterest;
                emi = totalPayable / numberOfInstallments;
             } else {
                // Reducing
                if (periodicRate === 0) emi = P / numberOfInstallments;
                else emi = (P * periodicRate * Math.pow(1 + periodicRate, numberOfInstallments)) / (Math.pow(1 + periodicRate, numberOfInstallments) - 1);
                
                totalPayable = emi * numberOfInstallments;
                totalInterest = totalPayable - P;
             }
             firstMonthInterest = P * periodicRate;
        }

        let processingFeeAmount = (P * PF_Percent) / 100;
        let netDisbursal = P - processingFeeAmount;

        if (loanScheme === "InterestOnly" && interestPaidInAdvance) {
            netDisbursal -= firstMonthInterest;
        }

        // 6. Generate Repayment Schedule
        var schedule: any[] = [];
        let nextPaymentDate = null;
        let nextPaymentAmount = 0;

        if (!indefiniteTenure) {
            const { generateRepaymentSchedule } = await import('@/lib/loan-calculations');
            schedule = generateRepaymentSchedule({
                loanAmount: P,
                interestRate: R, // Yearly
                tenureMonths: N,
                loanScheme: loanScheme as any,
                interestType: interestType as any,
                interestRateUnit: 'Yearly',
                repaymentFrequency: repaymentFrequency as any,
                startDate: new Date(startDate),
                indefiniteTenure: false
            });

            if (schedule.length > 0) {
                nextPaymentDate = schedule[0].dueDate;
                nextPaymentAmount = schedule[0].amount;
            }
        } else {
            // Indefinite Tenure: Next payment is just next month's interest
            nextPaymentDate = new Date(startDate);
            // Calculate 1 month interest
            const r_monthly = (R / 12) / 100;
            nextPaymentAmount = Math.round(P * r_monthly);
        }

        // 7. Create Loan Record
        const loanId = `LN-${Date.now().toString().slice(-6)}`; 
        
        const newLoan = await Loan.create({
            client: client._id,
            loanId,
            loanAmount: P,
            interestRate: R,
            interestRateUnit: 'Yearly',
            tenureMonths: N,
            indefiniteTenure: !!indefiniteTenure,
            loanScheme,
            interestType,
            interestPaidInAdvance: !!interestPaidInAdvance,
            repaymentFrequency,
            processingFeePercent: PF_Percent,
            
            calculatedEMI: Math.round(emi),
            totalInterest: Math.round(totalInterest),
            totalPayable: Math.round(totalPayable),
            netDisbursal: Math.round(netDisbursal),
            
            disbursementDate: new Date(),
            startDate: new Date(startDate),
            
            // Future Tracking
            nextPaymentDate,
            nextPaymentAmount,
            repaymentSchedule: schedule,
            
            paymentModes: paymentModes.map((mode: any) => ({
                type: mode.type,
                amount: parseFloat(mode.amount),
                reference: mode.reference
            })),
            
            status: 'active',
            disbursedBy: 'Admin User' 
        });

        // 7. Log Activity
        // Note: The frontend was logging activity, but backend logging is more secure/reliable.
        // We can keep both or prefer backend.
       /* await logActivity({
            type: 'Loan',
            title: 'Loan Disbursed',
            entityName: `${firstName} ${lastName}`,
            amount: -P,
            action: 'Disbursed',
            description: `Loan ${loanId} created for ${firstName} ${lastName}.`,
            user: 'System' // Or actual user
        });*/

        return NextResponse.json({ success: true, loan: newLoan, client });

    } catch (error: any) {
        console.error("Loan Creation Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
