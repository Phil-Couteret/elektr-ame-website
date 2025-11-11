# 📤 Deployment Flow - Where Files Go

## Current Situation

### GitHub Repository
- **Location:** `https://github.com/Phil-Couteret/elektr-ame-website`
- **Branch:** `main`
- **Contains:** Source code, deployment package in `ovh-deployment/`

### OVH Server
- **Working location:** `/www/` (where HTML works)
- **Git deployment location:** `/home/elektry/www/` (if Git was enabled)
- **Multisite root folder:** `www`

## What Happens When You Push to GitHub

### If Git Deployment is DISABLED (Current):
✅ **Nothing happens automatically**
- Files stay where you uploaded them
- No automatic deployment
- You control what's on the server

### If Git Deployment was ENABLED:
❌ **OVH would automatically:**
- Clone repository to `/home/elektry/www/`
- Overwrite your manually uploaded files
- Deploy source code (not built files)
- This is why we disabled it!

## Where Files Should Be

### Production Files Location:
**`/www/`** (where HTML works)
- This is where Multisite root folder `www` points to
- Upload all files from `ovh-deployment/` here
- This is the correct location

### Files to Upload:
From `ovh-deployment/` folder, upload to `/www/`:
- ✅ `index.html`
- ✅ `.htaccess-with-php` (rename to `.htaccess`)
- ✅ `api/` folder (all PHP files)
- ✅ `assets/` folder (React build)
- ✅ All other files

## Deployment Process

### Manual Deployment (Current Method):
1. **Build locally:** `npm run build`
2. **Files ready in:** `ovh-deployment/`
3. **Upload via FTP** to `/www/`
4. **Create `config.php`** manually in `/www/api/`

### Automatic Deployment (If Using GitHub Actions):
- GitHub Actions would deploy via FTP
- But Git deployment in OVH would conflict
- So we disabled OVH Git deployment

## Current Status After Push

After pushing to GitHub:
- ✅ All code is in GitHub
- ✅ Deployment package is in `ovh-deployment/`
- ✅ Git deployment is disabled (so nothing auto-deploys)
- ✅ You need to manually upload to `/www/`

## Next Steps

1. **Upload all files** from `ovh-deployment/` to `/www/` via FTP
2. **Upload `.htaccess-with-php`** as `.htaccess`
3. **Create `config.php`** in `/www/api/`
4. **Test the site**

## Important Notes

- **GitHub = Source code repository**
- **OVH `/www/` = Production files location**
- **Git deployment = Disabled (to prevent conflicts)**
- **Manual upload = Required for deployment**

