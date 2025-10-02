#!/bin/bash

# Elektr-Âme OVH Deployment Script
echo "🚀 Deploying Elektr-Âme to OVH..."
echo "=================================="

# Build the React app
echo "📦 Building React app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if lftp is installed
    if command -v lftp &> /dev/null; then
        echo "🌐 Uploading to OVH via LFTP..."
        
        # Create upload script
        cat > upload_script.txt << EOF
set ftp:ssl-allow no
set ftp:ssl-protect-data no
open ftp://$OVH_FTP_USERNAME:$OVH_FTP_PASSWORD@$OVH_FTP_SERVER
cd www
mirror -R dist/ ./
mirror -R api/ ./api/
mirror -R database/ ./database/
put .htaccess
quit
EOF
        
        # Execute upload
        lftp -f upload_script.txt
        
        if [ $? -eq 0 ]; then
            echo "✅ Upload successful!"
            echo "🌐 Your website should be live at your domain!"
        else
            echo "❌ Upload failed. Please check your FTP credentials."
        fi
        
        # Clean up
        rm upload_script.txt
        
    else
        echo "⚠️  LFTP not found. Please install it or use manual FTP upload."
        echo "📁 Your built files are in the 'dist' folder"
        echo "📁 Upload the 'ovh-deployment' folder contents to your OVH hosting"
    fi
    
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

