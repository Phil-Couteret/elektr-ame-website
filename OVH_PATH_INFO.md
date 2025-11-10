# 📍 OVH Server Path Information

## Server Structure

**Document Root:** `/home/elektry/www`

**Full Path Structure:**
```
/home/elektry/www/              (Document root - where index.html goes)
├── index.html
├── assets/
├── api/                         (API files go here)
│   ├── events-list.php
│   ├── artists-list.php
│   ├── galleries-list.php
│   ├── config.php              (Create manually)
│   ├── config-helper.php
│   └── ... (all other API files)
├── public/                      (Upload directories)
│   ├── artist-images/
│   │   └── thumbnails/
│   ├── gallery-images/
│   │   └── thumbnails/
│   └── event-images/
└── .htaccess
```

## Upload Instructions

### Frontend Files
Upload from `dist/` to `/home/elektry/www/`:
- `index.html` → `/home/elektry/www/index.html`
- `assets/` → `/home/elektry/www/assets/`
- `.htaccess` → `/home/elektry/www/.htaccess`

### Backend Files
Upload from `api/` to `/home/elektry/www/api/`:
- All `.php` files → `/home/elektry/www/api/`
- **Create** `/home/elektry/www/api/config.php` manually

### Directories
Create these directories:
```bash
mkdir -p /home/elektry/www/public/artist-images/thumbnails
mkdir -p /home/elektry/www/public/gallery-images/thumbnails
mkdir -p /home/elektry/www/public/event-images
chmod 755 /home/elektry/www/public/artist-images
chmod 755 /home/elektry/www/public/gallery-images
```

## Verification

### Check API Files
```bash
ls -la /home/elektry/www/api/
```

Should show:
- `events-list.php`
- `artists-list.php`
- `galleries-list.php`
- `config.php`
- `config-helper.php`

### Check File Permissions
```bash
chmod 755 /home/elektry/www/api/
chmod 644 /home/elektry/www/api/*.php
chmod 600 /home/elektry/www/api/config.php
```

### Test API Access
Visit in browser:
- `https://www.elektr-ame.com/api/events-list.php`
- `https://www.elektr-ame.com/api/test-all-endpoints.php` (diagnostic)

## Important Notes

- The `config-helper.php` has been updated to detect OVH path (`/home/elektry/www`)
- File paths are automatically adjusted based on environment
- Upload directories will be created automatically if they don't exist

