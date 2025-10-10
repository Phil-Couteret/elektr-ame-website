# Complete Deployment Guide - All Pending Updates

## 📦 What's Ready to Deploy

### 1. ✅ Icon Fixes (Frontend Only)
- Fixed incorrect Linktree icon
- Added 7 missing social/music platform icons
- All artist profile icons now display correctly

### 2. ✅ Email Automation System (Frontend + Backend + Database)
- Automated welcome, approval, expiration, renewal emails
- Admin panel with Email Automation tab
- Cron job for scheduled sending
- Multi-language support (EN/ES/CA)

---

## 🎯 Quick Summary - Who Needs Access for What

| Update | FTP Access | Database Access | Cron Job Access |
|--------|-----------|----------------|-----------------|
| **Icon Fixes** | ✅ Required | ❌ Not needed | ❌ Not needed |
| **Email Automation** | ✅ Required | ✅ Required | ✅ Required |

---

## 📋 OPTION A: Deploy Icons Only (Simple, No Risk)

**Time Required:** 5 minutes  
**Risk Level:** Very Low  
**Requirements:** FTP access only

### What to Deploy:
Upload the contents of `dist/` folder to `~/www/` on the server.

### Files to Upload:
```
dist/index.html          → ~/www/index.html
dist/assets/*.js         → ~/www/assets/
dist/assets/*.css        → ~/www/assets/
```

### Steps:
1. Download the `dist/` folder from the GitHub repository
2. Connect to OVH via FTP (FileZilla, etc.)
3. Upload all files from `dist/` to `~/www/`, overwriting existing files
4. Done! Test at https://www.elektr-ame.com

### Testing:
- Visit https://www.elektr-ame.com
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Scroll to "Artists" section
- Verify all social/music icons display correctly

---

## 📋 OPTION B: Deploy Everything (Icons + Email Automation)

**Time Required:** 30-45 minutes  
**Risk Level:** Medium (requires database changes and cron setup)  
**Requirements:** FTP access + Database access + Cron job access

### Phase 1: Database Setup (10 minutes)

**Person Needed:** Someone with MySQL access to `elektry2025` database

**Files Needed:**
- `database/email-automation-tables.sql`

**Steps:**
```bash
# SSH into OVH server OR use phpMyAdmin
ssh your-username@your-server.ovh.net

# Run SQL script
mysql -u elektry2025 -p elektry2025 < ~/www/database/email-automation-tables.sql

# Verify installation
mysql -u elektry2025 -p elektry2025 -e "SELECT COUNT(*) FROM email_templates;"
# Should return: 6

mysql -u elektry2025 -p elektry2025 -e "SELECT COUNT(*) FROM email_automation_rules;"
# Should return: 5
```

**Or via phpMyAdmin:**
1. Log into phpMyAdmin
2. Select `elektry2025` database
3. Go to "SQL" tab
4. Copy/paste contents of `database/email-automation-tables.sql`
5. Click "Execute"
6. Verify 4 new tables created: `email_templates`, `email_automation_rules`, `email_queue`, `email_logs`

---

### Phase 2: Backend Files Upload (10 minutes)

**Person Needed:** Someone with FTP/SSH access

**Files to Upload:**

**New files (upload to server):**
```
api/classes/EmailAutomation.php       → ~/www/api/classes/EmailAutomation.php
api/classes/TaxCalculator.php         → ~/www/api/classes/TaxCalculator.php
api/cron-email-automation.php         → ~/www/api/cron-email-automation.php
api/email-automation-stats.php        → ~/www/api/email-automation-stats.php
api/email-automation-trigger.php      → ~/www/api/email-automation-trigger.php
api/email-templates-list.php          → ~/www/api/email-templates-list.php
api/email-test-send.php               → ~/www/api/email-test-send.php
database/email-automation-tables.sql  → ~/www/database/email-automation-tables.sql
```

**Updated files (overwrite on server):**
```
api/join-us.php                       → ~/www/api/join-us.php
api/members-update-status.php         → ~/www/api/members-update-status.php
api/members-update-membership.php     → ~/www/api/members-update-membership.php
```

**Via FTP:**
1. Connect to OVH FTP
2. Navigate to `~/www/api/` directory
3. Upload all files from local `api/` folder
4. Ensure permissions are correct (644 for .php files)

**Via SSH/Git (Recommended):**
```bash
ssh your-username@your-server.ovh.net
cd ~/www
git pull origin main
chmod 644 api/*.php
chmod 644 api/classes/*.php
```

---

### Phase 3: Frontend Files Upload (5 minutes)

**Person Needed:** Someone with FTP/SSH access

**Files to Upload:**
```
dist/index.html          → ~/www/index.html
dist/assets/*.js         → ~/www/assets/
dist/assets/*.css        → ~/www/assets/
```

Upload entire `dist/` folder contents to `~/www/`, overwriting existing files.

---

### Phase 4: Cron Job Setup (10 minutes)

**Person Needed:** Someone with access to OVH Control Panel → "Tâches planifiées (CRON)"

**Steps:**

1. Log into **OVH Control Panel**
2. Go to **"Hébergement"** → **"Tâches planifiées (CRON)"**
3. Click **"Ajouter une planification"**
4. Configure:

   | Field | Value |
   |-------|-------|
   | **Langage** | PHP 8.4 |
   | **Chemin du script** | `~/www/api/cron-email-automation.php` |
   | **Fréquence** | Personnalisée |
   | **Minute** | */15 |
   | **Heure** | * |
   | **Jour** | * |
   | **Mois** | * |
   | **Jour de la semaine** | * |
   | **Description** | Email Automation - Runs every 15 minutes |
   | **Email de notification** | (Optional) Your admin email |

5. Save and activate

**What this does:**
- Runs every 15 minutes
- Checks for expiring memberships (7, 3, 1 day before)
- Sends queued emails (up to 50 per run)
- Handles retries for failed emails

---

### Phase 5: Testing (10-15 minutes)

#### Test 1: Frontend (Icons + Email Automation Tab)
1. Visit https://www.elektr-ame.com
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. Check artist icons display correctly
4. Log into admin panel
5. Verify "Email Automation" tab appears (between "Newsletter" and "Users")
6. Click through all 4 sub-tabs (Recent, Queue, Rules, Templates)

#### Test 2: Email Test Send
1. In admin panel → Email Automation tab
2. Click **"Send Test"** button
3. Select any template (e.g., "New Member Welcome")
4. Click "Send Test"
5. Check admin email inbox (and spam folder)
6. Verify email received with correct content

#### Test 3: Manual Cron Trigger
1. In admin panel → Email Automation tab
2. Click **"Run Now"** button
3. Should see success message: "Automation completed successfully!"
4. Check statistics update

#### Test 4: Automated Welcome Email
1. Go to "Join Us" page
2. Register a new test member
3. Go to admin panel → Email Automation → Queue Status
4. Should see 1 pending email with template "member_welcome"
5. Click "Run Now" to send it
6. Check Recent Emails tab - should show as "sent"
7. Check test member's email inbox

#### Test 5: Cron Job (Browser Test)
```
Visit: https://www.elektr-ame.com/api/cron-email-automation.php?manual_trigger=1
```

Expected JSON response:
```json
{
  "success": true,
  "timestamp": "2025-01-XX XX:XX:XX",
  "duration": 0.XX,
  "expiring_memberships": {"7d": 0, "3d": 0, "1d": 0},
  "queue_processing": {"sent": 0, "failed": 0, "total": 0}
}
```

---

## 📊 Post-Deployment Verification

### Icons ✅
- [ ] Artist profile icons display correctly
- [ ] All 10 platforms have proper icons (SoundCloud, Instagram, Linktree, Spotify, Beatport, RA, Facebook, X, YouTube, TikTok)
- [ ] Icons are clickable and link to correct URLs

### Email Automation ✅
- [ ] Admin panel has "Email Automation" tab
- [ ] All 4 sub-tabs render without errors
- [ ] Statistics show (even if zeros)
- [ ] "Send Test" button works
- [ ] "Run Now" button works
- [ ] Test email received successfully
- [ ] Welcome email sent to new registrations
- [ ] Cron job URL responds with JSON

### Database ✅
```sql
-- Run these queries to verify:
SELECT COUNT(*) FROM email_templates;           -- Should be 6
SELECT COUNT(*) FROM email_automation_rules;    -- Should be 5
SELECT COUNT(*) FROM email_queue;               -- May be 0 or have pending
SELECT COUNT(*) FROM email_logs;                -- May be 0 initially
```

---

## 🚨 Troubleshooting

### Issue: "Email Automation" tab not appearing

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache completely
3. Try different browser
4. Check browser console for JavaScript errors (F12)
5. Verify all `dist/` files were uploaded correctly

### Issue: "Failed to fetch data" in Email Automation tab

**Solutions:**
1. Verify database tables were created:
   ```sql
   SHOW TABLES LIKE 'email_%';
   ```
2. Check API files were uploaded to `~/www/api/`
3. Check file permissions (should be 644)
4. Test API directly:
   ```
   https://www.elektr-ame.com/api/email-automation-stats.php
   ```

### Issue: Cron job not running

**Solutions:**
1. Verify cron job is active in OVH panel
2. Test manually via browser:
   ```
   https://www.elektr-ame.com/api/cron-email-automation.php?manual_trigger=1
   ```
3. Check cron job logs in OVH panel (if available)
4. Verify PHP version is set to 8.4

### Issue: Emails not sending

**Solutions:**
1. Check email queue:
   ```sql
   SELECT * FROM email_queue WHERE status = 'failed';
   ```
2. Test PHP mail() function:
   ```bash
   php -r "mail('test@email.com', 'Test', 'Body');"
   ```
3. Check spam folder
4. Verify OVH SMTP is working (contact OVH support if needed)

---

## 📦 Easy Deployment Package

Since you don't have access, I can create a deployment package for whoever does:

### For Icons Only:
```
📁 elektr-ame-icons-update.zip
   └── dist/ (entire folder)
   └── README.txt (instructions)
```

### For Complete Update:
```
📁 elektr-ame-complete-update.zip
   ├── 📁 dist/ (entire folder)
   ├── 📁 api/ (entire folder)
   ├── 📁 database/ (SQL files)
   ├── 📄 DEPLOYMENT_STEPS.txt
   ├── 📄 DATABASE_SETUP.txt
   └── 📄 CRON_JOB_CONFIG.txt
```

---

## 👥 Who Needs to Do What

### Person with FTP Access:
- Upload `dist/` folder → Frontend updates (icons + email automation UI)
- Upload `api/` folder → Backend email automation scripts

### Person with Database Access:
- Run SQL script `database/email-automation-tables.sql`
- Verify 4 new tables created

### Person with OVH Control Panel Access:
- Set up cron job in "Tâches planifiées (CRON)"
- Configure to run every 15 minutes

### Person with Admin Panel Access (You):
- Test "Email Automation" tab
- Send test emails
- Monitor email queue
- Verify statistics

---

## 🎯 My Recommendation

Since you don't have direct access, here's what I suggest:

### Option 1: Icons Only (Safe, Quick)
- **Who needs access:** Just FTP
- **Time:** 5 minutes
- **Risk:** Very low
- **What you get:** Fixed icons on artist profiles

### Option 2: Complete Update (Full Features)
- **Who needs access:** FTP + Database + Cron
- **Time:** 30-45 minutes
- **Risk:** Medium (but thoroughly tested)
- **What you get:** Icons + Full email automation system

---

## 📞 Need Help?

I can create:
1. ✅ Detailed step-by-step instructions for your team
2. ✅ Screenshot guides for OVH Control Panel
3. ✅ Video walkthrough (if needed)
4. ✅ Deployment package ZIP files
5. ✅ Rollback procedures if something goes wrong

**Just let me know what you need!** 🚀

