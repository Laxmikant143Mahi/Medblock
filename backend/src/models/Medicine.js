const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    manufacturer: {
        type: String,
        required: true,
        trim: true
    },
    batchNumber: {
        type: String,
        required: true
    },
    barcode: {
        type: String,
        unique: true,
        required: true
    },
    manufacturingDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['tablet', 'syrup', 'injection', 'ointment', 'other']
    },
    composition: [{
        name: String,
        quantity: String
    }],
    verified: {
        type: Boolean,
        default: false
    },
    verificationHash: String, // For blockchain verification
    reports: [{
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        issue: {
            type: String,
            enum: ['counterfeit', 'quality', 'packaging', 'other']
        },
        description: String,
        status: {
            type: String,
            enum: ['pending', 'investigating', 'resolved'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

medicineSchema.index({ barcode: 1 });
medicineSchema.index({ name: 'text', manufacturer: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
