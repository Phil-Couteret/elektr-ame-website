# When FTP Server is Back Up

## Quick Fix (Recommended)

Run this command to upload the correct production config.php:

```bash
./force-config-upload.sh
```

This will:
- ✅ Upload production config.php with `elektry2025.mysql.db`
- ✅ Verify the upload was successful
- ✅ Fix database connection immediately

## Full Deployment

If you want to deploy everything:

```bash
./deploy.sh
```

This will:
- ✅ Build the project
- ✅ Copy all files to deployment/
- ✅ Upload everything to production
- ✅ Ensure config.php is correct

## What Will Be Fixed

After running either script:

1. **Site will show data** ✅
   - Events will appear
   - Artists will appear
   - Galleries will appear

2. **Admin portal will work** ✅
   - Can log in
   - Can manage content

3. **Database connection** ✅
   - Connected to `elektry2025.mysql.db`
   - All API endpoints working

## Current Status

- ✅ Production config ready in `deployment/api/config.php`
- ✅ All deployment files prepared
- ⏳ Waiting for FTP server to come back up

## After Deployment

1. Clear browser cache (Cmd+Shift+R)
2. Test the site - should show all data
3. Test admin portal login

