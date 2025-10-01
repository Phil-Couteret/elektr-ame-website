#!/bin/bash

# OVH Post-Deployment Script
echo "🚀 OVH Post-Deployment Setup"
echo "============================"

# Copy PHP files to root after build
echo "📁 Copying PHP backend files..."
cp -r api/* dist/
cp -r database dist/

# Copy .htaccess for React Router
echo "⚙️  Setting up .htaccess..."
cp ovh-deployment/.htaccess dist/

echo "✅ Post-deployment setup complete!"
echo "🌐 Your website is ready!"
