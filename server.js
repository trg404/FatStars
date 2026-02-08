const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuration (set via environment variables) ---
const CONFIG = {
  businessName: process.env.BUSINESS_NAME || 'Fat Shack',
  googleReviewUrl: process.env.GOOGLE_REVIEW_URL || '',
  ownerEmail: process.env.OWNER_EMAIL || '',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Provide client-safe config
app.get('/api/config', function (req, res) {
  res.json({
    businessName: CONFIG.businessName,
    googleReviewUrl: CONFIG.googleReviewUrl
  });
});

// Receive feedback and email it to the owner
app.post('/api/feedback', async function (req, res) {
  const { rating, name, email, feedback } = req.body;

  if (!feedback || !rating) {
    return res.status(400).json({ error: 'Rating and feedback are required.' });
  }

  // Log feedback to console (always works, even without email configured)
  console.log('--- New Feedback ---');
  console.log('Rating:', rating, '/ 5');
  console.log('Name:', name || '(not provided)');
  console.log('Email:', email || '(not provided)');
  console.log('Feedback:', feedback);
  console.log('Time:', new Date().toISOString());
  console.log('--------------------');

  // If email is configured, send it
  if (CONFIG.smtp.user && CONFIG.smtp.pass && CONFIG.ownerEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: CONFIG.smtp.host,
        port: CONFIG.smtp.port,
        secure: CONFIG.smtp.secure,
        auth: {
          user: CONFIG.smtp.user,
          pass: CONFIG.smtp.pass
        }
      });

      const starDisplay = '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating);

      await transporter.sendMail({
        from: CONFIG.smtp.user,
        to: CONFIG.ownerEmail,
        subject: CONFIG.businessName + ' - Customer Feedback (' + rating + '/5 stars)',
        text: [
          CONFIG.businessName + ' - Customer Feedback',
          '',
          'Rating: ' + starDisplay + ' (' + rating + '/5)',
          'Customer Name: ' + (name || 'Not provided'),
          'Customer Email: ' + (email || 'Not provided'),
          '',
          'Feedback:',
          feedback,
          '',
          'Received: ' + new Date().toLocaleString()
        ].join('\n')
      });

      console.log('Feedback email sent to', CONFIG.ownerEmail);
    } catch (err) {
      console.error('Failed to send email:', err.message);
      // Still return success - feedback was logged to console
    }
  } else {
    console.log('Email not configured. Feedback logged to console only.');
  }

  res.json({ success: true });
});

app.listen(PORT, function () {
  console.log(CONFIG.businessName + ' rating app running on http://localhost:' + PORT);

  if (!CONFIG.googleReviewUrl) {
    console.log('WARNING: GOOGLE_REVIEW_URL is not set. 5-star reviews will not link anywhere.');
  }
  if (!CONFIG.smtp.user || !CONFIG.smtp.pass || !CONFIG.ownerEmail) {
    console.log('WARNING: Email is not configured. Feedback will only be logged to console.');
    console.log('Set OWNER_EMAIL, SMTP_USER, and SMTP_PASS to enable email notifications.');
  }
});
