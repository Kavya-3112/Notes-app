const Reminder = require('../models/Reminder'); // Ensure you have a Reminder model
const { sendEmail, sendSMS } = require('../services/notificationServices'); // Import notification services

exports.addReminder = async (req, res) => {
    const { message, notificationType, notificationTime } = req.body;
    const userId = req.user.id; // Assuming you have user info in req.user

    const reminder = new Reminder({
        userId,
        message,
        notificationType,
        notificationTime: new Date(notificationTime)
    });

    try {
        await reminder.save();
        res.status(201).send(reminder);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Function to send notifications (to be used by a scheduler)
exports.sendNotification = async () => {
    const now = new Date();
    const reminders = await Reminder.find({
        notificationTime: { $lte: now }
    });

    reminders.forEach(async (reminder) => {
        if (reminder.notificationType === 'email') {
            sendEmail(reminder.userId.email, 'Reminder', reminder.message);
        } else if (reminder.notificationType === 'sms') {
            sendSMS(reminder.userId.phone, reminder.message);
        }
        await Reminder.deleteOne({ _id: reminder._id }); // Optionally, delete the reminder after sending notification
    });
};
