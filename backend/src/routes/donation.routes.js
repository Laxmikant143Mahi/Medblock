const express = require('express');
const { authenticateJWT, isNGO } = require('../middleware/auth');
const Donation = require('../models/Donation');
const User = require('../models/User');
const router = express.Router();

// Create donation request
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const { ngoId, medicines, pickupAddress, notes } = req.body;

        const ngo = await User.findOne({ _id: ngoId, role: 'ngo' });
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        const donation = await Donation.create({
            donor: req.user._id,
            ngo: ngoId,
            medicines,
            pickupAddress,
            notes
        });

        res.status(201).json(donation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating donation request' });
    }
});

// Get all donations (with filters for NGO/donor)
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (req.user.role === 'ngo') {
            query.ngo = req.user._id;
        } else {
            query.donor = req.user._id;
        }

        if (status) {
            query.status = status;
        }

        const donations = await Donation.find(query)
            .populate('donor', 'name email')
            .populate('ngo', 'name email')
            .populate('medicines.medicine')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })
            .exec();

        const count = await Donation.countDocuments(query);

        res.json({
            donations,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donations' });
    }
});

// Update donation status (NGO only)
router.patch('/:id/status', authenticateJWT, isNGO, async (req, res) => {
    try {
        const { status, notes } = req.body;
        const donation = await Donation.findOne({
            _id: req.params.id,
            ngo: req.user._id
        });

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.status = status;
        donation.statusHistory.push({
            status,
            updatedBy: req.user._id,
            notes
        });

        if (status === 'accepted') {
            donation.pickupDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Set pickup date to tomorrow
        }

        await donation.save();
        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating donation status' });
    }
});

// Cancel donation (donor only)
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const donation = await Donation.findOne({
            _id: req.params.id,
            donor: req.user._id,
            status: 'pending'
        });

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found or cannot be cancelled' });
        }

        donation.status = 'cancelled';
        donation.statusHistory.push({
            status: 'cancelled',
            updatedBy: req.user._id,
            notes: 'Cancelled by donor'
        });

        await donation.save();
        res.json({ message: 'Donation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling donation' });
    }
});

module.exports = router;
