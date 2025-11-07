#!/bin/bash

# Setup Admin Panel for Local Development
# This script creates the admin_users table and a test admin user

echo "🔧 Setting up Admin Panel for Local Development..."
echo ""

# Check if database exists
echo "Step 1: Checking database connection..."
mysql -u root -p -e "USE elektr_ame;" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Cannot connect to database 'elektr_ame'"
    echo "   Make sure:"
    echo "   1. MySQL is running: brew services start mysql"
    echo "   2. Database exists: mysql -u root -p -e 'CREATE DATABASE elektr_ame;'"
    echo "   3. Schema is imported: mysql -u root -p elektr_ame < database/schema.sql"
    exit 1
fi

echo "✅ Database connection OK"
echo ""

# Import admin_users table
echo "Step 2: Creating admin_users table..."
mysql -u root -p elektr_ame < database/admin-users.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ admin_users table created/verified"
else
    echo "⚠️  Table might already exist (this is OK)"
fi

echo ""

# Generate password hash
echo "Step 3: Creating admin user..."
echo ""
echo "Enter MySQL root password when prompted:"
echo ""

# Create a temporary PHP file to generate password hash
cat > /tmp/generate-admin-hash.php << 'PHPEOF'
<?php
$password = 'admin123'; // Default local dev password
$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Password: $password\n";
echo "Hash: $hash\n";
PHPEOF

php /tmp/generate-admin-hash.php

echo ""
echo "Step 4: Inserting admin user into database..."
echo "Enter MySQL root password when prompted:"
echo ""

# Get the hash
HASH=$(php -r "echo password_hash('admin123', PASSWORD_DEFAULT);")

mysql -u root -p elektr_ame << EOF
-- Delete existing admin if exists (for fresh setup)
DELETE FROM admin_users WHERE email = 'admin@elektr-ame.com';

-- Insert new admin user
INSERT INTO admin_users (email, password_hash, name, role, is_active) VALUES 
('admin@elektr-ame.com', '$HASH', 'Local Admin', 'superadmin', 1);
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Admin user created successfully!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 LOCAL ADMIN CREDENTIALS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 URL: http://localhost:8080/admin"
    echo "📧 Email: admin@elektr-ame.com"
    echo "🔑 Password: admin123"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "⚠️  This is for LOCAL DEVELOPMENT ONLY!"
    echo "   Never use these credentials in production!"
    echo ""
else
    echo ""
    echo "❌ Failed to create admin user"
    echo "   You may need to run this manually:"
    echo ""
    echo "   mysql -u root -p elektr_ame"
    echo "   Then run the SQL from database/admin-users.sql"
    echo ""
fi

# Cleanup
rm -f /tmp/generate-admin-hash.php

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure PHP server is running: php -S localhost:8000"
echo "2. Make sure React dev server is running: npm run dev"
echo "3. Visit: http://localhost:8080/admin"
echo "4. Login with the credentials above"


