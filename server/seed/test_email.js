require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('Testing email connection...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email connection FAILED:', error.message);
  } else {
    console.log('✅ Email connection SUCCESSFUL! Sending test email...');

    transporter.sendMail({
      from: `"Rosen Travels" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '✅ Test Email – Rosen Travels Email System Working!',
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;background:#f0f4f8;">
          <div style="background:#1a237e;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#fff;margin:0;">🌍 Rosen Travels</h1>
          </div>
          <div style="background:#fff;padding:30px;border-radius:0 0 12px 12px;">
            <h2 style="color:#00897b;">✅ Email System is Working!</h2>
            <p style="color:#546e7a;font-size:15px;">Your Nodemailer + Gmail SMTP setup is configured correctly.</p>
            <p style="color:#546e7a;font-size:15px;">Booking confirmation emails will now be sent automatically whenever a customer books a tour package.</p>
            <hr style="border:1px solid #e0e0e0;margin:20px 0;"/>
            <p style="color:#78909c;font-size:13px;">Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
        </div>
      `
    }, (err, info) => {
      if (err) {
        console.error('❌ Test email send FAILED:', err.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('   Check your inbox at:', process.env.EMAIL_USER);
      }
      process.exit(0);
    });
  }
});
