# 🚨 Root Folder Mismatch Issue

## Current Situation
- **Multisite root folder:** `www`
- **Files location:** `/home/elektry/www/`
- **Result:** "Not Found" for all URLs

## The Problem

When Multisite root folder is `www`, OVH might be looking in:
- `/home/elektry/www/www/` (subdirectory)
- OR `/home/elektry/` with `www` as a subdirectory

But files are in `/home/elektry/www/` directly.

## Solution Options

### Option 1: Change Multisite Root Folder to `/`
1. OVH Control Panel → "Web" → "Multisite"
2. Edit `www.elektr-ame.com`
3. Change "Root folder" from `www` to `/` (just a slash)
4. Save
5. Files should be in `/home/elektry/www/`

### Option 2: Move Files to Match Root Folder
If root folder is `www`, try moving files:
- From: `/home/elektry/www/`
- To: `/home/elektry/www/www/`

But this seems wrong...

### Option 3: Check Actual Document Root
The diagnostic should show the actual document root. If it's different, that's the issue.

## Most Likely Fix

**Change Multisite root folder from `www` to `/`**

This tells OVH to use `/home/elektry/www/` as the document root directly.

## Test After Fix

1. Upload `test-simple.php` to `/home/elektry/www/`
2. Visit: `https://www.elektr-ame.com/test-simple.php`
3. Should show "PHP WORKS!" and document root info

