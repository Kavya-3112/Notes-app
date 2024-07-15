// backend/server/models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  notificationType: { type: String, enum: ['email', 'sms'] },
  notificationTime: Date
});

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
