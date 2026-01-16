# Resend Implementation Guide
I have replaced the SMTP (Nodemailer) implementation with **Resend** to solve the connection timeout issues. Resend uses HTTP (Port 443) which is never blocked by firewalls.

## Required Action (Critical)
You must now set up the `RESEND_API_KEY` in your environment.

### 1. Get API Key
1.  Go to [Resend.com](https://resend.com) and sign up/login.
2.  Create an API Key.
3.  (Optional but Recommended) Verify your domain (e.g., `aalaboo.com`) to send emails from your own domain.
4.  If you don't verify a domain, you can only send to **your own email address** (the one you signed up with) using `onboarding@resend.dev`.

### 2. Update Environment Variables
Add this to your `.env` file locally AND in your deployment dashboard (Vercel/Render/etc.):

```
RESEND_API_KEY=re_123456789...
```

### 3. Verify Sender
By default, the code uses:
`from: 'Aalaboo <onboarding@resend.dev>'`

*   **Testing**: This works ONLY if you send emails to the email address you used to sign up for Resend.
*   **Production**: You MUST verify your domain on Resend. Once verified, update the code in `backend/controllers/userController.js` to use your domain:
    *   Change `onboarding@resend.dev` to `info@yourdomain.com`.

### 4. Deploy
Commit the changes and redeploy. The timeout issue should be gone.
