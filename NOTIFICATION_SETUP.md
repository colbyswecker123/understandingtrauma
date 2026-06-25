# Submission Email Notifications

This version sends an email every time someone submits a new message, if the notification variables are configured.

## Recommended provider

The code uses Resend's email API.

## Cloudflare Pages variables/secrets to add

Go to:

Cloudflare > Workers & Pages > understandingtrauma > Settings > Variables and Secrets

Add these Production variables:

RESEND_API_KEY = your Resend API key
NOTIFY_EMAIL = the email address where you want submission alerts
FROM_EMAIL = Understanding Trauma <notifications@your-verified-domain.com>
SITE_URL = https://understandingtrauma.org

Notes:

- If RESEND_API_KEY or NOTIFY_EMAIL is missing, message submissions still work. The notification just will not send.
- For best deliverability, verify a sending domain in Resend and use that in FROM_EMAIL.
- If you have not verified a sending domain yet, Resend may allow test sending from their onboarding sender only to your account email, depending on your account setup.

## Test

1. Deploy the files.
2. Add the variables.
3. Redeploy after adding variables.
4. Submit a test message on /user_messages/.
5. Confirm the message appears in /admin/messages/.
6. Confirm the email notification arrives.
