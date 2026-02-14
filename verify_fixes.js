
const { calculateLoanState } = require('./src/lib/loan-state-engine');
const { generateLedger } = require('./src/lib/ledger-utils');

// Mock Loan Data
const mockLoan = {
    loanId: "LN-VERIFY-001",
    loanAmount: 100000,
    interestRate: 10,
    interestRateUnit: "Monthly",
    repaymentFrequency: "Monthly",
    interestType: "Flat", // Should now be handled correctly
    status: "closed", // Should be overridden to "Active" because balance > 0
    disbursedDate: "2025-01-01",
    transactions: [
        { date: "2025-01-01", amount: 10000, type: "Interest", interestComponent: 10000, principalComponent: 0 }
    ]
};

function testStatusOverride() {
    console.log("--- Testing Status Override ---");
    const state = calculateLoanState(mockLoan);
    console.log("Calculated Status:", state.status);
    if (state.status === "Active" && state.balance > 0) {
        console.log("✅ SUCCESS: Status overridden to Active");
    } else {
        console.log("❌ FAILURE: Status still " + state.status);
    }
}

function testFlatInterestLedger() {
    console.log("\n--- Testing Flat Interest Ledger ---");
    const ledger = generateLedger(mockLoan);
    
    // Check if interest entries are ₹10,000 (10% of 100,000)
    const intEntries = ledger.filter(e => e.type === "Interest");
    console.log("Found " + intEntries.length + " interest entries");
    
    const allTenK = intEntries.every(e => e.debit === 10000);
    if (allTenK && intEntries.length > 0) {
        console.log("✅ SUCCESS: Flat interest calculation correct (₹10,000 each)");
    } else if (intEntries.length > 0) {
        console.log("❌ FAILURE: Some interest entries were not ₹10,000");
    } else {
        console.log("ℹ️ No interest entries found (maybe too early in timeline)");
    }
}

testStatusOverride();
testFlatInterestLedger();
