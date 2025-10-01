# 🚀 OVH Hosting Deployment Guide

## 📁 Files to Upload

Upload the entire contents of this `ovh-deployment` folder to your OVH hosting:

### Frontend Files (Upload to `www` or `public_html`)
- `index.html`
- `assets/` folder
- `lovable-uploads/` folder
- `favicon.ico`
- `robots.txt`
- `.htaccess`

### Backend Files (Upload to `www` or `public_html`)
- `api/` folder (contains PHP files)

### Database Files
- `database/schema.sql` (import this in your MySQL database)

## 🔧 OVH Setup Steps

### 1. Upload Files via File Manager
1. **Login to OVH Control Panel**
2. **Go to Web Hosting** → Your hosting plan
3. **Click "File Manager"**
4. **Navigate to `www` or `public_html` folder**
5. **Upload all files** from this `ovh-deployment` folder

### 2. Set Up MySQL Database
1. **Go to "Databases"** in OVH Control Panel
2. **Create a new MySQL database** (if not already created)
3. **Note down:**
   - Database name
   - Username
   - Password
   - Server address
4. **Import the database:**
   - Go to "phpMyAdmin"
   - Create a new database with the name you noted
   - Import `database/schema.sql`

### 3. Configure PHP Backend
1. **Edit `api/config.php`:**
   ```php
   'database' => [
       'host' => 'your-mysql-server.ovh.net', // Your OVH MySQL server
       'dbname' => 'your_database_name',       // Your database name
       'username' => 'your_username',          // Your MySQL username
       'password' => 'your_password',          // Your MySQL password
       // ...
   ]
   ```

### 4. Test Your Website
1. **Visit your domain** (e.g., `https://yourdomain.com`)
2. **Test the Join Us form** to ensure PHP backend works
3. **Check all pages** load correctly
4. **Test language switching**

## 🔍 Troubleshooting

### Common Issues:

**1. 404 Errors on Page Refresh:**
- Make sure `.htaccess` file is uploaded
- Check that mod_rewrite is enabled on OVH

**2. PHP Errors:**
- Check `api/config.php` database credentials
- Ensure PHP 8.4+ is enabled
- Check error logs in OVH Control Panel

**3. Database Connection Issues:**
- Verify MySQL credentials in `api/config.php`
- Check if database exists and tables are created
- Test connection in phpMyAdmin

**4. File Permissions:**
- Set `api/` folder permissions to 755
- Set PHP files permissions to 644

## 📞 OVH Support

If you need help:
1. **Check OVH documentation**
2. **Contact OVH support**
3. **Check error logs** in your hosting control panel

## ✅ Success Checklist

- [ ] All files uploaded to `www` or `public_html`
- [ ] `.htaccess` file is in place
- [ ] MySQL database created and schema imported
- [ ] `api/config.php` updated with correct credentials
- [ ] Website loads at your domain
- [ ] Join Us form works
- [ ] All pages accessible
- [ ] Language switching works

## 🎉 Your Site is Live!

Once everything is working, your Elektr-Âme website will be live at your domain!
