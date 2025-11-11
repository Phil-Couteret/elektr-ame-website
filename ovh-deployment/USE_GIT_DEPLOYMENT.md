# ✅ Use GitHub Deployment - Configuration Guide

## Current Situation
- ✅ GitHub deployment is working (files auto-deploy)
- ✅ Files deploy to: `/home/elektry/www/`
- ❌ Multisite root folder points to: `/www/`
- ❌ Files work in `/www/` but Git deploys to `/home/elektry/www/`

## Solution: Point Multisite to Git Deployment Location

### Step 1: Change Multisite Root Folder
**OVH Control Panel → "Web" → "Multisite" → Edit `www.elektr-ame.com`:**

1. Change "Root folder" from `www` to the path where Git deploys
2. Git deploys to: `/home/elektry/www/`
3. So root folder should be: `/home/elektry/www` or just the relative path

**Try these root folder values:**
- `/home/elektry/www` (full path)
- `home/elektry/www` (without leading slash)
- Or check what OVH suggests

### Step 2: Verify Git Deployment Settings
**OVH Control Panel → "Web" → "Git":**

1. Check what repository is linked
2. Check what branch it deploys from (should be `main`)
3. Check deployment directory (should be `/home/elektry/www/`)
4. Verify it's set to deploy on push

### Step 3: Configure GitHub Actions (Optional)
You have `.github/workflows/deploy-ovh.yml` that can deploy via FTP.

**To use this instead:**
1. Configure GitHub Secrets:
   - `OVH_FTP_SERVER`: `ftp.cluster129.hosting.ovh.net`
   - `OVH_FTP_USERNAME`: `elektry`
   - `OVH_FTP_PASSWORD`: `92Alcolea2025`
2. GitHub Actions will deploy on every push
3. Disable OVH Git deployment
4. Use GitHub Actions instead

## Option A: Use OVH Git Deployment (Easier)

### Configure:
1. **Multisite root folder:** Point to where Git deploys (`/home/elektry/www` or similar)
2. **Git deployment:** Keep enabled, deploys on push
3. **Build process:** Need to build before pushing, or configure OVH to build

### Problem:
- Git deploys **source code**, not **built files**
- Need to either:
  - Build locally and commit `dist/` folder
  - Configure OVH to run `npm run build` after clone
  - Use GitHub Actions to build and deploy

## Option B: Use GitHub Actions (Better)

### Configure:
1. **GitHub Secrets:** Add OVH FTP credentials
2. **GitHub Actions:** Will build and deploy automatically
3. **OVH Git deployment:** Disable it
4. **Multisite root folder:** Keep as `www` (pointing to `/www/`)

### Advantages:
- Builds React app automatically
- Deploys built files (not source)
- More control over deployment process

## Recommended: Hybrid Approach

### Setup:
1. **Keep OVH Git deployment** for API files (PHP)
2. **Use GitHub Actions** for frontend (React build)
3. **Deploy API to:** `/home/elektry/www/api/`
4. **Deploy frontend to:** `/home/elektry/www/` (root)
5. **Multisite root folder:** Point to `/home/elektry/www`

## Immediate Action

**Since Git deployment is working:**

1. **Change Multisite root folder** to point to `/home/elektry/www`
2. **Test:** `https://www.elektr-ame.com/test-plain.html`
3. **If it works:** Git deployment is configured correctly!
4. **Then fix PHP:** Upload `.htaccess-with-php` to `/home/elektry/www/`

## What to Check

1. **OVH Git settings:** What directory does it deploy to?
2. **Multisite root folder:** What should it be to match Git deployment?
3. **Test after changing:** Does the site work?

Let's use Git deployment - it's much easier than manual uploads!

