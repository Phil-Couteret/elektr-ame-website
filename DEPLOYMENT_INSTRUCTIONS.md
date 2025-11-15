# Deployment Instructions - Fix Issues

## Issues Fixed

1. ✅ **Admin Portal CORS Error** - Fixed `auth-check.php` and `auth-login.php` to use `config-helper.php` for proper CORS headers
2. ✅ **Image File Structure** - Created `move-images-to-public.php` to restore images to correct location
3. ✅ **Safe Deployment Script** - Created `deploy-safe.sh` without `--delete` flag

## Step 1: Deploy Fixed Code

Run the safe deployment script:

```bash
./deploy-safe.sh
```

This will:
- Upload fixed `auth-check.php` and `auth-login.php` (CORS fixes)
- Upload new build files
- **NOT delete any existing files** on the server

## Step 2: Move Images to Correct Location

After deployment, visit this URL in your browser to move existing images:

```
https://www.elektr-ame.com/api/move-images-to-public.php
```

This script will:
- Move gallery images from `/www/gallery-images/` to `/www/public/gallery-images/`
- Move thumbnails to correct location
- Update database filepaths automatically

## Step 3: Verify

1. **Admin Portal**: Try logging in - should work without "Network error"
2. **Gallery Images**: Check if images display correctly
3. **Artist Images**: These were deleted and need to be re-uploaded (database records still exist)

## What Was Fixed

- ✅ CORS headers now use `config-helper.php` for proper environment detection
- ✅ Safe deployment script prevents accidental file deletion
- ✅ Image recovery script to restore file structure
- ✅ Database filepaths will be updated automatically

## Important Notes

- **Artist images** that were deleted cannot be automatically recovered - they need to be re-uploaded through the admin portal
- The database still has all records, so re-uploading will link to existing database entries
- Gallery images that still exist will be moved to the correct location automatically

