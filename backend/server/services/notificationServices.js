// backend/server/services/notificationServices.js
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// SMS Configuration
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = new twilio(accountSid, authToken);

const sendSMS = (to, body) => {
  client.messages.create({
    body: body,
    from: process.env.TWILIO_PHONE,
    to: to
  })
  .then((message) => console.log(message.sid))
  .catch((error) => console.log(error));
};

module.exports = { sendEmail, sendSMS };
