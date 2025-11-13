#!/bin/bash

# GoDaddy Database Setup Script for Elektr-Âme
# This script helps you prepare database setup commands for GoDaddy

echo "=========================================="
echo "Elektr-Âme - GoDaddy Database Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will help you prepare for GoDaddy database setup.${NC}"
echo ""
echo "You'll need to:"
echo "1. Create database in GoDaddy cPanel"
echo "2. Create MySQL user in GoDaddy cPanel"
echo "3. Import SQL schema via phpMyAdmin"
echo ""

# Prompt for database details
read -p "Enter your GoDaddy database name (e.g., username_elektr_ame_db): " DB_NAME
read -p "Enter your GoDaddy MySQL username (e.g., username_elektr_user): " DB_USER
read -p "Enter your GoDaddy database host (usually 'localhost'): " DB_HOST

echo ""
echo -e "${GREEN}=========================================="
echo "Database Configuration Summary"
echo "==========================================${NC}"
echo ""
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Host: $DB_HOST"
echo ""

# Create config file content
CONFIG_CONTENT="<?php
// GoDaddy Database Configuration for Elektr-Âme
// Generated on $(date)

\$host = '$DB_HOST';
\$dbname = '$DB_NAME';
\$username = '$DB_USER';
\$password = 'YOUR_PASSWORD_HERE'; // ⚠️ UPDATE THIS with your actual password

try {
    \$pdo = new PDO(\"mysql:host=\$host;dbname=\$dbname;charset=utf8mb4\", \$username, \$password);
    \$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    \$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    \$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException \$e) {
    error_log(\"Database connection failed: \" . \$e->getMessage());
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>"

# Save config template
CONFIG_FILE="godaddy-config-template.php"
echo "$CONFIG_CONTENT" > "$CONFIG_FILE"

echo -e "${GREEN}Configuration template saved to: $CONFIG_FILE${NC}"
echo ""
echo "Next steps:"
echo "1. Copy $CONFIG_FILE to your server as api/config.php"
echo "2. Update the password in config.php with your actual database password"
echo "3. Set file permissions: chmod 600 config.php"
echo ""
echo "SQL Schema File: database/complete-schema-godaddy.sql"
echo "Import this file via phpMyAdmin in GoDaddy cPanel"
echo ""

# Create a quick reference file
REF_FILE="GODADDY_QUICK_REFERENCE.txt"
cat > "$REF_FILE" << EOF
GoDaddy Database Setup - Quick Reference
==========================================

Database Details:
- Host: $DB_HOST
- Database: $DB_NAME
- Username: $DB_USER
- Password: [Set in GoDaddy cPanel]

Files to Upload:
1. Frontend: Upload all files from dist/ to public_html/
2. Backend: Upload all PHP files from api/ to public_html/api/
3. Config: Create api/config.php using the template

SQL Import:
- File: database/complete-schema-godaddy.sql
- Import via: GoDaddy cPanel > phpMyAdmin > Import

Admin User:
- Create via phpMyAdmin SQL tab
- Use password_hash() to generate password hash
- Insert into admin_users table

Generated: $(date)
EOF

echo -e "${GREEN}Quick reference saved to: $REF_FILE${NC}"
echo ""
echo "=========================================="
echo "Setup preparation complete!"
echo "=========================================="

