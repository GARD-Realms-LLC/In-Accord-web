import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

router.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    console.log('[Support] Received email request:', { name, email, subject, message });

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.SUPPORT_TO_EMAIL || process.env.SMTP_TO;

    if (smtpHost && smtpUser && smtpPass && toEmail) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort || 587,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });

      const info = await transporter.sendMail({
        from: `${name} <${email}>`,
        to: toEmail,
        subject: subject || 'Support request from In-Accord',
        text: message || '',
        html: `<p>${message || ''}</p><p>From: ${name} &lt;${email}&gt;</p>`
      });
      console.log('[Support] Email sent via SMTP:', info.messageId);
      return res.status(200).json({ ok: true, sent: true, id: info.messageId });
    }

    // Fallback: mock queue
    console.log('[Support] SMTP not configured, queued (mock).');
    return res.status(200).json({ ok: true, queued: true });
  } catch (err) {
    console.error('[Support] Error handling send:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
