import { generateLedger, LedgerEntry } from "./ledger-utils";

export interface LoanState {
    balance: number;
    status: "Active" | "Closed" | "Overdue" | "Settled" | "Rejected";
    accruedInterest: number;
    nextDueAmount: number;
    nextDueDate: string | null;
    totalPaid: number;
    principalBalance: number;
}

export function calculateLoanState(loan: any): LoanState {
    const history = generateLedger(loan);
    const lastEntry = history.length > 0 ? history[history.length - 1] : null;
    
    const balance = lastEntry ? lastEntry.balance : (loan.totalLoanAmount || loan.loanAmount || 0);
    
    // Total Paid
    const totalPaid = history.reduce((sum, e) => sum + (e.credit || 0), 0);
    
    // Status Logic
    let storedStatus = (loan.status || "Active").toLowerCase();
    let status = storedStatus.charAt(0).toUpperCase() + storedStatus.slice(1);
    
    // Balance-based status override
    if (balance > 0 && (storedStatus === "closed" || storedStatus === "settled")) {
        status = "Active"; 
    } else if (balance <= 0) {
        status = "Closed";
    }
    
    // Unpaid interest (sum of interest entries - sum of interest components in payments)
    const totalInterestAccrued = history.reduce((sum, e) => sum + (e.type === 'Interest' ? e.debit : 0), 0);
    const totalInterestPaid = history.reduce((sum, e) => sum + (e.interestComponent || 0), 0);
    const accruedInterest = Math.max(0, totalInterestAccrued - totalInterestPaid);
    
    // Principal Balance
    const principalBalance = Math.max(0, balance - accruedInterest);

    // Next Due Date & Amount
    // Find first interest cycle in future, or first pending installment if schedule exists
    // Next Due Date & Amount
    // 1. Determine if the user is "Caught Up" with interest
    const isCaughtUp = accruedInterest <= 1; // Tolerance for rounding errors
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextDueEntry = history.find(e => {
        if (e.type !== 'Interest') return false;
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        
        if (isCaughtUp) {
            // If fully paid, the "Next Due" is the FIRST COMING future cycle
            return d > today;
        } else {
            // If we owe money, we want to show the current relevant cycle
            // If we are overdue, this might still return a future date if we don't look back?
            // Actually, if we are overdue, the UI calculates "Overdue Since" separately below.
            // So "Next Payment Date" field should probably reflect the FUTURE cycle if we want to show "Upcoming",
            // OR the Current Cycle if it's "Current Due".
            // Let's stick to standard practice: Next Billing Date.
            // If Today is billing date and Unpaid -> Today is Next Due.
            // If Today is billing date and Paid -> Next Month is Next Due.
            return d >= today;
        }
    });

    const nextDueDate = nextDueEntry ? nextDueEntry.date : null;
    
    // Next amount: If interest only, it's the interest. If EMI, it's the EMI.
    let nextDueAmount = loan.calculatedEMI || loan.emiAmount || 0;
    if (loan.loanScheme === 'InterestOnly') {
        nextDueAmount = nextDueEntry ? nextDueEntry.debit : (loan.calculatedEMI || 0);
    }
    
    // Overdue Check
    const pastUnpaidInterest = history.find(e => {
        if (e.type !== 'Interest') return false;
        const d = new Date(e.date);
        d.setHours(0,0,0,0);
        
        // If it's in the past...
        if (d < today) {
            // Find if there's a payment AFTER this interest but BEFORE the next cycle
            // Or simpler: is accruedInterest > 0?
            return true;
        }
        return false;
    });

    if (accruedInterest > 0 && status === "Active") {
        // Find if last interest date is past today
        const lastInt = history.slice().reverse().find(e => e.type === 'Interest');
        if (lastInt) {
            const d = new Date(lastInt.date);
            d.setHours(0,0,0,0);
            if (d < today) status = "Overdue";
        }
    }

    return {
        balance,
        status: status as any,
        accruedInterest,
        nextDueAmount,
        nextDueDate,
        totalPaid,
        principalBalance
    };
}
