const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost/oauth2callback' // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = {
  sendEmail,
};
