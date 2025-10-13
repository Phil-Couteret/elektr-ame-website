#!/bin/bash

echo "🚀 Creating Deployment Package for Elektr-Âme"
echo "=============================================="
echo ""

# Clean previous build
echo "1️⃣ Cleaning previous build..."
rm -rf dist/
rm -rf deployment-package/
rm -f elektr-ame-deployment.zip

# Build the project
echo ""
echo "2️⃣ Building project..."
npm run build

# Check if .htaccess is in dist
echo ""
echo "3️⃣ Checking for .htaccess in dist/..."
if [ -f dist/.htaccess ]; then
    echo "   ✅ .htaccess found in dist/"
else
    echo "   ❌ .htaccess NOT found in dist/"
    echo "   Copying manually..."
    cp public/.htaccess dist/.htaccess
    cp public/.htaccess.minimal dist/.htaccess.minimal
fi

# Create deployment package directory
echo ""
echo "4️⃣ Creating deployment package..."
mkdir -p deployment-package

# Copy all files from dist
cp -r dist/* deployment-package/
cp dist/.htaccess deployment-package/.htaccess 2>/dev/null || echo "   ⚠️ Warning: .htaccess not copied"
cp dist/.htaccess.minimal deployment-package/.htaccess.minimal 2>/dev/null || echo "   ⚠️ Warning: .htaccess.minimal not copied"

# Copy API files
mkdir -p deployment-package/api
cp -r api/* deployment-package/api/
rm -f deployment-package/api/config.php  # Never include config.php!

# Copy database files
mkdir -p deployment-package/database
cp -r database/* deployment-package/database/

# Create deployment instructions
cat > deployment-package/DEPLOY_INSTRUCTIONS.txt << 'EOF'
═══════════════════════════════════════════════════════════════
🚀 DEPLOYMENT INSTRUCTIONS
═══════════════════════════════════════════════════════════════

STEP 1: Upload Frontend Files
-------------------------------
Upload everything from the root to: /home/elektry/www/

CRITICAL FILES (MUST UPLOAD):
- .htaccess (HTTPS redirect - REQUIRED for PWA!)
- .htaccess.minimal (backup)
- manifest.json (PWA)
- service-worker.js (PWA)
- index.html
- assets/ folder
- pwa-icons/ folder
- elektr-ame-media/ folder

STEP 2: Upload Backend Files
-------------------------------
Upload api/ folder contents to: /home/elektry/www/api/

⚠️ IMPORTANT: Do NOT upload api/config.php!
Your server already has the correct config.php with database credentials.

STEP 3: Test
--------------
✅ Visit http://www.elektr-ame.com → Should redirect to HTTPS
✅ Padlock 🔒 in address bar
✅ Wait 5 seconds → PWA install prompt appears
✅ DevTools → Console → Service Worker registered
✅ DevTools → Application → Manifest loaded

═══════════════════════════════════════════════════════════════
✅ DEPLOYMENT COMPLETE!
═══════════════════════════════════════════════════════════════
EOF

# Verify .htaccess is in the package
echo ""
echo "5️⃣ Verifying deployment package..."
if [ -f deployment-package/.htaccess ]; then
    echo "   ✅ .htaccess is in deployment package"
else
    echo "   ❌ ERROR: .htaccess is MISSING from deployment package!"
    exit 1
fi

if [ -f deployment-package/.htaccess.minimal ]; then
    echo "   ✅ .htaccess.minimal is in deployment package"
else
    echo "   ⚠️ Warning: .htaccess.minimal is MISSING"
fi

# Create ZIP file
echo ""
echo "6️⃣ Creating ZIP file..."
cd deployment-package
zip -r ../elektr-ame-deployment.zip . -x "*.git*" "*.DS_Store"
cd ..

# Verify ZIP contents
echo ""
echo "7️⃣ Verifying ZIP contents..."
if unzip -l elektr-ame-deployment.zip | grep -q "\.htaccess$"; then
    echo "   ✅ .htaccess IS in the ZIP file!"
else
    echo "   ❌ ERROR: .htaccess is NOT in the ZIP file!"
    exit 1
fi

# Show summary
echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ SUCCESS! Deployment package created!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📦 Package location: elektr-ame-deployment.zip"
echo "📏 Package size: $(du -h elektr-ame-deployment.zip | cut -f1)"
echo ""
echo "📋 Contents:"
ls -la deployment-package/ | head -20
echo ""
echo "🔍 .htaccess files:"
ls -la deployment-package/ | grep htaccess
echo ""
echo "📥 NEXT STEPS:"
echo "1. Extract elektr-ame-deployment.zip"
echo "2. Upload ALL files to /home/elektry/www/ (including .htaccess)"
echo "3. Enable 'Show hidden files' in your FTP client"
echo "4. Test HTTPS redirect"
echo ""
echo "════════════════════════════════════════════════════════════"

