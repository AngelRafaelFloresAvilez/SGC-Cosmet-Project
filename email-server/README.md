# SGC Email Server (Nodemailer)

Minimal Express service to send password-reset emails using SMTP (Gmail or other provider).

1) Copy `.env.example` to `.env` and fill the SMTP credentials (Gmail app password recommended).

2) Install and start:

```bash
cd email-server
npm install
npm start
```

3) Configure client

- By default the client tries `http://localhost:4000/send-reset`. To change, set `window.SGC_EMAIL_API` before loading `ResetPassword.js`.

Notes:
- For Gmail you need an app password if 2FA is enabled. Do not commit real credentials to the repo.
- This is a minimal demo server. For production, secure the endpoint (rate-limit, auth, validated origin).