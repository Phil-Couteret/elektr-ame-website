📦 OVH DEPLOYMENT PACKAGE
========================

This package contains all files needed to deploy the Elektr-Âme website to OVH.

📍 UPLOAD LOCATION
------------------
Upload ALL files to: www/ (or www folder in OVH File Manager)

📋 FILES INCLUDED
-----------------
✅ index.html - Built production version (with /assets/index-*.js)
✅ assets/ - All built JavaScript and CSS files
✅ api/ - All PHP API endpoints
✅ .htaccess - With PHP handlers and MIME types
✅ manifest.json - PWA manifest
✅ service-worker.js - PWA service worker
✅ public/ - Upload directories (artist-images, gallery-images, etc.)
✅ .ovhconfig - PHP 8.4 configuration

⚠️ IMPORTANT: config.php
-------------------------
The api/config.php file is a TEMPLATE with production credentials.

After uploading, verify:
- File exists at: www/api/config.php
- Contains: $host = "elektry2025.mysql.db"
- Does NOT contain: $host = "127.0.0.1"

🔧 UPLOAD INSTRUCTIONS
----------------------
1. Log into OVH Control Panel
2. Go to Web → File Manager
3. Navigate to www folder
4. Upload ALL files from this package
5. Overwrite existing files when prompted
6. Wait 1-2 minutes for server cache to clear
7. Test: https://www.elektr-ame.com

✅ VERIFICATION
--------------
After uploading, check:
- https://www.elektr-ame.com - Site loads (not blank)
- https://www.elektr-ame.com/api/test-db-connection.php - Returns JSON
- View page source - Should show /assets/index-*.js (NOT /src/main.tsx)

📁 DIRECTORY STRUCTURE
----------------------
www/
├── index.html (✅ Built version)
├── assets/ (✅ Built JS/CSS)
├── api/ (✅ All PHP files)
├── .htaccess (✅ With MIME types)
├── manifest.json
├── service-worker.js
├── public/
│   ├── artist-images/
│   ├── gallery-images/
│   ├── event-images/
│   └── elektr-ame-media/
└── .ovhconfig

🚀 READY TO DEPLOY!

