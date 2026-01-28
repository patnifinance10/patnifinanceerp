
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define Minimal Schema to read
const LoanSchema = new mongoose.Schema({}, { strict: false });
const Loan = mongoose.model('Loan', LoanSchema);

async function inspectLoan() {
    try {
        const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
        if (!uri) {
             const fs = require('fs');
             fs.writeFileSync('inspect_result.txt', "No DB URI found in env");
             return;
        }
        await mongoose.connect(uri);
        console.error("Connected to DB");

        // Fetch latest loan
        const loan = await Loan.findOne().sort({ createdAt: -1 });
        
const fs = require('fs');

        if (!loan) {
            fs.writeFileSync('inspect_result.txt', "No loans found");
            return;
        }

        let output = "";
        output += "=== LOAN INSPECTION ===\n";
        output += "Loan ID: " + loan.loanId + "\n";
        output += "Loan Amount: " + loan.loanAmount + "\n";
        output += "Net Disbursal: " + loan.netDisbursal + "\n";
        output += "Processing Fee %: " + loan.processingFeePercent + "\n";
        output += "Interest Rate: " + loan.interestRate + "\n";
        output += "Calculated EMI: " + loan.calculatedEMI + "\n";
        output += "Current Principal: " + loan.currentPrincipal + "\n";
        output += "Next Payment Amount: " + loan.nextPaymentAmount + "\n";
        output += "Repayment Frequency: " + loan.repaymentFrequency + "\n";
        output += "Interest Paid In Advance: " + loan.interestPaidInAdvance + "\n";
        output += "Transactions: " + JSON.stringify(loan.transactions, null, 2) + "\n";
        
        // Manual Calc Check
        const P = loan.loanAmount;
        const R = loan.interestRate; // Assume Yearly
        const Rate = (R / 12) / 100;
        const ExpectedEMI = P * Rate;
        output += `Manual Check (P=${P}, R=${R}/12%): ${ExpectedEMI}\n`;

        fs.writeFileSync('inspect_result.txt', output);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

inspectLoan();
