# URGENT: Deploy to Fix Site

## The Problem
- Site appears empty (wrong JavaScript bundle on server)
- Admin portal not connecting (CORS issues, outdated API files)
- Database config may be incorrect

## The Solution
Run this command to deploy all fixes:

```bash
./deploy-now.sh
```

This will:
1. ✅ Upload fixed `auth-check.php` and `auth-login.php` (CORS fixes)
2. ✅ Upload correct `config.php` with `elektry2025.mysql.db` database
3. ✅ Upload latest JavaScript bundle (`index-Hq3_iTUZ.js`)
4. ✅ Upload latest CSS bundle
5. ✅ Upload `move-images-to-public.php` to restore images

## After Deployment

1. **Clear browser cache** (Cmd+Shift+R or Ctrl+Shift+R)

2. **Restore images** by visiting:
   ```
   https://www.elektr-ame.com/api/move-images-to-public.php
   ```

3. **Test admin portal** - should work now

## What's Fixed

- ✅ CORS headers properly configured
- ✅ Database connection to `elektry2025.mysql.db`
- ✅ Latest build files
- ✅ Safe deployment (no file deletion)

