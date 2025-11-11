# Local Development with OVH Database

## ✅ Current Setup
- ✅ Frontend: Running on `http://localhost:8080`
- ✅ PHP API: Running on `http://localhost:8000`
- ⚠️ Database: OVH MySQL connection needed

## 🚀 Quick Start: Connect to OVH Database

### Option 1: SSH Tunnel (Recommended)

**Step 1:** Start the SSH tunnel in a separate terminal:
```bash
./setup-ssh-tunnel.sh
```
Or manually:
```bash
ssh -L 3306:elektry2025.mysql.db:3306 -N elektry@ftp.cluster129.hosting.ovh.net
```

**Step 2:** Temporarily use the tunnel config:
```bash
# Backup current config
cp api/config.php api/config-production.php

# Use tunnel config
cp api/config-local-ovh.php api/config.php
```

**Step 3:** Test the connection:
```bash
curl http://localhost:8000/api/test-db-connection.php
```

**Step 4:** Access the website:
```
http://localhost:8080
```

### Option 2: Check OVH Remote Access

1. **OVH Control Panel** → **Web Cloud** → **Databases** → **MySQL**
2. Find your database: `elektry2025`
3. Check "Remote access" settings
4. If available, add your IP address
5. Then use the original `config.php` (already configured)

### Option 3: Direct Connection Test

Test if OVH allows direct connection:
```bash
php -r "try { \$pdo = new PDO('mysql:host=elektry2025.mysql.db;dbname=elektry2025;charset=utf8mb4', 'elektry2025', '92Alcolea2025'); echo 'SUCCESS - Direct connection works!\n'; } catch (Exception \$e) { echo 'ERROR: ' . \$e->getMessage() . '\n'; }"
```

If this works, you don't need the SSH tunnel!

## 📝 Files Created

- `setup-ssh-tunnel.sh` - Script to create SSH tunnel
- `api/config-local-ovh.php` - Config for SSH tunnel connection
- `LOCAL_SETUP_OVH_DB.md` - This file

## 🔄 Restore Production Config

When done developing, restore production config:
```bash
cp api/config-production.php api/config.php
```

## ⚠️ Important Notes

- Keep the SSH tunnel running while developing
- The tunnel forwards `localhost:3306` to OVH MySQL
- Frontend connects to local API (`localhost:8000`)
- API connects to database via tunnel (`127.0.0.1:3306`)

