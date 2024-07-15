// backend/server/routes/reminder.js
const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Route to create a new reminder
router.post('/reminders', async (req, res) => {
  const { userId, message, notificationType, notificationTime } = req.body;

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
});

module.exports = router;
