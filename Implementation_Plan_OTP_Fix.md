# OTP Sending Fix Plan

## Problem Analysis
The "Forgot Password" OTP functionality works locally but hangs (gets stuck "Sending OTP...") in the deployed environment.

## Potential Causes
1. **Missing Environment Variable**: The `SMTP_PASSWORD` is likely missing in the deployment environment (e.g., Vercel, Render, Heroku).
2. **Port Restrictions**: The hosting provider might be blocking SMTP ports (587, 465, 25).
3. **Gmail Security**: Gmail might be blocking the connection from the new server IP, even with an App Password (less likely if App Password is used, but possible).
4. **Timeouts**: The connection to Gmail might be timing out due to network strictness.

## Revised Diagnosis (After Timeout)
The user confirmed a "Connection Timeout" after setting the password. This confirms the credentials are present, but **the connection to the mail server is blocked**.
This usually happens because cloud providers (AWS, GCP, DigitalOcean, Vercel) block the default SMTP submission port (587) or the old default (25).

## Revised Solution
Switch to **Port 465** (SMTPS) with `secure: true`. This uses SSL from the start (instead of STARTTLS via port 587) and is sometimes allowed where 587 is not.
If this also fails, the user will likely need to use a transactional email service defined via API (like SendGrid or Mailgun) or request their hosting provider to unblock SMTP.

## Actionable Steps for User
1. Redeploy the backend with the new Port 465 configuration.
2. If it still times out:
    - Contact hosting support to unblock "Outbound SMTP".
    - OR switch to an API-based email provider.
