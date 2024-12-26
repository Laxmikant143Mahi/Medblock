const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medicines: [{
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'collected', 'completed', 'cancelled'],
        default: 'pending'
    },
    pickupAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    pickupDate: Date,
    notes: String,
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'accepted', 'collected', 'completed', 'cancelled']
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
