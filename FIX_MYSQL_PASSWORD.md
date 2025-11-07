# 🔐 Fix MySQL Password Issue

Your MySQL connection is being denied. Here's how to fix it:

---

## 🔍 **STEP 1: Try Connecting Without Password**

Some MySQL installations (especially Homebrew) don't set a password by default.

**Test in terminal:**
```bash
mysql -u root
```

If this works (no password prompt), then your MySQL has no password. Update `api/config.php`:
```php
$password = ''; // Empty string
```

---

## 🔧 **STEP 2: Reset MySQL Root Password**

If you forgot your password or it's not working:

### **Option A: Reset via MySQL Safe Mode**

1. **Stop MySQL:**
   ```bash
   brew services stop mysql
   # OR
   sudo /usr/local/mysql/support-files/mysql.server stop
   ```

2. **Start MySQL in safe mode (skip password):**
   ```bash
   mysqld_safe --skip-grant-tables &
   ```

3. **Connect without password:**
   ```bash
   mysql -u root
   ```

4. **Reset password:**
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   EXIT;
   ```

5. **Stop safe mode and restart MySQL normally:**
   ```bash
   killall mysqld
   brew services start mysql
   ```

6. **Test new password:**
   ```bash
   mysql -u root -p
   # Enter: newpassword
   ```

---

### **Option B: Use Homebrew Reset (if installed via Homebrew)**

```bash
# Stop MySQL
brew services stop mysql

# Remove old data (WARNING: This deletes all databases!)
rm -rf /opt/homebrew/var/mysql
# OR for Intel Macs:
# rm -rf /usr/local/var/mysql

# Reinitialize MySQL
mysqld --initialize-insecure

# Start MySQL
brew services start mysql

# Now connect without password
mysql -u root
```

---

## 🆕 **STEP 3: Create a New MySQL User (Alternative)**

Instead of using root, create a dedicated user for the website:

```bash
mysql -u root -p
```

Then in MySQL:
```sql
-- Create new user
CREATE USER 'elektr_ame'@'localhost' IDENTIFIED BY 'your_password_here';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON elektr_ame.* TO 'elektr_ame'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Test the new user
EXIT;
```

Then test:
```bash
mysql -u elektr_ame -p elektr_ame
```

Update `api/config.php`:
```php
$username = 'elektr_ame';
$password = 'your_password_here';
```

---

## ✅ **STEP 4: Verify Connection**

After fixing the password, test:

```bash
mysql -u root -p elektr_ame
# Enter your password
```

If it works, update `api/config.php` with the same password.

---

## 🧪 **STEP 5: Test via PHP**

Visit:
```
http://localhost:8000/api/test-config.php
```

Enter the credentials that worked in the terminal.

---

## 🔍 **Common Issues**

### **Issue: "Access denied" even with correct password**

**Solution:** MySQL might be using socket authentication. Try:
```php
// In config.php, use socket instead of host
$pdo = new PDO("mysql:unix_socket=/tmp/mysql.sock;dbname=$dbname;charset=utf8mb4", $username, $password);
```

Or find your socket location:
```bash
mysql_config --socket
```

---

### **Issue: MySQL not running**

**Check:**
```bash
brew services list | grep mysql
```

**Start:**
```bash
brew services start mysql
```

---

### **Issue: Wrong MySQL installation**

If you have multiple MySQL installations, find which one is running:
```bash
which mysql
ps aux | grep mysql
```

---

## 💡 **Quick Test Commands**

```bash
# Test connection (no password)
mysql -u root

# Test connection (with password)
mysql -u root -p

# Test connection to specific database
mysql -u root -p elektr_ame

# Check MySQL status
brew services list | grep mysql

# Check MySQL version
mysql --version
```

---

## 🎯 **Recommended Solution**

1. **Try no password first:**
   - Update `api/config.php`: `$password = '';`
   - Test: `http://localhost:8000/api/test-db-connection.php`

2. **If that doesn't work, reset password:**
   - Follow Step 2 above
   - Use a simple password like `root` or `password` for local dev

3. **Update config.php with the working password**

4. **Test admin setup:**
   - `http://localhost:8000/api/setup-admin-local.php`

---

**Need more help?** Check MySQL error logs:
```bash
tail -f /opt/homebrew/var/mysql/*.err
# OR for Intel Macs:
# tail -f /usr/local/var/mysql/*.err
```


