#!/bin/bash

# Script to create the elektr_ame database
# Usage: ./create-database.sh

echo "🗄️  Creating elektr_ame database..."
echo ""
echo "You'll be prompted for your MySQL root password."
echo ""

mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS elektr_ame CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES LIKE 'elektr_ame';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database 'elektr_ame' created successfully!"
    echo ""
    echo "Next step: Import the schema"
    echo "  mysql -u root -p elektr_ame < database/schema.sql"
else
    echo ""
    echo "❌ Failed to create database. Please check your MySQL credentials."
fi

