import nodemailer from 'nodemailer';

const SMTP_HOST = process.env['SMTP_HOST'];
const SMTP_PORT = parseInt(process.env['SMTP_PORT'] || '587');
const SMTP_USER = process.env['SMTP_USER'];
const SMTP_PASS = process.env['SMTP_PASS'];
const EMAIL_FROM = process.env['EMAIL_FROM'] || '"El Eulma Store" <no-reply@eleulmastore.dz>';

export const sendEmail = async (to: string, subject: string, html: string) => {
  let transporter;

  // Use SMTP if configured, otherwise fallback to local sendmail
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    // FALLBACK: Use local sendmail (built into Linux)
    // This allows sending "real" emails without a third-party account!
    console.log('📬 Using local SENDMAIL transport...');
    transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}`);
    
    // If using Ethereal/Test, log the preview URL
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log('🔗 Preview URL: ' + preview);
    }
  } catch (error) {
    console.error('❌ Failed to send email via current transport:', error);
    
    // FINAL FALLBACK: Ethereal (for debugging)
    console.warn('🔄 Attempting last-resort Ethereal transport...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      const info = await testTransporter.sendMail({ from: EMAIL_FROM, to, subject, html });
      console.log('🔗 Backup Preview URL: ' + nodemailer.getTestMessageUrl(info));
    } catch (finalErr) {
      console.error('💀 All email transports failed.');
    }
  }
};

export const sendResetKeyEmail = async (email: string, key: string) => {
  const subject = 'Password Reset Key - El Eulma Store';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #27ae60; text-align: center;">El Eulma Store</h2>
      <p>Hello,</p>
      <p>You requested a password reset. Use the follow key to verify your identity:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; border: 1px dashed #27ae60;">
          ${key}
        </span>
      </div>
      <p>This key will expire in 1 hour. If you didn't request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #888; text-align: center;">
        &copy; ${new Date().getFullYear()} El Eulma Store. All rights reserved.
      </p>
    </div>
  `;

  await sendEmail(email, subject, html);
};
