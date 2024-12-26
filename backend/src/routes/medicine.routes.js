const express = require('express');
const { authenticateJWT, isAdmin } = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const router = express.Router();

// Get all medicines (with pagination and filters)
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category } = req.query;
        const query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (category) {
            query.category = category;
        }

        const medicines = await Medicine.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Medicine.countDocuments(query);

        res.json({
            medicines,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medicines' });
    }
});

// Get medicine by barcode
router.get('/barcode/:barcode', authenticateJWT, async (req, res) => {
    try {
        const medicine = await Medicine.findOne({ barcode: req.params.barcode });
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medicine' });
    }
});

// Add medicine to user's cabinet
router.post('/cabinet', authenticateJWT, async (req, res) => {
    try {
        const { medicineId, expiryDate, quantity } = req.body;

        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        const user = await User.findById(req.user._id);
        user.medicineCabinet.push({
            medicine: medicineId,
            expiryDate,
            quantity
        });

        await user.save();
        res.status(201).json(user.medicineCabinet);
    } catch (error) {
        res.status(500).json({ message: 'Error adding medicine to cabinet' });
    }
});

// Report counterfeit medicine
router.post('/:id/report', authenticateJWT, async (req, res) => {
    try {
        const { issue, description } = req.body;
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        medicine.reports.push({
            reportedBy: req.user._id,
            issue,
            description
        });

        await medicine.save();
        res.status(201).json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error reporting medicine' });
    }
});

// Admin routes
router.post('/', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);
        res.status(201).json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error creating medicine' });
    }
});

router.put('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error updating medicine' });
    }
});

module.exports = router;
