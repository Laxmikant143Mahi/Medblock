const cron = require('node-cron');
const { checkExpiringMedicines } = require('./notifications');

// Run expiry check every day at midnight
const scheduleJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily medicine expiry check...');
        await checkExpiringMedicines();
    });
};

module.exports = scheduleJobs;
