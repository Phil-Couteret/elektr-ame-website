# 🌍 Environment-Aware Configuration

This document explains how the codebase handles both local development and OVH production environments.

## 🔧 Configuration Files

### `api/config.php` (Not in Git)
- **Local**: Contains `localhost` database credentials
- **OVH**: Contains `elektry2025.mysql.db` credentials
- **⚠️ NEVER committed to git** (in `.gitignore`)

### `api/config-helper.php` (In Git)
- Environment detection functions
- CORS header management
- Path resolution for uploads
- **✅ Safe to commit** (no credentials)

### Templates
- `api/config-template.php` - Local development template
- `api/config-ovh-template.php` - OVH production template

## 🔄 Environment Detection

The `config-helper.php` automatically detects the environment:

```php
isLocalEnvironment() // Returns true for localhost, false for production
```

**Local Indicators:**
- `localhost` in HTTP_HOST
- `127.0.0.1` in HTTP_HOST
- Development server patterns

**Production Indicators:**
- `www.elektr-ame.com`
- `elektr-ame.com`
- Any other domain

## 🌐 CORS Configuration

### Local Development
Allows:
- `http://localhost:8080`
- `http://127.0.0.1:8080`
- `https://www.elektr-ame.com` (for testing)

### OVH Production
Allows:
- `https://www.elektr-ame.com`
- `https://elektr-ame.com`

**Usage in API files:**
```php
require_once __DIR__ . '/config-helper.php';
setCorsHeaders(); // Automatically sets correct CORS
```

## 📁 File Paths

### Upload Directories

**Local:**
```
api/../public/gallery-images/
```

**OVH:**
```
/www/public/gallery-images/
```

**Automatic handling:**
```php
$uploadDir = getUploadDirectory('gallery-images/');
// Works in both environments!
```

## 🗄️ Database Configuration

### Local Development
```php
$host = 'localhost';
$dbname = 'elektr_ame';
$username = 'root';
$password = '=30872Pc'; // Local MySQL password
```

### OVH Production
```php
$host = 'elektry2025.mysql.db';
$dbname = 'elektry2025';
$username = 'elektry2025';
$password = 'YOUR_OVH_PASSWORD'; // OVH database password
```

## 📋 Deployment Checklist

### Before Deploying to OVH

1. **Update `api/config.php` on OVH:**
   ```bash
   # On OVH server
   cp api/config-ovh-template.php api/config.php
   # Edit config.php with OVH credentials
   ```

2. **Verify file paths:**
   - Check `getUploadDirectory()` works on OVH
   - Test gallery image upload
   - Verify thumbnails are created

3. **Test CORS:**
   - Verify API calls work from `www.elektr-ame.com`
   - Check browser console for CORS errors

4. **Database:**
   - Import all schema files
   - Create admin user
   - Test database connection

## 🔒 Security Notes

1. **`config.php` is NEVER in git**
   - Always manually upload to OVH
   - Use secure file permissions (600)

2. **Environment detection is automatic**
   - No manual switching needed
   - Code adapts to environment

3. **CORS is restrictive in production**
   - Only allows `www.elektr-ame.com`
   - Prevents unauthorized access

## 🐛 Troubleshooting

### "Upload directory not found" on OVH

**Solution:**
1. Check `getUploadDirectory()` function
2. Verify `$_SERVER['DOCUMENT_ROOT']` is correct
3. Manually create directories if needed:
   ```bash
   mkdir -p /www/public/gallery-images/thumbnails
   chmod 755 /www/public/gallery-images
   ```

### CORS errors on production

**Solution:**
1. Verify `config-helper.php` is uploaded
2. Check `setCorsHeaders()` is called
3. Verify origin matches `www.elektr-ame.com`

### Database connection fails on OVH

**Solution:**
1. Check `config.php` has OVH credentials
2. Verify database host is correct
3. Test connection via phpMyAdmin
4. Check firewall allows database connections

---

**Key Principle:** Code automatically adapts to environment. Only `config.php` needs manual configuration per environment.

