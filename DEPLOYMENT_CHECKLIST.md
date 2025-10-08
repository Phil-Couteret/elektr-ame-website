# Email Automation System - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Database Setup
- [ ] Backup current database
- [ ] Run `database/email-automation-tables.sql` on production database
- [ ] Verify 6 templates and 5 automation rules are created
- [ ] Test database connection from PHP

### 2. File Deployment
- [ ] Upload new API files:
  - `api/classes/EmailAutomation.php`
  - `api/classes/TaxCalculator.php`
  - `api/cron-email-automation.php`
  - `api/email-automation-trigger.php`
  - `api/email-automation-stats.php`
  - `api/email-templates-list.php`
  - `api/email-test-send.php`
- [ ] Upload updated API files:
  - `api/join-us.php`
  - `api/members-update-status.php`
  - `api/members-update-membership.php`
- [ ] Upload new SQL file:
  - `database/email-automation-tables.sql`
- [ ] Upload build files from `dist/`:
  - `dist/index.html`
  - `dist/assets/*` (all new JS/CSS files)

### 3. Frontend Verification
- [ ] Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- [ ] Log into admin panel
- [ ] Verify "Email Automation" tab appears
- [ ] Check all 4 sub-tabs load (Recent, Queue, Rules, Templates)
- [ ] Test language switching (EN, ES, CA)

### 4. Backend Testing
- [ ] Test manual cron trigger:
  ```
  https://www.elektr-ame.com/api/cron-email-automation.php?manual_trigger=1
  ```
- [ ] Verify JSON response with statistics
- [ ] Check `email_queue` and `email_logs` tables

### 5. Email Testing
- [ ] Send test email from admin panel
- [ ] Check spam folder if not received
- [ ] Verify email content and formatting
- [ ] Test in all 3 languages if possible

## 🚀 Deployment Steps

### Step 1: Database Migration
```bash
# SSH into OVH server
ssh your-username@your-server.ovh.net

# Navigate to database directory
cd ~/www/database

# Run the SQL script
mysql -u elektry2025 -p elektry2025 < email-automation-tables.sql

# Verify installation
mysql -u elektry2025 -p elektry2025 -e "SELECT COUNT(*) FROM email_templates;"
```

Expected output: `6`

### Step 2: Upload Backend Files

**Option A: Via FTP (FileZilla, etc.)**
1. Connect to OVH FTP
2. Upload all files from local `api/` to server `~/www/api/`
3. Ensure correct permissions (644 for .php files)

**Option B: Via Git (Recommended)**
```bash
# SSH into server
ssh your-username@your-server.ovh.net

# Navigate to website directory
cd ~/www

# Pull latest changes
git pull origin main

# Set permissions
chmod 644 api/*.php
chmod 644 api/classes/*.php
```

### Step 3: Upload Frontend Build

```bash
# From your local machine, upload dist/ contents to server
scp -r dist/* your-username@your-server.ovh.net:~/www/

# Or via FTP, upload:
# - dist/index.html → ~/www/index.html
# - dist/assets/* → ~/www/assets/
```

### Step 4: Configure Cron Job

1. Log into **OVH Control Panel**
2. Go to **"Hébergement" → "Tâches planifiées (CRON)"**
3. Click **"Ajouter une planification"**
4. Configure:
   - **Language**: PHP 8.4
   - **Script path**: `~/www/api/cron-email-automation.php`
   - **Frequency**: Every 15 minutes (*/15 in hour field, * in all others)
   - **Email**: Your admin email (optional, for error notifications)
5. Save and activate

### Step 5: Verify Cron Job

**Test immediately:**
```bash
# SSH into server
ssh your-username@your-server.ovh.net

# Run cron script manually
cd ~/www
php api/cron-email-automation.php

# Check output
# Should see: "Email Automation Cron Job Started" and statistics
```

**Or test via browser:**
```
https://www.elektr-ame.com/api/cron-email-automation.php?manual_trigger=1
```

Expected JSON response:
```json
{
  "success": true,
  "timestamp": "2025-01-XX XX:XX:XX",
  "duration": 0.XX,
  "expiring_memberships": {"7d": 0, "3d": 0, "1d": 0},
  "queue_processing": {"sent": 0, "failed": 0, "total": 0},
  "queue_status": [...]
}
```

## 🧪 Post-Deployment Testing

### Test 1: Welcome Email Flow
1. Register a new test member via "Join Us" form
2. Check admin panel → Email Automation → Queue Status
3. Should see 1 pending email with template "member_welcome"
4. Run cron job (click "Run Now" in admin or visit manual trigger URL)
5. Check "Recent Emails" tab - email should show as "sent"
6. Check test member's email inbox

### Test 2: Approval Email Flow
1. Admin panel → Members tab
2. Find a pending member
3. Click "Approve"
4. Check Email Automation → Queue Status
5. Should see "member_approved" email queued
6. Run cron job
7. Verify email received

### Test 3: Expiration Reminder (Simulated)
```sql
-- Create/update a test member with expiration in 7 days
UPDATE members 
SET membership_end_date = DATE_ADD(NOW(), INTERVAL 7 DAY),
    membership_type = 'basic',
    status = 'approved'
WHERE id = [TEST_MEMBER_ID];

-- Run cron job (via browser or admin panel)
-- Check email_queue for 'membership_expiring_7d'
SELECT * FROM email_queue WHERE template_key = 'membership_expiring_7d';
```

### Test 4: Admin Panel Features
- [ ] Navigate to Email Automation tab
- [ ] View statistics (should show 0s initially)
- [ ] Check all 4 sub-tabs render without errors
- [ ] Click "Send Test" button
  - [ ] Select a template
  - [ ] Confirm test email received at admin email
- [ ] Click "Run Now" button
  - [ ] Verify success message appears
  - [ ] Check queue updates
- [ ] Test language switching (EN/ES/CA)

## 📊 Monitoring

### Check Email Queue Status
```sql
-- View current queue
SELECT status, priority, COUNT(*) as count 
FROM email_queue 
GROUP BY status, priority;

-- View recent sent emails
SELECT * FROM email_logs 
ORDER BY sent_at DESC 
LIMIT 20;

-- Check for failed emails
SELECT * FROM email_queue 
WHERE status = 'failed';
```

### Admin Panel Monitoring
1. Log into admin panel
2. Go to "Email Automation" tab
3. Check statistics cards:
   - Emails Sent (last 30 days)
   - Pending in Queue
   - Failed
4. Review "Recent Emails" for any failures
5. Check "Queue Status" for backlog

### Set Up Alerts (Optional)
Configure OVH cron job to send email on errors:
- Enable email notifications in cron configuration
- Errors will be sent to your admin email
- Monitor for consistent failures

## 🐛 Troubleshooting

### Issue: Emails Not Sending

**Check 1: Is cron running?**
```bash
# View cron logs (if OVH provides them)
cat /var/log/cron.log | grep email-automation

# Or check last cron execution time
ls -la ~/www/api/cron-email-automation.php
```

**Check 2: Are emails queued?**
```sql
SELECT * FROM email_queue WHERE status = 'pending';
```

**Check 3: PHP mail() working?**
```bash
php -r "mail('your@email.com', 'Test Subject', 'Test body');"
```

**Check 4: Check error logs**
```sql
SELECT * FROM email_logs WHERE status = 'failed' ORDER BY sent_at DESC LIMIT 10;
```

### Issue: Emails in Spam

**Solution:**
1. Check SPF record in DNS: `v=spf1 include:spf.ovh.net ~all`
2. Consider using SMTP instead of `mail()`
3. Avoid spam trigger words
4. Keep professional "From" address: `noreply@elektr-ame.com`

### Issue: High Queue Backlog

**Solutions:**
1. Increase cron frequency (every 5 or 10 minutes instead of 15)
2. Increase batch size in `EmailAutomation.php` → `processQueue(100)`
3. Check for email server rate limits
4. Review failed emails and clear old ones

### Issue: Admin Tab Not Appearing

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Check console for JavaScript errors
3. Verify all translation keys exist in `en.ts`, `es.ts`, `ca.ts`
4. Check admin authentication

## 📈 Success Metrics

After 1 week of operation, verify:
- [ ] Welcome emails sent to all new registrations
- [ ] Approval emails sent for all approved members
- [ ] No emails stuck in "pending" for >1 hour
- [ ] Failed email rate <5%
- [ ] No duplicate emails sent to same recipient
- [ ] Expiration reminders sent 7 days before expiration
- [ ] Admin panel statistics updating correctly

## 🔄 Maintenance

### Weekly
- [ ] Check admin panel statistics
- [ ] Review failed emails
- [ ] Clear old failed emails (>7 days old)

### Monthly
- [ ] Analyze email open/engagement (manual for now)
- [ ] Review and update email templates if needed
- [ ] Check for any spam complaints
- [ ] Backup `email_logs` table

### Quarterly
- [ ] Review automation rules effectiveness
- [ ] Update email content for season/events
- [ ] Optimize template language/messaging
- [ ] Consider adding new automation triggers

## 📝 Rollback Plan

If critical issues occur:

### Quick Rollback (Frontend Only)
```bash
# Revert to previous commit
git revert HEAD
git push

# Or restore previous dist/ files
```

### Full Rollback (Backend + Frontend)
```bash
# Revert commits
git revert 1544a1d  # Email automation commit
git push

# Disable cron job in OVH panel

# Optionally drop tables (if needed)
mysql -u elektry2025 -p elektry2025 <<EOF
DROP TABLE IF EXISTS email_logs;
DROP TABLE IF EXISTS email_queue;
DROP TABLE IF EXISTS email_automation_rules;
DROP TABLE IF EXISTS email_templates;
EOF
```

## 🎯 Next Steps

After successful deployment:

1. **Monitor first 24 hours closely**
   - Check email delivery
   - Watch for errors
   - Verify cron executions

2. **Test all email flows**
   - Registration → Welcome
   - Approval → Notification
   - Renewal → Confirmation
   - Sponsor donation → Tax receipt

3. **Gather feedback**
   - Ask team to review email content
   - Check member reactions
   - Adjust templates if needed

4. **Plan improvements**
   - HTML email templates
   - SMTP integration
   - Analytics dashboard
   - A/B testing

## 📞 Support Contacts

- **Technical Issues**: Check `EMAIL_AUTOMATION_SETUP.md`
- **Database Issues**: Verify SQL syntax, check permissions
- **Email Delivery**: Contact OVH support for SMTP issues
- **General Questions**: contact@elektr-ame.com

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Notes**: _____________________________________________


