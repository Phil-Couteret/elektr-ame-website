# 🖥️ Local Development Setup Guide

Complete guide to run the Elektr-Âme website locally on your machine.

---

## 📋 **PREREQUISITES**

### **Required Software:**
1. **Node.js** (v18.0.0 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **npm** (v8.0.0 or higher)
   - Check: `npm --version`
   - Comes with Node.js

3. **PHP** (v8.4 or higher)
   - Check: `php --version`
   - 📖 **See [INSTALL_PHP_MYSQL.md](INSTALL_PHP_MYSQL.md) for detailed installation instructions**
   - Quick install: `brew tap shivammathur/php && brew install shivammathur/php/php@8.4`

4. **MySQL** (v8.0 or higher)
   - Check: `mysql --version`
   - 📖 **See [INSTALL_PHP_MYSQL.md](INSTALL_PHP_MYSQL.md) for detailed installation instructions**
   - Quick install: `brew install mysql && brew services start mysql`

---

## 🚀 **QUICK START (3 Steps)**

### **Step 1: Install Dependencies**
```bash
cd /Users/phil/Documents/Work\ Dev/GitHub/elektr-ame-website
npm install
```

### **Step 2: Set Up Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE elektr_ame;
EXIT;

# Run schema
mysql -u root -p elektr_ame < database/schema.sql
```

### **Step 3: Configure & Run**
```bash
# Create config.php from template
cp api/config-template.php api/config.php
# Edit api/config.php with your MySQL credentials

# Terminal 1: Start PHP backend
php -S localhost:8000

# Terminal 2: Start React frontend
npm run dev
```

**Visit:** http://localhost:8080 (or port shown in terminal)

---

## 📝 **DETAILED SETUP**

### **1. Frontend Setup (React/Vite)**

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

**Default URL:** http://localhost:8080 (check terminal output)

**Features:**
- ✅ Hot module replacement (HMR)
- ✅ Fast refresh
- ✅ TypeScript support
- ✅ Tailwind CSS

---

### **2. Backend Setup (PHP)**

#### Create Database Configuration

1. **Copy template:**
   ```bash
   cp api/config-template.php api/config.php
   ```

2. **Edit `api/config.php`** with your local MySQL credentials:
   ```php
   $host = 'localhost';
   $dbname = 'elektr_ame';
   $username = 'root';        // Your MySQL username
   $password = 'your_password'; // Your MySQL password
   ```

#### Start PHP Server

**Option A: PHP Built-in Server (Recommended for Development)**
```bash
# From project root
php -S localhost:8000
```

**Option B: Using Apache/Nginx**
- Configure virtual host pointing to project directory
- Ensure PHP is enabled

---

### **3. Database Setup**

#### Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE elektr_ame CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Import Schema
```bash
# Import main schema
mysql -u root -p elektr_ame < database/schema.sql

# Import gallery images schema (if needed)
mysql -u root -p elektr_ame < database/gallery_images_schema.sql

# Import artist images schema (if needed)
mysql -u root -p elektr_ame < database/artist_images_schema.sql

# Import auth security tables (if needed)
mysql -u root -p elektr_ame < database/auth-security-tables.sql

# Import email automation tables (if needed)
mysql -u root -p elektr_ame < database/email-automation-tables.sql

# Import admin users table (if needed)
mysql -u root -p elektr_ame < database/admin-users.sql
```

#### Create Admin User (Optional)
```sql
mysql -u root -p elektr_ame

-- Generate password hash first (use generate-password-hash.php)
-- Then insert:
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('admin@elektr-ame.com', 'YOUR_HASH_HERE', 'Admin', 'superadmin');
```

---

## 🔧 **CONFIGURATION**

### **Frontend Configuration**

The frontend runs on **port 8080** by default (see `vite.config.ts`).

**API Endpoints:**
- Frontend expects API at: `/api/...`
- ✅ **Vite automatically proxies** `/api/*` requests to `http://localhost:8000`
- Make sure PHP server is running on port 8000
- No need to change API URLs in code - relative paths work!

### **Backend Configuration**

**CORS Settings:**
- Current: `Access-Control-Allow-Origin: https://www.elektr-ame.com`
- For local dev, you may need to update to: `http://localhost:8080`

**Update CORS in API files:**
```php
// In api/join-us.php, api/auth-login.php, etc.
header('Access-Control-Allow-Origin: http://localhost:8080');
```

Or create a local config override.

---

## 🎯 **RUNNING BOTH SERVERS**

### **Terminal 1: PHP Backend**
```bash
cd /Users/phil/Documents/Work\ Dev/GitHub/elektr-ame-website
php -S localhost:8000
```

**Output:**
```
PHP 8.4.0 Development Server (http://localhost:8000) started
```

### **Terminal 2: React Frontend**
```bash
cd /Users/phil/Documents/Work\ Dev/GitHub/elektr-ame-website
npm run dev
```

**Output:**
```
  VITE v5.4.1  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### **Access the Site**
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8000/api/

---

## 🧪 **TESTING**

### **Test Frontend**
1. Visit: http://localhost:8080
2. Check browser console for errors
3. Test language switching
4. Test navigation

### **Test Backend API**
```bash
# Test database connection
curl http://localhost:8000/api/test-db-connection.php

# Test join-us endpoint
curl -X POST http://localhost:8000/api/join-us.php \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "city": "Barcelona",
    "country": "Spain"
  }'
```

### **Test Admin Login**
1. Visit: http://localhost:8080/admin
2. Login with admin credentials
3. Test admin panel features

---

## 🔧 **TROUBLESHOOTING**

### **Issue: "Cannot connect to database"**
**Solutions:**
- Check MySQL is running: `brew services list` (or check system services)
- Verify credentials in `api/config.php`
- Test connection: `mysql -u root -p -e "SELECT 1;"`

### **Issue: "CORS error"**
**Solutions:**
- Update CORS headers in API files to allow `http://localhost:8080`
- Or use a browser extension to disable CORS (development only)

### **Issue: "Port 8080 already in use"**
**Solutions:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or change port in vite.config.ts
```

### **Issue: "Port 8000 already in use"**
**Solutions:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
php -S localhost:8001
```

### **Issue: "Module not found" errors**
**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **Issue: "config.php not found"**
**Solutions:**
- Make sure you created `api/config.php` from template
- Check file exists: `ls -la api/config.php`

---

## 📁 **PROJECT STRUCTURE FOR LOCAL DEV**

```
elektr-ame-website/
├── src/                    # React source code
├── public/                 # Static assets
├── api/                    # PHP backend
│   ├── config.php         # ⚠️ Create this from template!
│   └── *.php              # API endpoints
├── database/              # SQL schemas
├── dist/                  # Built files (generated)
└── node_modules/          # Dependencies (generated)
```

---

## 🎯 **DEVELOPMENT WORKFLOW**

### **Daily Development:**
1. **Start MySQL** (if not running as service)
   ```bash
   brew services start mysql
   # or
   mysql.server start
   ```

2. **Start PHP backend** (Terminal 1)
   ```bash
   php -S localhost:8000
   ```

3. **Start React frontend** (Terminal 2)
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Visit: http://localhost:8080
   - Make changes
   - See updates instantly (HMR)

### **Testing Changes:**
- Frontend changes: Auto-reloads in browser
- Backend changes: Restart PHP server (Ctrl+C, then restart)
- Database changes: Run SQL migrations manually

---

## 🔐 **LOCAL CONFIGURATION**

### **Create `api/config.php`**

```php
<?php
// Local Development Configuration
// Database configuration
$host = 'localhost';
$dbname = 'elektr_ame';
$username = 'root';        // Your local MySQL username
$password = '';            // Your local MySQL password (empty if no password)

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>
```

**⚠️ IMPORTANT:** Add `api/config.php` to `.gitignore` if not already there!

---

## 🛠️ **USEFUL COMMANDS**

### **Development**
```bash
# Start frontend dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### **Database**
```bash
# Connect to MySQL
mysql -u root -p elektr_ame

# Import schema
mysql -u root -p elektr_ame < database/schema.sql

# Export database
mysqldump -u root -p elektr_ame > backup.sql
```

### **PHP**
```bash
# Start PHP server
php -S localhost:8000

# Check PHP version
php --version

# Test PHP file
php api/test-db-connection.php
```

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Node.js installed (v18+)
- [ ] npm installed (v8+)
- [ ] PHP installed (v8.4+)
- [ ] MySQL installed (v8.0+)
- [ ] Dependencies installed (`npm install`)
- [ ] Database created
- [ ] Schema imported
- [ ] `api/config.php` created with correct credentials
- [ ] PHP server running on port 8000
- [ ] React dev server running on port 8080
- [ ] Site accessible at http://localhost:8080
- [ ] API endpoints responding
- [ ] Admin login working

---

## 🎉 **YOU'RE READY!**

Once both servers are running:
- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:8000/api/

**Happy coding!** 🚀

---

## 📞 **NEED HELP?**

Common issues:
1. **Port conflicts:** Change ports in `vite.config.ts` or use different PHP port
2. **Database connection:** Double-check `api/config.php` credentials
3. **CORS errors:** Update API CORS headers for localhost
4. **Module errors:** Run `npm install` again

---

**Last Updated:** 2025-01-XX

