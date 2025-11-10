═══════════════════════════════════════════════════════════════
🚀 OVH DEPLOYMENT PACKAGE
═══════════════════════════════════════════════════════════════

FTP Server: ftp.cluster129.hosting.ovh.net
Home Path: /home/elektry
Login: elektry
Password: 92Alcolea2025

═══════════════════════════════════════════════════════════════
📤 UPLOAD INSTRUCTIONS
═══════════════════════════════════════════════════════════════

1. Connect to FTP:
   - Host: ftp.cluster129.hosting.ovh.net
   - Username: elektry
   - Password: 92Alcolea2025
   - Port: 21 (FTP) or 22 (SFTP)

2. Navigate to: /home/elektry/www/

3. Upload ALL files from this folder to /home/elektry/www/
   - Upload everything (including .htaccess)
   - Overwrite existing files
   - Keep directory structure (api/ folder, assets/ folder, etc.)

4. Create config.php manually:
   - See CREATE_CONFIG_PHP.txt for instructions
   - Location: /home/elektry/www/api/config.php
   - Set permissions: chmod 600

═══════════════════════════════════════════════════════════════
📁 WHAT'S INCLUDED
═══════════════════════════════════════════════════════════════

✅ React build files (index.html, assets/, etc.)
✅ .htaccess (with API passthrough configured)
✅ All API PHP files (74 files)
✅ API classes subdirectory
❌ config.php (create manually - see CREATE_CONFIG_PHP.txt)

═══════════════════════════════════════════════════════════════
✅ VERIFICATION
═══════════════════════════════════════════════════════════════

After uploading, test:

1. https://www.elektr-ame.com/api/test-api-access.php
   → Should return JSON

2. https://www.elektr-ame.com/api/events-list.php
   → Should return JSON

3. https://www.elektr-ame.com/admin
   → Should load admin portal

═══════════════════════════════════════════════════════════════

