# Bug Fix: OTP Email Sending in Production

## Problem
The user reported that sending OTP for "forgot password" works locally but fails in the deployed application.

## Root Cause Analysis
The `userController.js` was using `path.join(process.cwd(), 'assets/footer.png')` to locate the email footer image. 
- In a local environment, `process.cwd()` usually points to the project root, making the path valid.
- In a deployed environment (especially serverless or containerized setups), the working directory (`process.cwd()`) might not be what is expected, causing the file path to resolve incorrectly. When `nodemailer` cannot find the attachment, it throws an error, causing the API request to fail.

## Solution implemented
Updated `backend/controllers/userController.js` to use `__dirname` for robust relative path resolution:
- Replaced `path.join(process.cwd(), 'assets/footer.png')` with `path.join(__dirname, '../assets/footer.png')`.
- This ensures the code always looks for the `assets` folder relative to the `controllers` folder, regardless of where the Node process was started.

## Verification
- Validated that `backend/assets/footer.png` exists locally.
- The path `../assets/footer.png` relative to `backend/controllers/userController.js` correctly resolves to `backend/assets/footer.png`.

## Next Steps
- The user should redeploy the backend.
- Ensure `VITE_BACKEND_URL` is set correctly in the frontend production environment.
- Ensure `SMTP_PASSWORD` and other environment variables are set in the backend production environment.
