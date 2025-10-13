# Hidden Files (.htaccess) Deployment Fix

## The Problem

`.htaccess` file was not appearing in the deployment package even though:
- ✅ It existed in `public/.htaccess`
- ✅ Vite was copying it to `dist/.htaccess`
- ❌ GitHub Actions wasn't including it in deployment package

## Root Cause

**Two issues with hidden files (files starting with `.`):**

### Issue 1: Vite Build (FIXED)
```
Problem: Vite doesn't copy hidden files from public/ to dist/ by default
Solution: Added custom Vite plugin in vite.config.ts
```

### Issue 2: GitHub Actions (FIXED)
```
Problem: Shell command 'cp -r dist/*' doesn't copy hidden files
Solution: Added 'cp -r dist/.* deployment-package/' to workflow
```

## The Fixes

### Fix 1: `vite.config.ts`
```typescript
plugins: [
  react(),
  // Custom plugin to copy .htaccess (hidden files aren't copied by default)
  {
    name: 'copy-htaccess',
    closeBundle() {
      try {
        copyFileSync('public/.htaccess', 'dist/.htaccess');
        console.log('✓ .htaccess copied to dist/');
      } catch (err) {
        console.warn('⚠ .htaccess not found, skipping...');
      }
    }
  }
]
```

### Fix 2: `.github/workflows/deploy.yml`
```yaml
# Copy frontend build (including hidden files like .htaccess)
cp -r dist/* deployment-package/ 2>/dev/null || true
cp -r dist/.* deployment-package/ 2>/dev/null || true
```

## Why This Matters

**`.htaccess` is CRITICAL for PWA to work:**
- ✅ Forces HTTPS redirect
- ✅ Enables security headers
- ✅ Without HTTPS, PWA features don't work
- ✅ Without HTTPS, install prompt won't appear
- ✅ Without HTTPS, service worker won't register

## How to Verify It's Working

### Local Build
```bash
npm run build
ls -la dist/ | grep htaccess
# Should show: .htaccess
```

### GitHub Actions
1. Push to main branch
2. Wait for Actions to complete
3. Download deployment artifact
4. Check root folder for `.htaccess`

### After Deployment
```bash
# On your server
ls -la /home/elektry/www/ | grep htaccess
# Should show: .htaccess

# Test HTTPS redirect
curl -I http://www.elektr-ame.com
# Should show: Location: https://www.elektr-ame.com
```

## Troubleshooting

### `.htaccess` still not in deployment package?

**Check 1: Is it in dist/?**
```bash
npm run build
ls -la dist/.htaccess
```
If not found → Check `vite.config.ts` has the custom plugin

**Check 2: Is GitHub Actions using latest workflow?**
- Go to GitHub repository → Actions tab
- Check workflow file has both `cp` commands
- Re-run workflow if needed

**Check 3: Extract deployment package**
```bash
unzip deployment-package.zip
ls -la | grep htaccess
```
If not found → GitHub Actions workflow needs the fix

### `.htaccess` on server but not working?

**Check 1: File permissions**
```bash
chmod 644 .htaccess
```

**Check 2: mod_rewrite enabled?**
Contact OVH support if HTTPS redirect not working

**Check 3: Test redirect**
```bash
curl -I http://www.elektr-ame.com
# Should return 301 redirect to HTTPS
```

## Commands Reference

### Build locally
```bash
npm run build
```

### Verify .htaccess in dist
```bash
ls -la dist/.htaccess
```

### Test HTTPS redirect (after upload)
```bash
curl -I http://www.elektr-ame.com
```

### Check file permissions on server
```bash
ls -la /home/elektry/www/.htaccess
```

---

**Status:** ✅ FIXED in commit `7d62282`

Both Vite and GitHub Actions now properly handle hidden files!

