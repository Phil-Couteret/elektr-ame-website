# 🚀 Production Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Build Complete ✅
- [x] Frontend built successfully (`npm run build`)
- [x] Build output in `dist/` directory

### 2. Code Committed ✅
- [x] All changes committed to GitHub
- [x] Latest commit: `da8316a`

## 📦 Files to Deploy

### Frontend Files (from `dist/`)
- `index.html`
- `assets/` directory (all JS and CSS files)
- `.htaccess` files

### Backend Files (from `api/`)
- All `.php` files **EXCEPT** `config.php`
- `config-helper.php` ✅
- `config-ovh-template.php` ✅

### Database Migrations
- `database/artist_media_migration.sql` (NEW - for video support)
- `database/galleries_schema.sql` (if not already applied)

## 🗄️ Database Migration Steps

### Step 1: Create artist_images Table (if it doesn't exist)

**In OVH phpMyAdmin:**

1. Select database: `elektry2025`
2. Go to "SQL" tab
3. **First, check if the table exists:**
   ```sql
   SHOW TABLES LIKE 'artist_images';
   ```

4. **If the table doesn't exist, run:**
   - File: `database/artist_images_create_ovh.sql`
   - This creates the table with video support included

5. **If the table already exists but is missing video columns, run:**
   - File: `database/artist_media_migration_ovh.sql`
   - This adds the video support columns

### Step 2: Verify Tables

Check these tables exist:
- ✅ `artists`
- ✅ `artist_images` (with new columns: `media_type`, `video_duration`)
- ✅ `events`
- ✅ `galleries`
- ✅ `gallery_images`
- ✅ `admin_users`

## 📤 Deployment Steps

### Option A: FTP/SFTP Upload

1. **Upload Frontend:**
   ```
   Upload contents of dist/ → www/
   ```

2. **Upload API Files:**
   ```
   Upload api/*.php → www/api/
   (EXCEPT config.php - upload manually)
   ```

3. **Upload config.php:**
   ```
   - Create api/config.php on OVH
   - Use config-ovh-template.php as base
   - Update with OVH database password
   - Set permissions: chmod 600
   ```

4. **Create Directories (if needed):**
   ```bash
   mkdir -p www/public/artist-images/thumbnails
   mkdir -p www/public/gallery-images/thumbnails
   chmod 755 www/public/artist-images
   chmod 755 www/public/gallery-images
   ```

### Option B: Git Pull (if OVH has git access)

1. SSH into OVH server
2. Navigate to `www/` directory
3. Pull latest changes:
   ```bash
   git pull origin main
   ```
4. Build frontend:
   ```bash
   npm run build
   ```
5. Manually create/update `api/config.php`

## 🔍 Post-Deployment Verification

### 1. Test API Endpoints

Visit these URLs (should return JSON):
- ✅ `https://www.elektr-ame.com/api/events-list.php`
- ✅ `https://www.elektr-ame.com/api/artists-list.php`
- ✅ `https://www.elektr-ame.com/api/galleries-list.php`
- ✅ `https://www.elektr-ame.com/api/auth-check.php`

### 2. Test Frontend

- ✅ `https://www.elektr-ame.com` - Homepage loads
- ✅ `https://www.elektr-ame.com/admin` - Admin login works
- ✅ Events display correctly
- ✅ Artists display with images
- ✅ Gallery displays galleries

### 3. Test Admin Features

Login to admin panel and test:
- ✅ Create/edit events
- ✅ Upload event images
- ✅ Create/edit artists
- ✅ Upload artist images and videos
- ✅ Create galleries
- ✅ Upload gallery images

### 4. Test New Features

- ✅ Video upload for artists
- ✅ Gallery display on public page
- ✅ No logos in header/admin
- ✅ Centered navigation buttons

## ⚠️ Important Notes

1. **config.php is NOT in git** - must be uploaded manually
2. **Database migration is required** - run `artist_media_migration.sql`
3. **File permissions** - ensure upload directories are writable (755)
4. **CORS** - automatically configured for production via `config-helper.php`

## 🐛 Troubleshooting

### If API returns errors:
1. Check `api/config.php` exists and has correct credentials
2. Check database connection
3. Check PHP error logs on OVH

### If images don't upload:
1. Check directory permissions (755)
2. Check PHP `upload_max_filesize` setting
3. Check `public/` directory exists and is writable

### If videos don't work:
1. Check if `ffmpeg` is installed on OVH server (optional - videos will still upload)
2. Verify `media_type` column exists in `artist_images` table
3. Check video file size limits

---

**Deployment Date:** $(date)
**Commit:** da8316a
**Changes:** Video support, gallery fixes, UI improvements, admin login fix

