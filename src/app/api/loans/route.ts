import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Client from '@/lib/models/Client';
import Loan from '@/lib/models/Loan';
import Activity from '@/lib/models/Activity';
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
            indefiniteTenure, tenureUnit,
            
            // Lifecycle 2.0 Configs
            gracePeriodDays, penaltyConfig, advancePaymentAction, holidayHandling,
            
            // Splits
            paymentModes
        } = body;


        // 2. Validate essential fields
        if (!firstName || !mobile || !loanAmount || !interestRate || !startDate) {
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
        // The input 'N' is tenure duration
        
        // FIX: Ensure tenureUnit matches frequency if possible, or fallback safely
        let tUnit = tenureUnit || 'Months';
        
        // Auto-correct unit if Frequency is Daily/Weekly but Unit defaulted to Months (User likely didn't specify or UI bug)
        // If Logic: If Daily repayment, Tenure usually in Days. If Weekly, in Weeks.
        if (repaymentFrequency === 'Daily' && tUnit === 'Months') tUnit = 'Days';
        if (repaymentFrequency === 'Weekly' && tUnit === 'Months') tUnit = 'Weeks';

        let numberOfInstallments = N; 
        
        if (repaymentFrequency === 'Weekly') {
            if (tUnit === 'Months') numberOfInstallments = (N / 12) * 52;
            else if (tUnit === 'Weeks') numberOfInstallments = N;
            else if (tUnit === 'Days') numberOfInstallments = N / 7;
        } else if (repaymentFrequency === 'Daily') {
             if (tUnit === 'Months') numberOfInstallments = (N / 12) * 365;
             else if (tUnit === 'Weeks') numberOfInstallments = N * 7;
             else if (tUnit === 'Days') numberOfInstallments = N;
        } else {
            // Monthly
             if (tUnit === 'Months') numberOfInstallments = N;
             // ... other conversions if needed
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
                // Total Interest = P * AnnualRate * (Tenure in Years) / 100
                // We need Tenure in Years.
                let tenureInYears = N / 12; // Default if Months
                if (tUnit === 'Weeks') tenureInYears = N / 52;
                if (tUnit === 'Days') tenureInYears = N / 365;

                totalInterest = (P * annualRate * tenureInYears) / 100; 
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
            // Old Logic: Deduct from Principal
            // New Logic: Full Disbursal, Interest collected via separate Ledger Entry
            // netDisbursal -= firstMonthInterest; 
        }

        // 6. Generate Repayment Schedule & Calculate First Installment Date
        const { generateRepaymentSchedule } = await import('@/lib/loan-calculations');
        const { addMonths, addWeeks, addDays } = await import('date-fns');

        const disbursementDate = new Date(startDate);
        let firstInstallmentDate = new Date(disbursementDate);

        // If NOT interest paid in advance, First EMI is after 1 period
        // If interest paid in advance, First EMI is NOW (Disbursement Date)
        if (!interestPaidInAdvance) {
            if (repaymentFrequency === 'Weekly') firstInstallmentDate = addWeeks(firstInstallmentDate, 1);
            else if (repaymentFrequency === 'Daily') firstInstallmentDate = addDays(firstInstallmentDate, 1);
            else firstInstallmentDate = addMonths(firstInstallmentDate, 1); // Default Monthly
        }

        var schedule: any[] = [];
        let nextPaymentDate = null;
        let nextPaymentAmount = 0;

        if (!indefiniteTenure) {
            schedule = generateRepaymentSchedule({
                loanAmount: P,
                interestRate: R, // Yearly
                tenureMonths: N,
                tenureUnit: tUnit as any,
                loanScheme: loanScheme as any,
                interestType: interestType as any,
                interestRateUnit: 'Yearly',
                repaymentFrequency: repaymentFrequency as any,
                startDate: firstInstallmentDate, // Pass CALCULATED First EMI Date
                disbursementDate: new Date(), // Assuming disbursement happens NOW
                indefiniteTenure: false,
                interestPaidInAdvance: !!interestPaidInAdvance
            });


            if (schedule.length > 0) {
                nextPaymentDate = schedule[0].dueDate;
                nextPaymentAmount = schedule[0].amount;
            }
        } else {
            // Indefinite Tenure: Next payment is just next month's interest
             if (!interestPaidInAdvance) {
                // If standard, first interest due after 1 month
                nextPaymentDate = addMonths(disbursementDate, 1);
             } else {
                nextPaymentDate = new Date(disbursementDate);
             }
            
            // Calculate 1 month interest
            const r_monthly = (R / 12) / 100;
            nextPaymentAmount = Math.round(P * r_monthly);
        }

        // 7. Create Loan Record
        const loanId = `LN-${Date.now().toString().slice(-6)}`; 
        
        // Handle Advance Interest Payment Status in Schedule if Needed
        if (interestPaidInAdvance && schedule.length > 0) {
            // Mark first installment as paid
            schedule[0].status = 'paid';
            schedule[0].paidAmount = schedule[0].amount;
            schedule[0].paidDate = new Date();
            
            // Next payment becomes 2nd installment
            if (schedule.length > 1) {
                nextPaymentDate = schedule[1].dueDate;
                nextPaymentAmount = schedule[1].amount;
            } else {
                 // Should not happen usually unless N=0, but valid for safety
                 nextPaymentDate = null; 
                 nextPaymentAmount = 0;
            }
        }

        const newLoan = await Loan.create({
            client: client._id,
            loanId,
            loanAmount: P,
            interestRate: R,
            interestRateUnit: 'Yearly',
            tenureMonths: N,
            tenureUnit: tUnit,
            indefiniteTenure: !!indefiniteTenure,
            loanScheme,
            interestType,
            interestPaidInAdvance: !!interestPaidInAdvance,
            repaymentFrequency,
            processingFeePercent: PF_Percent,
            
            // Lifecycle 2.0
            gracePeriodDays: parseInt(gracePeriodDays) || 0,
            penaltyConfig: penaltyConfig || { type: 'Fixed', value: 0 },
            advancePaymentAction: advancePaymentAction || 'ReduceNextEMI',
            holidayHandling: holidayHandling || 'Ignore',
            
            calculatedEMI: Math.round(emi),
            totalInterest: Math.round(totalInterest),
            totalPayable: Math.round(totalPayable),
            netDisbursal: Math.round(netDisbursal),
            
            disbursementDate: disbursementDate, // User Selected
            startDate: firstInstallmentDate,    // Calculated First EMI
            
            // Future Tracking
            nextPaymentDate,
            nextPaymentAmount,
            repaymentSchedule: schedule,
            
            paymentModes: paymentModes.map((mode: any) => ({
                type: mode.type,
                amount: parseFloat(mode.amount),
                reference: mode.reference
            })),
            
            status: 'Active',
            disbursedBy: 'Admin User' 
        });

        // 7b. If Interest Paid In Advance, Create the Transaction & Handle Initial State
        if (interestPaidInAdvance) {
            // Update Transaction History for the Advance Payment
             const advanceTxn = {
                txnId: `TXN-ADV-${Date.now()}`,
                date: new Date(disbursementDate),
                amount: firstMonthInterest,
                type: 'Interest', // Explicitly Interest
                description: 'Interest Paid in Advance',
                reference: 'Auto-Deducted / Pre-Paid',
                paymentMode: 'System',
                interestComponent: firstMonthInterest,
                principalComponent: 0,
                balanceAfter: P // Principal is still P until repaid at end
            };

            await Loan.findOneAndUpdate(
                { _id: newLoan._id },
                { $push: { transactions: advanceTxn } }
            );
        }

        return NextResponse.json({ success: true, loan: newLoan, client });

    } catch (error: any) {
        console.error("Loan Creation Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        
        // Auth Check
        const hasAccess = await checkAccess(req, PERMISSIONS.VIEW_LOANS);
        if (!hasAccess) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const loans = await Loan.find({})
            .populate('client', 'firstName lastName photoUrl mobile address email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, loans });
    } catch (error: any) {
        console.error("Fetch Loans Error:", error);
        return NextResponse.json({ error: "Failed to fetch loans" }, { status: 500 });
    }
}
