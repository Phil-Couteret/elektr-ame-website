#!/bin/bash

# OVH Deployment Script
# This script ensures files are copied to the correct location

echo "🚀 OVH Deployment Script"
echo "======================="

# Build the application
echo "📦 Building application..."
npm run build

# Copy built files to root (OVH web root)
echo "📁 Copying files to web root..."

# Copy all dist contents to current directory
cp -r dist/* .

# Copy PHP backend
cp -r api .

# Copy database schema
cp -r database .

# Ensure .htaccess is in place
cp ovh-deployment/.htaccess .htaccess

echo "✅ Deployment complete!"
echo "🌐 Files are now in the web root"

