require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Expected env variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
let transporterPromise = (async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback: create an Ethereal test account for local testing
  const testAccount = await nodemailer.createTestAccount();
  console.log('Using Ethereal test account. Preview messages at the URL returned in API response.');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
})();

app.post('/send-reset', async (req, res) => {
  try {
    const { to, link } = req.body;
    if (!to || !link) return res.status(400).json({ ok: false, error: 'missing_params' });

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject: 'Restablece tu contraseña - SGC Cosmetic',
      text: `Hola,\n\nHaz clic en el siguiente enlace para restablecer tu contraseña (válido 30 minutos):\n\n${link}\n\nSi no pediste este enlace, ignora este correo.`,
      html: `<p>Hola,</p><p>Haz clic en el siguiente enlace para restablecer tu contraseña (válido 30 minutos):</p><p><a href="${link}">${link}</a></p><p>Si no pediste este enlace, ignora este correo.</p>`
    };

    const transporter = await transporterPromise;
    const info = await transporter.sendMail(mailOptions);
    const preview = nodemailer.getTestMessageUrl(info) || null;
    return res.json({ ok: true, info, preview });
  } catch (error) {
    console.error('send-reset error', error);
    return res.status(500).json({ ok: false, error: 'send_failed' });
  }
});

app.listen(PORT, () => console.log('Email server listening on', PORT));
