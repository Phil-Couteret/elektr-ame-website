#!/bin/bash

# Elektr-Âme Deployment Script
echo "🚀 Elektr-Âme Deployment Script"
echo "================================"

# Build the React app
echo "📦 Building React app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Your built files are in the 'dist' folder"
    echo ""
    echo "🌐 Deployment Options:"
    echo "1. Vercel: Upload the 'dist' folder to vercel.com"
    echo "2. Netlify: Upload the 'dist' folder to netlify.com"
    echo "3. Traditional hosting: Upload 'dist' contents to public_html/"
    echo ""
    echo "📋 Files ready for deployment:"
    ls -la dist/
    echo ""
    echo "🎉 Ready to go live!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
