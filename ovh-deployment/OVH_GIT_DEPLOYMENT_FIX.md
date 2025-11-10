# 🚨 CRITICAL: OVH Git Deployment Issue

## The Problem

OVH has **automatic Git deployment** enabled. Every time you push to GitHub, OVH automatically:
1. Clones your repository into `/home/elektry/www/`
2. **Overwrites all manually uploaded files**
3. Deploys the **source code** (not built files)

This is why it stopped working at 4pm - a Git push triggered automatic deployment!

## The Solution: Two Options

### Option 1: Disable OVH Git Deployment (Recommended)

**Steps:**
1. Log into OVH Control Panel
2. Go to "Web" → "Git" or "Deployment"
3. Find the Git deployment configuration
4. **Disable** automatic Git deployment
5. Keep using manual FTP uploads

**Pros:**
- Full control over what gets deployed
- Can deploy built files from `ovh-deployment/`
- No automatic overwrites

**Cons:**
- Manual deployment required

### Option 2: Fix OVH Git Deployment to Deploy Built Files

**Problem:** OVH Git deployment clones source code, not built files.

**Solution:** Configure OVH to build and deploy:

1. **OVH Control Panel → "Web" → "Git"**
2. Check if there's a "Build command" or "Deploy script" option
3. Set build command: `npm install && npm run build`
4. Set deploy directory to: `dist/` (or copy dist to www)

**OR** Add a build script that OVH runs after cloning.

## Option 3: Use GitHub Actions Instead (Best for Automation)

You already have `.github/workflows/deploy-ovh.yml` that:
- Builds the React app
- Deploys via FTP to OVH
- Includes all necessary files

**To use this:**
1. Disable OVH Git deployment
2. Ensure GitHub Actions secrets are configured:
   - `OVH_FTP_SERVER`
   - `OVH_FTP_USERNAME`
   - `OVH_FTP_PASSWORD`
3. GitHub Actions will deploy automatically on push

## Immediate Fix: Disable Git Deployment

**Right now, do this:**

1. **OVH Control Panel → "Web" → "Git" or "Deployment"**
2. **Disable** automatic Git deployment
3. **Re-upload** all files from `ovh-deployment/` via FTP
4. **Create** `config.php` manually (see CREATE_CONFIG_PHP.txt)

## Why This Happened

- You pushed code to GitHub
- OVH detected the push
- OVH automatically cloned the repository
- This **overwrote** your manually uploaded files
- The cloned repository has source code, not built files
- Result: Site breaks

## Prevention

**Option A: Disable OVH Git Deployment**
- Use manual FTP uploads
- Deploy from `ovh-deployment/` folder

**Option B: Use GitHub Actions**
- Configure GitHub Actions secrets
- Let GitHub Actions deploy built files
- Disable OVH Git deployment

**Option C: Fix OVH Git Deployment**
- Configure build commands in OVH
- Make it deploy built files, not source

## Quick Action Items

1. ✅ **Disable OVH Git deployment** (OVH Control Panel)
2. ✅ **Re-upload files** from `ovh-deployment/` via FTP
3. ✅ **Create config.php** manually
4. ✅ **Test the site**

## Check OVH Git Settings

**OVH Control Panel → "Web" → "Git":**
- Is automatic deployment enabled?
- What repository is it cloning?
- What branch is it using?
- Is there a build command configured?

**Disable it if you want manual control!**

