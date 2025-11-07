# 🍺 Installing PHP and MySQL on macOS

Complete guide to install PHP 8.4+ and MySQL 8.0+ on your Mac.

---

## ✅ **PREREQUISITE: Homebrew**

You already have Homebrew installed! ✅

If you didn't have it, install it with:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## 🐘 **INSTALL PHP 8.4**

### **Step 1: Add PHP Tap**
```bash
brew tap shivammathur/php
```

### **Step 2: Install PHP 8.4**
```bash
brew install shivammathur/php/php@8.4
```

### **Step 3: Link PHP (make it available in PATH)**
```bash
brew link php@8.4
```

### **Step 4: Verify Installation**
```bash
php --version
```

**Expected output:**
```
PHP 8.4.x (cli) (built: ...)
```

### **Step 5: Add PHP to PATH (if needed)**

If `php --version` doesn't work after installation, add to your shell profile:

**For Zsh (default on macOS):**
```bash
echo 'export PATH="/opt/homebrew/opt/php@8.4/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/php@8.4/sbin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**For Bash:**
```bash
echo 'export PATH="/opt/homebrew/opt/php@8.4/bin:$PATH"' >> ~/.bash_profile
echo 'export PATH="/opt/homebrew/opt/php@8.4/sbin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```

---

## 🗄️ **INSTALL MySQL 8.0**

### **Step 1: Install MySQL**
```bash
brew install mysql
```

### **Step 2: Start MySQL Service**
```bash
brew services start mysql
```

### **Step 3: Secure MySQL Installation (Recommended)**
```bash
mysql_secure_installation
```

**Follow the prompts:**
- Set root password? **Yes** (choose a strong password)
- Remove anonymous users? **Yes**
- Disallow root login remotely? **Yes** (for local dev, this is fine)
- Remove test database? **Yes**
- Reload privilege tables? **Yes**

### **Step 4: Verify Installation**
```bash
mysql --version
```

**Expected output:**
```
mysql  Ver 8.0.x for macos...
```

### **Step 5: Test Connection**
```bash
mysql -u root -p
```

Enter the password you set during `mysql_secure_installation`.

**If successful, you'll see:**
```
Welcome to the MySQL monitor...
mysql>
```

Type `EXIT;` to leave.

---

## 🔧 **QUICK INSTALL SCRIPT**

Run this all at once:

```bash
# Install PHP 8.4
brew tap shivammathur/php
brew install shivammathur/php/php@8.4
brew link php@8.4

# Install MySQL
brew install mysql
brew services start mysql

# Verify
php --version
mysql --version
```

---

## 🎯 **AFTER INSTALLATION**

### **1. Create Database for Elektr-Âme**

```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE elektr_ame CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### **2. Import Schema**

```bash
cd /Users/phil/Documents/Work\ Dev/GitHub/elektr-ame-website
mysql -u root -p elektr_ame < database/schema.sql
```

### **3. Configure PHP Connection**

Edit `api/config.php`:
```php
$host = 'localhost';
$dbname = 'elektr_ame';
$username = 'root';
$password = 'your_mysql_root_password'; // The password you set
```

---

## 🛠️ **USEFUL COMMANDS**

### **PHP Commands**
```bash
# Check PHP version
php --version

# Check PHP modules
php -m

# Start PHP built-in server
php -S localhost:8000

# Check PHP configuration
php --ini
```

### **MySQL Commands**
```bash
# Start MySQL service
brew services start mysql

# Stop MySQL service
brew services stop mysql

# Restart MySQL service
brew services restart mysql

# Check MySQL status
brew services list | grep mysql

# Connect to MySQL
mysql -u root -p

# Connect to specific database
mysql -u root -p elektr_ame
```

### **MySQL Management**
```sql
-- Show all databases
SHOW DATABASES;

-- Use a database
USE elektr_ame;

-- Show all tables
SHOW TABLES;

-- Show table structure
DESCRIBE table_name;

-- Exit MySQL
EXIT;
```

---

## 🔍 **TROUBLESHOOTING**

### **Issue: "PHP command not found"**

**Solution 1: Link PHP**
```bash
brew link php@8.4
```

**Solution 2: Add to PATH**
```bash
# For Apple Silicon Macs
echo 'export PATH="/opt/homebrew/opt/php@8.4/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# For Intel Macs
echo 'export PATH="/usr/local/opt/php@8.4/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Solution 3: Check where PHP is installed**
```bash
brew --prefix php@8.4
# Then add that path to your PATH
```

---

### **Issue: "MySQL connection refused"**

**Solution:**
```bash
# Make sure MySQL is running
brew services start mysql

# Check if it's running
brew services list | grep mysql
# Should show: mysql started
```

---

### **Issue: "Access denied for user 'root'"**

**Solution:**
```bash
# Reset MySQL root password
brew services stop mysql
mysqld_safe --skip-grant-tables &

# In another terminal:
mysql -u root
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
EXIT;

# Stop the safe mode server and restart normally
brew services restart mysql
```

---

### **Issue: "Port 3306 already in use"**

**Solution:**
```bash
# Find what's using port 3306
lsof -i :3306

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or stop and restart MySQL
brew services stop mysql
brew services start mysql
```

---

## 📦 **ALTERNATIVE INSTALLATION METHODS**

### **Option 1: XAMPP (All-in-One)**

XAMPP includes PHP, MySQL, and Apache in one package.

**Download:** https://www.apachefriends.org/

**Pros:**
- ✅ Easy installation
- ✅ Everything in one package
- ✅ GUI management

**Cons:**
- ❌ Older PHP versions
- ❌ Less control
- ❌ Can conflict with Homebrew

---

### **Option 2: MAMP (Mac-specific)**

Similar to XAMPP but Mac-optimized.

**Download:** https://www.mamp.info/

---

### **Option 3: Docker**

Run PHP and MySQL in containers.

**Install Docker Desktop:** https://www.docker.com/products/docker-desktop

**Pros:**
- ✅ Isolated environment
- ✅ Easy to reset
- ✅ Consistent across machines

**Cons:**
- ❌ More complex setup
- ❌ Requires Docker knowledge

---

## ✅ **VERIFICATION CHECKLIST**

After installation, verify everything works:

- [ ] PHP installed: `php --version` shows 8.4.x
- [ ] MySQL installed: `mysql --version` shows 8.0.x
- [ ] MySQL running: `brew services list | grep mysql` shows "started"
- [ ] Can connect: `mysql -u root -p` works
- [ ] Database created: `mysql -u root -p -e "SHOW DATABASES;"` shows `elektr_ame`
- [ ] PHP can connect: Create a test file and verify PDO works

---

## 🧪 **TEST PHP-MySQL CONNECTION**

Create a test file:

```bash
cat > test-connection.php << 'EOF'
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=elektr_ame", "root", "your_password");
    echo "✅ Database connection successful!\n";
} catch (PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n";
}
?>
EOF

php test-connection.php
```

If successful, you'll see: `✅ Database connection successful!`

---

## 🎉 **YOU'RE READY!**

Once PHP and MySQL are installed:

1. ✅ Create database: `mysql -u root -p -e "CREATE DATABASE elektr_ame;"`
2. ✅ Import schema: `mysql -u root -p elektr_ame < database/schema.sql`
3. ✅ Configure `api/config.php` with your MySQL password
4. ✅ Start development: `./start-local.sh` or manually start both servers

---

## 📚 **ADDITIONAL RESOURCES**

- **PHP Documentation:** https://www.php.net/docs.php
- **MySQL Documentation:** https://dev.mysql.com/doc/
- **Homebrew:** https://brew.sh/
- **PHP Homebrew Tap:** https://github.com/shivammathur/homebrew-php

---

**Last Updated:** 2025-01-XX

