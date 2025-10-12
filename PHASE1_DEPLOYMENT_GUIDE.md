# Phase 1: Essential Security - Deployment Guide

## 🎯 What's New

This deployment adds **critical security features** to your membership platform:

### 1. **Password Reset / Forgot Password** ✅
- Members can request password reset via email
- Secure token-based system (1-hour expiration)
- Protection against email enumeration attacks
- Automatic email notifications

### 2. **Email Verification** ✅
- All new registrations require email verification
- Verification link sent automatically on signup
- Members cannot login until email is verified
- Ability to resend verification emails

---

## 📦 What's Included

### **New API Endpoints** (4 files in `api/`)
1. `password-reset-request.php` - Request password reset
2. `password-reset-confirm.php` - Confirm reset with token and set new password
3. `email-verify.php` - Verify email with token
4. `email-resend-verification.php` - Resend verification email

### **New Frontend Pages** (4 files in `src/pages/`)
1. `ForgotPassword.tsx` - Password reset request form
2. `ResetPassword.tsx` - New password entry form
3. `VerifyEmail.tsx` - Email verification confirmation
4. `ResendVerification.tsx` - Resend verification form

### **Database Schema** (1 file in `database/`)
- `auth-security-tables.sql` - Password reset tokens table + email verification fields

### **Updated Files**
- `api/join-us.php` - Now generates verification tokens and sends verification emails
- `api/member-login.php` - Now checks email verification status before login
- `src/App.tsx` - Added 4 new routes
- `src/pages/MemberLogin.tsx` - Added "Forgot Password?" link
- All 3 language files (`en.ts`, `es.ts`, `ca.ts`) - 56 new translation keys

---

## 🚀 Deployment Steps

### Step 1: Download Deployment Package
1. Go to https://github.com/Phil-Couteret/elektr-ame-website/actions
2. Click on the latest workflow run (should say "Phase 1: Essential Security...")
3. Scroll down to "Artifacts"
4. Download the `deployment` artifact
5. Extract the ZIP file

### Step 2: Database Migration
1. Log in to your **phpMyAdmin** (https://phpmyadmin.cluster027.hosting.ovh.net)
2. Select database: `elektry2025`
3. Click "SQL" tab
4. Copy the content of `database/auth-security-tables.sql`
5. Paste and click "Go"
6. **Verify:**
   - New table: `password_reset_tokens`
   - New columns in `members` table: `email_verified`, `email_verification_token`, `email_verified_at`

### Step 3: Upload Files via FTP
Upload to your OVH server (`philippe.couteret.cluster027.hosting.ovh.net`):

```
/www/ (or your web root)
├── api/
│   ├── password-reset-request.php          [NEW]
│   ├── password-reset-confirm.php          [NEW]
│   ├── email-verify.php                    [NEW]
│   ├── email-resend-verification.php       [NEW]
│   ├── join-us.php                         [UPDATED]
│   └── member-login.php                    [UPDATED]
├── database/
│   └── auth-security-tables.sql            [NEW]
├── assets/                                  [REPLACE ALL]
├── index.html                               [REPLACE]
└── [all other static files]                 [REPLACE]
```

**⚠️ IMPORTANT:** Do NOT upload `api/config.php` - keep your existing one with database credentials!

### Step 4: Set Email From Address (Optional)
If your server supports custom email headers, update these files to use your domain:
- `api/password-reset-request.php` - Line ~62: `From: noreply@elektr-ame.com`
- `api/password-reset-confirm.php` - Line ~98: `From: noreply@elektr-ame.com`
- `api/email-verify.php` - Line ~69: `From: noreply@elektr-ame.com`
- `api/email-resend-verification.php` - Line ~80: `From: noreply@elektr-ame.com`
- `api/join-us.php` - Line ~180: `From: noreply@elektr-ame.com`

### Step 5: Test the Features

#### Test 1: Email Verification (New Registration)
1. Go to https://www.elektr-ame.com/join-us
2. Fill out the registration form with a **real email you can access**
3. Submit the form
4. Check your email inbox for "Verify Your Email - Elektr-Âme"
5. Click the verification link
6. You should see "Email verified successfully!"
7. Try to log in - it should work now

#### Test 2: Forgot Password
1. Go to https://www.elektr-ame.com/member-login
2. Click "Forgot password?"
3. Enter your email address
4. Check your email for "Password Reset Request - Elektr-Âme"
5. Click the reset link
6. Enter a new password (at least 8 characters)
7. Submit - you should be redirected to login
8. Log in with your new password

#### Test 3: Resend Verification
1. Go to https://www.elektr-ame.com/resend-verification
2. Enter an unverified member's email
3. Check email for new verification link

---

## 🔒 Security Features

### What's Protected
✅ **Token Expiration:** Reset tokens expire after 1 hour  
✅ **Single Use:** Tokens can only be used once  
✅ **Email Enumeration Protection:** Responses don't reveal if email exists  
✅ **Password Requirements:** Minimum 8 characters  
✅ **Email Verification Required:** Cannot login without verified email  
✅ **Secure Hashing:** `PASSWORD_DEFAULT` (bcrypt)  

### Database Cleanup (Optional)
To remove expired tokens, run this periodically:
```sql
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() AND used = 0;
```

---

## 🌐 New URLs

Your members now have access to:
- https://www.elektr-ame.com/forgot-password
- https://www.elektr-ame.com/reset-password?token=...
- https://www.elektr-ame.com/verify-email?token=...
- https://www.elektr-ame.com/resend-verification

---

## 📧 Email Templates

All emails are plain text with clear, professional language in 3 languages (EN/ES/CA).

### Emails Sent:
1. **Email Verification** (on registration)
2. **Password Reset Request** (on forgot password)
3. **Password Reset Confirmation** (after successful reset)
4. **Welcome Email** (after email verification)

---

## 🐛 Troubleshooting

### Issue: "Email not verified" error on login
**Solution:** Member needs to check their email and click the verification link, or use `/resend-verification`

### Issue: Reset emails not arriving
**Solution:** 
1. Check spam/junk folder
2. Verify PHP `mail()` function is working on your server
3. Consider using SMTP (future enhancement)

### Issue: Tokens not working
**Solution:**
1. Verify database migration was successful
2. Check that `password_reset_tokens` table exists
3. Check token hasn't expired (1 hour limit)

### Issue: Existing members cannot login
**Solution:** Existing members need email verification. Admin should:
1. Go to Admin Panel > Members
2. Click "Set Password" (🔑) for the member
3. Send them the password manually
4. They can then login and verify their email

---

## ✅ Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] All new files uploaded
- [ ] `api/config.php` still has correct credentials
- [ ] Tested new registration with email verification
- [ ] Tested forgot password flow
- [ ] Tested resend verification
- [ ] Existing members can still login
- [ ] Email notifications working

---

## 📊 Metrics to Monitor

After deployment, monitor:
- **Email verification rate:** How many members verify their email?
- **Password reset requests:** Track usage
- **Bounced emails:** Update email configuration if high

---

## 🎉 You're Done!

Your platform now has **production-ready** security features! 

**Next Phase:** Would you like to proceed with Phase 2 (Analytics Dashboard) or Phase 3 (Member Features)?

---

**Questions?** Check the code comments or reach out for support!

