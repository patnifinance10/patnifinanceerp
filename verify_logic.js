
// MOCKED LOGIC TEST
const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const isBefore = (d1, d2) => d1 < d2;
const addMonths = (d, n) => { const nd = new Date(d); nd.setMonth(nd.getMonth() + n); return nd; };

function calculateLoanState(loan) {
    const balance = loan.totalLoanAmount; // Simplified for test
    const storedStatus = (loan.status || "Active").toLowerCase();
    let status = storedStatus.charAt(0).toUpperCase() + storedStatus.slice(1);
    
    // THE FIX I APPLIED:
    if (balance > 0 && (storedStatus === "closed" || storedStatus === "settled")) {
        status = "Active"; 
    } else if (balance <= 0) {
        status = "Closed";
    }
    return { status, balance };
}

function generateLedger(loan) {
    const loanAmount = loan.loanAmount || loan.totalLoanAmount;
    const periodicRate = 0.1; // 10%
    
    // THE FIX I APPLIED (Logic snippet):
    let interestAmount = 0;
    if (loan.interestType === 'Flat') {
        interestAmount = Math.round(loanAmount * periodicRate);
    } else {
        interestAmount = Math.round(loan.outstandingPrincipal * periodicRate);
    }
    return interestAmount;
}

// TEST 1: Status Override
const mockLoanStatus = { totalLoanAmount: 63335, status: "closed" };
const state = calculateLoanState(mockLoanStatus);
console.log("Status Override Test:");
console.log("Input Status: closed, Balance: 63335");
console.log("Result Status:", state.status);
if (state.status === "Active") console.log("✅ Status fix verified");
else console.log("❌ Status fix failed");

// TEST 2: Flat Interest Logic
const mockLoanFlat = { loanAmount: 100000, interestType: "Flat", outstandingPrincipal: 50000 };
const mockLoanReducing = { loanAmount: 100000, interestType: "Reducing", outstandingPrincipal: 50000 };

const intFlat = generateLedger(mockLoanFlat);
const intRed = generateLedger(mockLoanReducing);

console.log("\nInterest Logic Test:");
console.log("Loan Amount: 100000, Outstanding: 50000, Rate: 10%");
console.log("Flat Result:", intFlat);
console.log("Reducing Result:", intRed);

if (intFlat === 10000 && intRed === 5000) console.log("✅ Interest logic verified");
else console.log("❌ Interest logic failed");
