
import { generateRepaymentSchedule } from '../src/lib/loan-calculations';

const testAdvanceInterest = () => {
    console.log("Testing Advance Interest Logic...");

    const P = 100000;
    const R = 15; // 15% Yearly
    const N = 12; // 12 Months
    
    // Test Case: Interest Only, 12 Months, Advance Interest = True
    const schedule = generateRepaymentSchedule({
        loanAmount: P,
        interestRate: R,
        tenureMonths: N,
        tenureUnit: 'Months',
        loanScheme: 'InterestOnly',
        interestType: 'Flat', // Doesn't matter much for InterestOnly base calc usually
        interestRateUnit: 'Yearly',
        repaymentFrequency: 'Monthly',
        startDate: new Date(),
        disbursementDate: new Date(),
        indefiniteTenure: false,
        interestPaidInAdvance: true // <--- FLAG UNDER TEST
    });

    console.log(`Loan: ${P}, Tenure: ${N} Months, Advance: TRUE`);
    console.log(`Generated Schedule Length: ${schedule.length} (Expected: ${N + 1})`);
    
    if (schedule.length !== N + 1) {
        console.error("FAIL: Incorrect schedule length");
        return;
    }

    const firstInst = schedule[0];
    const lastInst = schedule[schedule.length - 1];
    const secondLastInst = schedule[schedule.length - 2];

    console.log("--- First Installment ---");
    console.log(`Amount: ${firstInst.amount}, Int: ${firstInst.interestComponent}, Prin: ${firstInst.principalComponent}`);
    
    if (firstInst.principalComponent !== 0) console.error("FAIL: First Installment should be Interest Only");
    else console.log("PASS: First Installment is Interest Only");

    console.log("--- Last Installment (Principal repayment) ---");
    console.log(`Amount: ${lastInst.amount}, Int: ${lastInst.interestComponent}, Prin: ${lastInst.principalComponent}`);

    if (lastInst.principalComponent !== P) console.error(`FAIL: Last Installment Principal should be ${P}, got ${lastInst.principalComponent}`);
    else console.log("PASS: Last Installment is Principal Retrieval");

    if (lastInst.interestComponent !== 0) console.error("FAIL: Last Installment should have 0 Interest");
    else console.log("PASS: Last Installment has 0 Interest");
    
    console.log("--- Second Last Installment (Last Interest Payment) ---");
    console.log(`Amount: ${secondLastInst.amount}`);

};

testAdvanceInterest();
