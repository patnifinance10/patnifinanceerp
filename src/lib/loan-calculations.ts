import { addMonths, addWeeks, addDays } from 'date-fns';

interface LoanDetails {
    loanAmount: number;
    interestRate: number; // Yearly %
    tenureMonths: number;
    loanScheme: 'EMI' | 'InterestOnly';
    interestType: 'Flat' | 'Reducing';
    interestRateUnit: 'Yearly' | 'Monthly';
    repaymentFrequency: 'Monthly' | 'Weekly' | 'Daily';
    startDate: Date;
    indefiniteTenure: boolean;
}

export interface ScheduleItem {
    installmentNo: number;
    dueDate: Date;
    amount: number;
    principalComponent: number;
    interestComponent: number;
    balance: number;
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue';
    paidAmount: number;
}

export const generateRepaymentSchedule = (details: LoanDetails): ScheduleItem[] => {
    const {
        loanAmount: P,
        interestRate: R_Yearly,
        tenureMonths: N,
        loanScheme,
        interestType,
        interestRateUnit,
        repaymentFrequency,
        startDate,
        indefiniteTenure
    } = details;

    const schedule: ScheduleItem[] = [];
    
    // 1. Indefinite Tenure: No fixed schedule is generated upfront, updates are manual/monthly.
    if (indefiniteTenure) {
        return []; 
    }

    // 2. Determine Frequency Factors
    let frequencyDivisor = 12; // Default Monthly
    if (repaymentFrequency === 'Weekly') frequencyDivisor = 52;
    if (repaymentFrequency === 'Daily') frequencyDivisor = 365;

    // Normalize Rate to Period
    let r = R_Yearly;
    if (interestRateUnit === 'Monthly') {
        r = R_Yearly * 12; // Convert to Yearly first
    }
    const annualRate = r;
    const periodicRate = r / frequencyDivisor / 100;

    let balance = P;
    let currentDate = new Date(startDate);
    
    // N is tenureMonths (Duration in Months)
    // We need to convert this to Total Number of Installments
    let totalInstallments = N;
    if (repaymentFrequency === 'Weekly') totalInstallments = (N / 12) * 52;
    if (repaymentFrequency === 'Daily') totalInstallments = (N / 12) * 365;
    
    totalInstallments = Math.ceil(totalInstallments);

    // --- EMI Calculation Logic ---
    if (loanScheme === 'EMI') {
        let emi = 0;
        
        if (interestType === 'Flat') {
             // Total Interest = P * AnnualRate * (Tenure in Years) / 100
             // Tenure in Years = N / 12
             const totalInt = (P * annualRate * (N / 12)) / 100;
             const totalPay = P + totalInt;
             emi = totalPay / totalInstallments;
        } else {
             // Reducing Balance
             if (periodicRate === 0) emi = P / totalInstallments;
             else emi = (P * periodicRate * Math.pow(1 + periodicRate, totalInstallments)) / (Math.pow(1 + periodicRate, totalInstallments) - 1);
        }
        
        emi = Math.round(emi);

        for (let i = 1; i <= totalInstallments; i++) {
            let interestComponent = 0;
            let principalComponent = 0;

            if (interestType === 'Reducing') {
                interestComponent = balance * periodicRate;
            } else {
                // Flat: Interest per installment
                interestComponent = ((P * annualRate * (N/12))/100) / totalInstallments;
            }
            
            interestComponent = Math.round(interestComponent);
            
            // Adjust last installment logic
            let installmentAmount = emi;
            
            principalComponent = installmentAmount - interestComponent;
            
            if (interestType === 'Reducing' && i === totalInstallments) {
                 principalComponent = balance;
                 installmentAmount = principalComponent + interestComponent;
            }

            balance -= principalComponent;
            if(balance < 0) balance = 0;

            schedule.push({
                installmentNo: i,
                dueDate: new Date(currentDate),
                amount: installmentAmount,
                principalComponent,
                interestComponent,
                balance: Math.round(balance),
                status: 'pending',
                paidAmount: 0
            });

            // Increment Date
            if (repaymentFrequency === 'Monthly') currentDate = addMonths(currentDate, 1);
            else if (repaymentFrequency === 'Weekly') currentDate = addWeeks(currentDate, 1);
            else currentDate = addDays(currentDate, 1);
        }

    } else {
        // --- Interest Only Logic ---
        const periodicInterest = Math.round(P * periodicRate);

        for (let i = 1; i <= totalInstallments; i++) {
            const isLast = i === totalInstallments;
            const amount = isLast ? (P + periodicInterest) : periodicInterest;
            const principalComponent = isLast ? P : 0;
            const interestComponent = periodicInterest;

            balance -= principalComponent;

            schedule.push({
                installmentNo: i,
                dueDate: new Date(currentDate),
                amount: amount,
                principalComponent,
                interestComponent,
                balance: Math.round(balance),
                status: 'pending',
                paidAmount: 0
            });

             // Increment Date
             if (repaymentFrequency === 'Monthly') currentDate = addMonths(currentDate, 1);
             else if (repaymentFrequency === 'Weekly') currentDate = addWeeks(currentDate, 1);
             else currentDate = addDays(currentDate, 1);
        }
    }

    return schedule;
};
