const nodemailer = require('nodemailer');
const User = require('../models/User');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Send email notification
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Add notification to user
const addNotification = async (userId, message, type) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        user.notifications.push({
            message,
            type,
            read: false
        });

        await user.save();
    } catch (error) {
        console.error('Error adding notification:', error);
    }
};

// Check for expiring medicines and send notifications
const checkExpiringMedicines = async () => {
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const users = await User.find({})
            .populate('medicineCabinet.medicine');

        for (const user of users) {
            const expiringMedicines = user.medicineCabinet.filter(item => {
                return item.expiryDate <= thirtyDaysFromNow;
            });

            if (expiringMedicines.length > 0) {
                // Add in-app notification
                const message = `You have ${expiringMedicines.length} medicine(s) expiring soon`;
                await addNotification(user._id, message, 'expiry');

                // Send email notification
                const emailHtml = `
                    <h2>Medicine Expiry Alert</h2>
                    <p>The following medicines in your cabinet are expiring soon:</p>
                    <ul>
                        ${expiringMedicines.map(item => `
                            <li>${item.medicine.name} - Expires on ${item.expiryDate.toLocaleDateString()}</li>
                        `).join('')}
                    </ul>
                    <p>Please check your medicine cabinet and take appropriate action.</p>
                `;

                await sendEmail(
                    user.email,
                    'Medicine Expiry Alert',
                    emailHtml
                );
            }
        }
    } catch (error) {
        console.error('Error checking expiring medicines:', error);
    }
};

// Send donation status notification
const sendDonationNotification = async (donation, type) => {
    try {
        let message, emailSubject, emailHtml;
        const recipientId = type === 'donor' ? donation.donor : donation.ngo;
        
        switch (donation.status) {
            case 'accepted':
                message = 'Your donation request has been accepted';
                emailSubject = 'Donation Request Accepted';
                emailHtml = `
                    <h2>Donation Request Accepted</h2>
                    <p>Your donation request has been accepted. Pickup has been scheduled for ${donation.pickupDate.toLocaleDateString()}</p>
                `;
                break;
            case 'collected':
                message = 'Medicines have been collected';
                emailSubject = 'Medicines Collected';
                emailHtml = `
                    <h2>Medicines Collected</h2>
                    <p>The medicines have been successfully collected.</p>
                `;
                break;
            // Add more cases as needed
        }

        if (message) {
            await addNotification(recipientId, message, 'donation');
            const user = await User.findById(recipientId);
            await sendEmail(user.email, emailSubject, emailHtml);
        }
    } catch (error) {
        console.error('Error sending donation notification:', error);
    }
};

module.exports = {
    sendEmail,
    addNotification,
    checkExpiringMedicines,
    sendDonationNotification
};
