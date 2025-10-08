# Email Automation System - Setup Guide

## Overview

The Email Automation System provides comprehensive automated email communication for membership management, including:

- **Welcome emails** when members register
- **Approval/rejection notifications** when admins review memberships
- **Expiration reminders** (7, 3, and 1 day before expiration)
- **Renewal confirmations** when members renew
- **Tax receipts** for sponsor-level donations (€40+)
- **Scheduled campaigns** via admin panel

## Database Setup

### 1. Run the SQL Schema

Execute the following SQL file to create all necessary tables:

```bash
mysql -u elektry2025 -p elektry2025 < database/email-automation-tables.sql
```

This creates:
- `email_templates` - Email templates in 3 languages (EN, ES, CA)
- `email_automation_rules` - Trigger rules for automated emails
- `email_queue` - Queue for pending/scheduled emails
- `email_logs` - History of sent emails

### 2. Verify Default Data

The script automatically inserts:
- 6 default email templates (welcome, approval, expiration warnings, renewal, tax receipt)
- 5 automation rules with appropriate triggers

Verify installation:
```sql
SELECT COUNT(*) FROM email_templates;  -- Should return 6
SELECT COUNT(*) FROM email_automation_rules;  -- Should return 5
```

## Backend Setup

### 1. PHP Classes

Two new PHP classes have been created in `/api/classes/`:

- **`EmailAutomation.php`** - Core email automation logic
  - Queue management
  - Template processing
  - Variable replacement
  - Trigger handling
  - Statistics

- **`TaxCalculator.php`** - Spanish tax deduction calculations
  - Based on Real Decreto-ley 6/2023
  - 80% deduction on first €250
  - 40% (or 45% for recurring donors) above €250

### 2. API Endpoints

New API endpoints in `/api/`:

- **`cron-email-automation.php`** - Main cron job script
- **`email-automation-trigger.php`** - Manual trigger endpoint
- **`email-automation-stats.php`** - Admin dashboard statistics
- **`email-templates-list.php`** - List all templates
- **`email-test-send.php`** - Send test emails

### 3. Updated Endpoints

The following existing endpoints now trigger automated emails:

- **`join-us.php`** - Triggers "member_registered" email
- **`members-update-status.php`** - Triggers "member_approved" or "member_rejected"
- **`members-update-membership.php`** - Triggers "membership_renewed" and "sponsor_tax_receipt"

## Cron Job Setup

### For OVH Shared Hosting

1. Log into OVH Control Panel
2. Go to **"Hébergement" → "Tâches planifiées (CRON)"**
3. Click **"Ajouter une planification"**
4. Configure:
   - **Language**: PHP 8.4
   - **Command**: `~/www/api/cron-email-automation.php`
   - **Schedule**: Every 15 minutes
   - **Email notifications**: Your admin email (optional)

### For VPS/Dedicated Server

Add to crontab (`crontab -e`):

```bash
# Email automation - runs every 15 minutes
*/15 * * * * /usr/bin/php /path/to/api/cron-email-automation.php >> /var/log/email-automation.log 2>&1
```

### Manual Testing

You can test the cron job manually via browser:

```
https://www.elektr-ame.com/api/cron-email-automation.php?manual_trigger=1
```

Or via command line:
```bash
php api/cron-email-automation.php
```

## What the Cron Job Does

Every 15 minutes, the script:

1. **Checks for expiring memberships**
   - Finds memberships expiring in 7, 3, or 1 day
   - Queues reminder emails for each (only once per day)

2. **Processes email queue**
   - Sends up to 50 pending emails
   - Respects priority (high → normal → low)
   - Handles scheduled send times
   - Implements exponential backoff for failures
   - Max 3 retry attempts

3. **Logs results**
   - Records all sent emails in `email_logs`
   - Updates queue status
   - Reports processing statistics

## Frontend Setup

### 1. Admin Interface

A new **"Email Automation"** tab has been added to the admin panel with 4 sub-tabs:

- **Recent Emails** - Last 50 sent emails with status
- **Queue Status** - Current queue state by status and priority
- **Automation Rules** - Configured trigger rules
- **Templates** - Available email templates

### 2. Admin Features

- **Run Now** button - Manually trigger cron job
- **Send Test** button - Send test email to admin
- **Real-time statistics** - Emails sent, pending, failed (last 30 days)
- **Multi-language support** - All UI text translated (EN, ES, CA)

### 3. Build & Deploy

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build

# Deploy to OVH
./deploy.sh
```

## Email Templates

### Template Variables

Templates support the following dynamic variables:

- `{{first_name}}` - Member's first name
- `{{full_name}}` - Member's full name
- `{{email}}` - Member's email
- `{{membership_type}}` - Membership tier (Free, Basic, Sponsor, Lifetime)
- `{{end_date}}` - Membership expiration date
- `{{amount}}` - Payment amount
- `{{tax_deduction}}` - Tax deduction amount (sponsors)
- `{{net_cost}}` - Net cost after deduction (sponsors)
- `{{discount_percent}}` - Effective discount percentage (sponsors)
- `{{date}}` - Current date
- `{{receipt_id}}` - Unique receipt ID
- `{{tax_deduction_info}}` - Pre-formatted tax info text
- `{{tax_receipt_info}}` - Tax receipt instructions
- `{{recurring_bonus_info}}` - Recurring donor bonus message

### Customizing Templates

Templates can be edited directly in the database:

```sql
UPDATE email_templates 
SET subject_en = 'Your new subject', 
    body_en = 'Your new body with {{variables}}'
WHERE template_key = 'member_welcome';
```

**Important**: Always use UTF-8 encoding and test with all 3 languages (EN, ES, CA).

## Automation Rules

### Default Rules

| Rule Name | Trigger | Template | Timing | Active |
|-----------|---------|----------|--------|--------|
| Welcome Email | member_registered | member_welcome | Immediate | ✅ |
| Approval Notification | member_approved | member_approved | Immediate | ✅ |
| 7-Day Expiration Warning | membership_expiring_7d | membership_expiring_7d | 7 days before | ✅ |
| 3-Day Expiration Warning | membership_expiring_3d | membership_expiring_3d | 3 days before | ✅ |
| Renewal Confirmation | membership_renewed | membership_renewed | Immediate | ✅ |

### Adding Custom Rules

```sql
INSERT INTO email_automation_rules 
(rule_name, trigger_type, template_id, days_offset, active)
VALUES 
('Birthday Greeting', 'member_birthday', 
 (SELECT id FROM email_templates WHERE template_key = 'birthday'), 
 0, TRUE);
```

## Email Queue Management

### Priority Levels

- **High** - Urgent emails (expiration warnings, approval)
- **Normal** - Standard emails (welcome, renewal)
- **Low** - Bulk/campaign emails

### Queue Monitoring

Check queue status:
```sql
SELECT status, priority, COUNT(*) as count 
FROM email_queue 
GROUP BY status, priority;
```

Clear failed emails:
```sql
DELETE FROM email_queue WHERE status = 'failed' AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

## Troubleshooting

### Emails Not Sending

1. **Check cron job is running**:
   ```bash
   grep "Email Automation Cron" /var/log/email-automation.log
   ```

2. **Check PHP mail() function**:
   ```bash
   php -r "mail('your@email.com', 'Test', 'Test body');"
   ```

3. **Check queue**:
   ```sql
   SELECT * FROM email_queue WHERE status = 'failed';
   ```

4. **Review error logs**:
   ```sql
   SELECT * FROM email_logs WHERE status = 'failed' ORDER BY sent_at DESC LIMIT 10;
   ```

### Emails in Spam

- Ensure OVH's SMTP is properly configured
- Add SPF and DKIM records to DNS
- Use a professional "From" address (e.g., `noreply@elektr-ame.com`)
- Avoid spam trigger words in subject/body

### High Queue Backlog

- Increase cron frequency (e.g., every 5 minutes)
- Increase batch size in `processQueue()` (default: 50)
- Check for email server rate limits

## Testing

### 1. Test Welcome Email

```bash
# Register a new member via the website
# Check email_queue table
SELECT * FROM email_queue WHERE template_key = 'member_welcome' ORDER BY created_at DESC LIMIT 1;

# Manually trigger cron to send
php api/cron-email-automation.php
```

### 2. Test Approval Email

```bash
# In admin panel, approve a pending member
# Check email was queued
SELECT * FROM email_queue WHERE template_key = 'member_approved' ORDER BY created_at DESC LIMIT 1;
```

### 3. Test Expiration Reminders

```sql
-- Temporarily update a membership to expire in 7 days
UPDATE members 
SET membership_end_date = DATE_ADD(NOW(), INTERVAL 7 DAY),
    membership_type = 'basic',
    status = 'approved'
WHERE id = 1;

-- Run cron job
-- Check email was queued
SELECT * FROM email_queue WHERE template_key = 'membership_expiring_7d';
```

### 4. Test From Admin Panel

1. Log into admin panel
2. Go to **"Email Automation"** tab
3. Click **"Send Test"**
4. Select a template
5. Check your admin email

## Security Considerations

1. **Authentication** - All automation endpoints check for admin authentication
2. **SQL Injection** - All queries use PDO prepared statements
3. **XSS Protection** - All email content is escaped
4. **Rate Limiting** - Cron job processes max 50 emails per run
5. **Retry Logic** - Failed emails retry with exponential backoff (max 3 attempts)

## Performance

- **Email queue**: Indexed by status, scheduled_for, priority
- **Email logs**: Indexed by member_id, template_key, sent_at
- **Batch processing**: 50 emails per cron run (configurable)
- **Expiration checks**: Only queries members with expiring dates
- **Duplicate prevention**: Checks email_logs before queuing reminders

## Future Enhancements

Potential improvements for future development:

1. **SMTP Integration** - Replace `mail()` with PHPMailer/SMTP
2. **HTML Emails** - Rich formatting with HTML templates
3. **A/B Testing** - Test different email versions
4. **Click Tracking** - Track email opens and clicks
5. **Unsubscribe Management** - Per-email-type preferences
6. **Webhook Integration** - SendGrid, Mailgun, etc.
7. **Template Editor** - Visual email template editor in admin
8. **Campaign Scheduler** - Schedule one-time or recurring campaigns
9. **Segmentation** - Send to specific member groups
10. **Analytics Dashboard** - Open rates, click rates, conversions

## Support

For issues or questions:
- Check logs: `/var/log/email-automation.log` (if configured)
- Database logs: `SELECT * FROM email_logs WHERE status = 'failed'`
- Admin panel: "Email Automation" tab shows real-time status
- Email: contact@elektr-ame.com

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Author**: Elektr-Âme Development Team

