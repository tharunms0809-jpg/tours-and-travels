const nodemailer = require('nodemailer');

// ─── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter on startup (logs error but never crashes the server)
transporter.verify((error) => {
  if (error) {
    console.error('📧 Email service error:', error.message);
  } else {
    console.log('📧 Email service ready');
  }
});

// ─── HTML Template ─────────────────────────────────────────────────────────────
const buildBookingEmailHTML = ({ customerName, packageName, travelDate, bookingId, totalAmount }) => {
  const formattedDate = new Date(travelDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR'
  }).format(totalAmount);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation – Rosen Travels</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a237e 0%,#283593 50%,#3949ab 100%);padding:40px 40px 30px;text-align:center;">
              <div style="font-size:36px;font-weight:900;color:#ffffff;letter-spacing:2px;margin-bottom:6px;">🌍 ROSEN TRAVELS</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.80);letter-spacing:3px;text-transform:uppercase;">Your Journey Begins Here</div>
            </td>
          </tr>

          <!-- SUCCESS BADGE -->
          <tr>
            <td style="background:linear-gradient(135deg,#00897b,#00acc1);padding:20px 40px;text-align:center;">
              <span style="display:inline-block;background:rgba(255,255,255,0.20);border:2px solid rgba(255,255,255,0.50);color:#ffffff;padding:8px 28px;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:1px;">
                ✅ &nbsp; BOOKING CONFIRMED
              </span>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="padding:40px 40px 10px;">
              <h2 style="margin:0 0 12px;color:#1a237e;font-size:24px;">Dear ${customerName},</h2>
              <p style="margin:0;color:#546e7a;font-size:15px;line-height:1.7;">
                Thank you for choosing <strong>Rosen Travels</strong>! Your booking has been confirmed and we are excited to be a part of your journey. Please find your booking details below.
              </p>
            </td>
          </tr>

          <!-- BOOKING DETAILS CARD -->
          <tr>
            <td style="padding:30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border:2px solid #e3eafe;border-radius:12px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="background:#e8eaf6;padding:16px 24px;">
                    <span style="font-size:13px;font-weight:700;color:#3949ab;letter-spacing:1px;text-transform:uppercase;">📋 Booking Details</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px 8px;color:#78909c;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:40%;">Booking ID</td>
                  <td style="padding:16px 24px 8px;color:#1a237e;font-size:14px;font-weight:700;">#${bookingId}</td>
                </tr>
                <tr style="background:#f0f4ff;">
                  <td style="padding:12px 24px;color:#78909c;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Package</td>
                  <td style="padding:12px 24px;color:#263238;font-size:14px;font-weight:600;">${packageName}</td>
                </tr>
                <tr>
                  <td style="padding:12px 24px;color:#78909c;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Travel Date</td>
                  <td style="padding:12px 24px;color:#263238;font-size:14px;font-weight:600;">${formattedDate}</td>
                </tr>
                <tr style="background:#f0f4ff;">
                  <td style="padding:12px 24px 16px;color:#78909c;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Total Amount</td>
                  <td style="padding:12px 24px 16px;color:#00897b;font-size:18px;font-weight:800;">${formattedAmount}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- INCLUSIONS -->
          <tr>
            <td style="padding:0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#e8f5e9,#f1f8e9);border:1px solid #c8e6c9;border-radius:12px;padding:24px;">
                <tr>
                  <td colspan="2" style="padding-bottom:16px;">
                    <span style="font-size:13px;font-weight:700;color:#2e7d32;letter-spacing:1px;text-transform:uppercase;">🎁 Package Inclusions</span>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:6px 0;color:#388e3c;font-size:14px;">✓ &nbsp; Hotel Stay</td>
                  <td width="50%" style="padding:6px 0;color:#388e3c;font-size:14px;">✓ &nbsp; Food &amp; Meals</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#388e3c;font-size:14px;">✓ &nbsp; Transportation</td>
                  <td style="padding:6px 0;color:#388e3c;font-size:14px;">✓ &nbsp; Professional Guide</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- NEXT STEPS -->
          <tr>
            <td style="padding:0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8e1;border:1px solid #ffe082;border-radius:12px;padding:20px 24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#e65100;letter-spacing:1px;text-transform:uppercase;">📌 Next Steps</p>
                    <p style="margin:0;color:#5d4037;font-size:14px;line-height:1.7;">Our team will contact you within <strong>24 hours</strong> to confirm your travel itinerary. Please keep this email safe as your booking reference.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTACT -->
          <tr>
            <td style="padding:0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8eaf6;border-radius:12px;padding:20px 24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#3949ab;letter-spacing:1px;text-transform:uppercase;">📞 Contact Us</p>
                    <p style="margin:0;color:#37474f;font-size:14px;line-height:1.8;">
                      📧 Email: <a href="mailto:${process.env.EMAIL_USER}" style="color:#3949ab;text-decoration:none;font-weight:600;">${process.env.EMAIL_USER}</a><br/>
                      🌐 For queries or changes, reply to this email or contact our support team.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#1a237e;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 8px;color:#ffffff;font-size:15px;font-weight:700;">Rosen Travels Team</p>
              <p style="margin:0;color:rgba(255,255,255,0.65);font-size:12px;line-height:1.6;">
                We look forward to serving you and making your journey unforgettable.<br/>
                © ${new Date().getFullYear()} Rosen Travels. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// ─── Admin Notification HTML ────────────────────────────────────────────────────
const buildAdminEmailHTML = ({ customerName, customerEmail, packageName, travelDate, bookingId, totalAmount }) => {
  const formattedDate = new Date(travelDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR'
  }).format(totalAmount);

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Booking Alert</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#b71c1c,#c62828);padding:28px 32px;text-align:center;">
              <div style="font-size:20px;font-weight:800;color:#fff;">🔔 NEW BOOKING – ROSEN TRAVELS ADMIN</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 20px;color:#37474f;font-size:14px;">A new booking has been received. Details below:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
                <tr style="background:#fafafa;">
                  <td style="padding:12px 18px;color:#78909c;font-size:13px;font-weight:600;width:40%;">Booking ID</td>
                  <td style="padding:12px 18px;color:#1a237e;font-size:13px;font-weight:700;">#${bookingId}</td>
                </tr>
                <tr>
                  <td style="padding:12px 18px;color:#78909c;font-size:13px;font-weight:600;">Customer Name</td>
                  <td style="padding:12px 18px;color:#263238;font-size:13px;">${customerName}</td>
                </tr>
                <tr style="background:#fafafa;">
                  <td style="padding:12px 18px;color:#78909c;font-size:13px;font-weight:600;">Customer Email</td>
                  <td style="padding:12px 18px;color:#263238;font-size:13px;">${customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding:12px 18px;color:#78909c;font-size:13px;font-weight:600;">Package</td>
                  <td style="padding:12px 18px;color:#263238;font-size:13px;">${packageName}</td>
                </tr>
                <tr style="background:#fafafa;">
                  <td style="padding:12px 18px;color:#78909c;font-size:13px;font-weight:600;">Travel Date</td>
                  <td style="padding:12px 18px;color:#263238;font-size:13px;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding:12px 18px;color:#78909c;font-size:13px;font-weight:600;">Total Amount</td>
                  <td style="padding:12px 18px;color:#00897b;font-size:15px;font-weight:800;">${formattedAmount}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#b71c1c;padding:18px 32px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.8);font-size:12px;">Rosen Travels Admin System – Automated Notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// ─── Email Log helper ───────────────────────────────────────────────────────────
const logEmailResult = (type, recipient, success, error = null) => {
  const timestamp = new Date().toISOString();
  if (success) {
    console.log(`📧 [${timestamp}] ${type} email sent successfully → ${recipient}`);
  } else {
    console.error(`📧 [${timestamp}] ${type} email FAILED → ${recipient} | Error: ${error?.message || error}`);
  }
};

// ─── Send Booking Confirmation (with retry) ─────────────────────────────────────
const sendBookingConfirmation = async ({ customerName, customerEmail, packageName, travelDate, bookingId, totalAmount }, retries = 2) => {
  const subject = 'Booking Confirmation - Rosen Travels';

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      // Customer email
      await transporter.sendMail({
        from: `"Rosen Travels" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject,
        html: buildBookingEmailHTML({ customerName, packageName, travelDate, bookingId, totalAmount })
      });
      logEmailResult('Booking Confirmation (Customer)', customerEmail, true);

      // Admin notification
      await transporter.sendMail({
        from: `"Rosen Travels Booking Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `🔔 New Booking Received – ${packageName} | #${bookingId}`,
        html: buildAdminEmailHTML({ customerName, customerEmail, packageName, travelDate, bookingId, totalAmount })
      });
      logEmailResult('Admin Notification', process.env.EMAIL_USER, true);

      return { success: true };
    } catch (error) {
      logEmailResult('Booking Confirmation', customerEmail, false, error);
      if (attempt <= retries) {
        console.log(`📧 Retrying email (attempt ${attempt + 1} of ${retries + 1})...`);
        await new Promise(r => setTimeout(r, 2000 * attempt)); // exponential-ish backoff
      } else {
        return { success: false, error: error.message };
      }
    }
  }
};

module.exports = { sendBookingConfirmation };
