// backend/server/cron/reminderCron.js
const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const { sendEmail, sendSMS } = require('../services/notificationServices');

// Function to send notifications
const sendNotification = (reminder) => {
  if (reminder.notificationType === 'email') {
    sendEmail(reminder.userId.email, 'Reminder', reminder.message);
  } else if (reminder.notificationType === 'sms') {
    sendSMS(reminder.userId.phone, reminder.message);
  }
};

// Check reminders every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const reminders = await Reminder.find({
    notificationTime: { $lte: now }
  });

  reminders.forEach(async (reminder) => {
    sendNotification(reminder);
    // Optionally, delete the reminder after sending notification
    await Reminder.deleteOne({ _id: reminder._id });
  });
});
