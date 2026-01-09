import mongoose from "mongoose";

// Force model rebuild in dev to handle schema changes hot-reloading
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models['Loan'];
}

const LoanSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    loanId: {
        type: String,
        required: true,
        unique: true,
    },
    // Loan Configuration
    loanAmount: {
        type: Number,
        required: true,
    },
    interestRate: {
        type: Number,
        required: true,
    },
    interestRateUnit: {
        type: String,
        enum: ['Yearly', 'Monthly'],
        default: 'Yearly',
    },
    tenureMonths: {
        type: Number,
        required: true, // 0 if indefinite
    },
    indefiniteTenure: {
        type: Boolean,
        default: false,
    },
    loanScheme: {
        type: String,
        enum: ['EMI', 'InterestOnly'],
        required: true,
    },
    interestType: {
        type: String,
        enum: ['Flat', 'Reducing'],
        default: 'Flat',
    },
    interestPaidInAdvance: {
        type: Boolean,
        default: false,
    },
    repaymentFrequency: {
        type: String,
        enum: ['Monthly', 'Weekly', 'Daily'],
        default: 'Monthly',
    },
    processingFeePercent: {
        type: Number,
        default: 0,
    },
    
    // Calculated Values (Snapshot at creation)
    calculatedEMI: {
        type: Number,
        required: true,
    },
    totalInterest: {
        type: Number,
        required: true,
    },
    totalPayable: {
        type: Number,
        required: true,
    },
    netDisbursal: {
        type: Number,
        required: true,
    },
    
    // Dates
    disbursementDate: {
        type: Date,
        default: Date.now,
    },
    startDate: { // First EMI / Interest date
        type: Date,
        required: true,
    },
    
    // Future Payment Tracking
    nextPaymentDate: {
        type: Date,
    },
    nextPaymentAmount: {
        type: Number,
    },

    // Repayment Schedule
    repaymentSchedule: [{
        installmentNo: Number,
        dueDate: Date,
        amount: Number,
        principalComponent: Number,
        interestComponent: Number,
        balance: Number,
        status: {
            type: String,
            enum: ['pending', 'paid', 'partially_paid', 'overdue'],
            default: 'pending'
        },
        paidAmount: { type: Number, default: 0 },
        paidDate: Date
    }],

    // Payment Splits
    paymentModes: [{
        type: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        reference: String
    }],

    // Meta
    status: {
        type: String,
        enum: ['active', 'closed', 'defaulted', 'written_off'],
        default: 'active',
    },
    disbursedBy: {
        type: String, // Username or ID of admin
        required: true,
    }
}, {
    timestamps: true // Automatically handles createdAt and updatedAt
});

export default mongoose.models.Loan || mongoose.model("Loan", LoanSchema);
