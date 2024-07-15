// backend/server/index.js or backend/server/app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const reminderRoutes = require('./routes/reminder');
require('./cron/reminderCron'); // Import the cron job

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', reminderRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});
