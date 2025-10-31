#!/bin/bash

# 🎵 Prepare Elekr-Âme Files for GitHub Deployment
# This script creates a clean package ready for GitHub

echo "🎵 Preparing Elekr-Âme files for GitHub deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Create a clean directory structure
print_status "Creating clean directory structure..."

# Create the main directory
mkdir -p elekr-ame-github-package

# Copy all necessary files maintaining structure
print_status "Copying files..."

# Copy GitHub Actions
mkdir -p elekr-ame-github-package/.github/workflows
cp .github/workflows/deploy.yml elekr-ame-github-package/.github/workflows/

# Copy API files
mkdir -p elekr-ame-github-package/api
cp api/*.php elekr-ame-github-package/api/

# Copy database schemas
mkdir -p elekr-ame-github-package/database
cp database/*.sql elekr-ame-github-package/database/

# Copy React components
mkdir -p elekr-ame-github-package/src/components
cp src/components/*.jsx elekr-ame-github-package/src/components/

# Copy documentation
cp *.md elekr-ame-github-package/

# Create a README for the package
cat > elekr-ame-github-package/README.md << 'EOF'
# 🎵 Elekr-Âme Gallery & Artist Images

This package contains the complete implementation of Gallery and Artist Images functionality for the Elekr-Âme website.

## 🚀 Quick Setup

1. **Copy all files** to your Elekr-Âme repository
2. **Set up GitHub Secrets** (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
3. **Run database schemas** on your server
4. **Push to GitHub** - deployment will happen automatically!

## 📁 What's Included

- ✅ Gallery functionality with multiple image uploads
- ✅ Artist images with categories and profile pictures
- ✅ GitHub Actions for automated deployment
- ✅ Complete API endpoints
- ✅ React components for frontend
- ✅ Database schemas
- ✅ Complete documentation

## 🎯 Features

### Gallery
- Multiple image uploads (drag & drop)
- Categories: Events, Artists, Venue, Community, Other
- Search and filter functionality
- Grid/List view toggle
- Bulk operations
- Admin management

### Artist Images
- Multiple images per artist
- Categories: Profile, Stage, Studio, Fans, Behind Scenes, Other
- Profile picture management
- Image descriptions
- Admin upload/delete

## 📖 Documentation

- `COMPLETE_IMPLEMENTATION_GUIDE.md` - Full setup guide
- `GITHUB_DEPLOYMENT_PACKAGE.md` - Deployment instructions
- `ARTIST_IMAGES_IMPLEMENTATION.md` - Artist images guide

## 🔧 Usage

```jsx
// Gallery component
import Gallery from './components/Gallery';
<Gallery isAdmin={false} />

// Artist profile component
import ArtistProfile from './components/ArtistProfile';
<ArtistProfile artistId={artist.id} artistName={artist.name} isAdmin={false} />
```

Ready to deploy! 🎵
EOF

print_success "Package created successfully!"

# Show the structure
print_status "Package structure:"
tree elekr-ame-github-package/ 2>/dev/null || find elekr-ame-github-package/ -type f | sort

print_success "🎉 Package ready for GitHub!"
echo ""
print_status "Next steps:"
echo "1. Copy the 'elekr-ame-github-package' folder to your other laptop"
echo "2. Clone your GitHub repository on that laptop"
echo "3. Copy all files from the package to your repository"
echo "4. Set up GitHub Secrets in your repository settings"
echo "5. Commit and push to GitHub"
echo "6. Run the database schemas on your server"
echo ""
print_status "The GitHub Actions will automatically deploy everything!"
