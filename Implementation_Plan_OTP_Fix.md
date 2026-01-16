# OTP Sending Fix Plan

## Problem Analysis
The "Forgot Password" OTP functionality works locally but hangs (gets stuck "Sending OTP...") in the deployed environment.

## Potential Causes
1. **Missing Environment Variable**: The `SMTP_PASSWORD` is likely missing in the deployment environment (e.g., Vercel, Render, Heroku).
2. **Port Restrictions**: The hosting provider might be blocking SMTP ports (587, 465, 25).
3. **Gmail Security**: Gmail might be blocking the connection from the new server IP, even with an App Password (less likely if App Password is used, but possible).
4. **Timeouts**: The connection to Gmail might be timing out due to network strictness.

## Proposed Solution
1. **Verify Environment Variables**: User needs to explicitly add `SMTP_PASSWORD` and `SMTP_EMAIL` (if used) to their deployment platform's environment variables.
2. **Review Logs**: Check server logs for specific connection errors.
3. **Code Enhancement**:
    - Add connection timeout settings to Nodemailer.
    - Add more verbose logging for debugging.

## Actionable Steps for User
1. Check if `SMTP_PASSWORD` is set in your deployment dashboard.
2. If using a cloud provider like AWS or DigitalOcean, check if SMTP ports are open.
3. Redeploy after ensuring variables are present.
