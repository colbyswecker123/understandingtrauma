# Understanding Trauma Security Additions

This version replaces the old admin token box with a standard username/password login form.

## Cloudflare Pages variables to add

Go to:

Workers & Pages > understandingtrauma > Settings > Variables and Secrets

Add these production variables/secrets:

ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_SESSION_SECRET

Recommended values:

ADMIN_USERNAME = your admin username, such as colby or admin
ADMIN_PASSWORD = a strong password that you want Safari/iPhone Passwords to save
ADMIN_SESSION_SECRET = a long random secret, at least 32 characters

Keep the existing ADMIN_TOKEN if you already use it. The API still supports it as a fallback, but the admin page now uses the login cookie.

## How the login works

The admin form posts to /api/admin/login.
A secure, HttpOnly, SameSite=Strict cookie is created after a successful login.
The cookie lasts 7 days.
The browser can save the username/password because the form uses autocomplete=username and autocomplete=current-password.
The password is not stored in localStorage or sessionStorage.

## Test after deploying

1. Open /admin/
2. Sign in with the username and password
3. Let iPhone/Safari save the login
4. Confirm pending messages load
5. Approve/reject a test message
6. Log out
7. Reopen /admin/ and test saved password autofill
