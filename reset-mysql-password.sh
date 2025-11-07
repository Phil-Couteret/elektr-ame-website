#!/bin/bash

# Reset MySQL Root Password Script
# This will help you reset or set a new MySQL root password

echo "🔐 MySQL Password Reset Helper"
echo "=============================="
echo ""

# Check if MySQL is running
if ! brew services list | grep -q "mysql.*started"; then
    echo "⚠️  MySQL is not running. Starting it..."
    brew services start mysql
    sleep 3
fi

echo "This script will help you reset your MySQL root password."
echo ""
echo "Option 1: Reset to a new password"
echo "Option 2: Create a new database user (recommended for local dev)"
echo ""
read -p "Choose option (1 or 2): " option

if [ "$option" == "1" ]; then
    echo ""
    echo "⚠️  To reset MySQL root password, we need to:"
    echo "   1. Stop MySQL"
    echo "   2. Start it in safe mode (no password required)"
    echo "   3. Reset the password"
    echo "   4. Restart MySQL normally"
    echo ""
    read -p "Continue? (y/n): " confirm
    
    if [ "$confirm" != "y" ]; then
        echo "Cancelled."
        exit 0
    fi
    
    echo ""
    echo "Step 1: Stopping MySQL..."
    brew services stop mysql
    sleep 2
    
    echo "Step 2: Starting MySQL in safe mode..."
    mysqld_safe --skip-grant-tables &
    sleep 3
    
    echo "Step 3: Resetting password..."
    read -sp "Enter NEW root password: " newpass
    echo ""
    
    mysql -u root << EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '$newpass';
FLUSH PRIVILEGES;
EXIT;
EOF
    
    echo "Step 4: Stopping safe mode..."
    killall mysqld_safe
    killall mysqld
    sleep 2
    
    echo "Step 5: Starting MySQL normally..."
    brew services start mysql
    sleep 3
    
    echo ""
    echo "✅ Password reset complete!"
    echo ""
    echo "Update api/config.php with:"
    echo "  \$password = '$newpass';"
    
elif [ "$option" == "2" ]; then
    echo ""
    echo "Creating a new MySQL user for elektr_ame..."
    echo ""
    echo "We'll need your current MySQL root password to create the user."
    echo "If you don't know it, choose Option 1 first to reset it."
    echo ""
    read -sp "Enter MySQL root password: " rootpass
    echo ""
    
    read -sp "Enter password for new 'elektr_ame' user: " userpass
    echo ""
    
    mysql -u root -p"$rootpass" << EOF
CREATE USER IF NOT EXISTS 'elektr_ame'@'localhost' IDENTIFIED BY '$userpass';
GRANT ALL PRIVILEGES ON elektr_ame.* TO 'elektr_ame'@'localhost';
FLUSH PRIVILEGES;
EXIT;
EOF
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ New user created successfully!"
        echo ""
        echo "Update api/config.php with:"
        echo "  \$username = 'elektr_ame';"
        echo "  \$password = '$userpass';"
        echo ""
        echo "Test connection:"
        echo "  mysql -u elektr_ame -p elektr_ame"
    else
        echo ""
        echo "❌ Failed to create user. Check your root password."
    fi
else
    echo "Invalid option."
    exit 1
fi


