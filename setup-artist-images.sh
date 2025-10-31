#!/bin/bash

# 🎵 Elekr-Âme Artist Images Setup Script
# This script helps you quickly set up the artist images functionality

echo "🎵 Setting up Elekr-Âme Artist Images functionality..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the root of your Elekr-Âme project"
    exit 1
fi

print_status "Setting up artist images functionality..."

# 1. Create necessary directories
print_status "Creating directories..."
mkdir -p public/artist-images/thumbnails
mkdir -p .github/workflows

print_success "Directories created"

# 2. Set proper permissions
print_status "Setting permissions..."
chmod 755 public/artist-images/
chmod 755 public/artist-images/thumbnails/

print_success "Permissions set"

# 3. Check if database schema needs to be run
print_status "Checking database setup..."
if [ -f "database/artist_images_schema.sql" ]; then
    print_warning "Database schema file found. Please run it manually:"
    echo "  mysql -u your_username -p your_database < database/artist_images_schema.sql"
else
    print_error "Database schema file not found!"
    exit 1
fi

# 4. Check if API files exist
print_status "Checking API files..."
api_files=(
    "api/upload-artist-images.php"
    "api/get-artist-images.php"
    "api/delete-artist-image.php"
)

for file in "${api_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file missing!"
    fi
done

# 5. Check if React components exist
print_status "Checking React components..."
component_files=(
    "src/components/ArtistImageUpload.jsx"
    "src/components/ArtistProfile.jsx"
)

for file in "${component_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file missing!"
    fi
done

# 6. Check GitHub Actions workflow
print_status "Checking GitHub Actions workflow..."
if [ -f ".github/workflows/deploy.yml" ]; then
    print_success "✓ GitHub Actions workflow exists"
else
    print_error "✗ GitHub Actions workflow missing!"
fi

# 7. Test API endpoints (if possible)
print_status "Testing API endpoints..."
if command -v curl &> /dev/null; then
    # Test if the API is accessible
    if curl -s -o /dev/null -w "%{http_code}" http://localhost/api/get-artist-images.php?artist_id=1 2>/dev/null | grep -q "200\|404"; then
        print_success "API endpoints are accessible"
    else
        print_warning "API endpoints may not be accessible (this is normal if server is not running)"
    fi
else
    print_warning "curl not available, skipping API test"
fi

# 8. Summary
echo ""
print_success "Setup complete! 🎉"
echo ""
print_status "Next steps:"
echo "1. Run the database schema: mysql -u username -p database < database/artist_images_schema.sql"
echo "2. Set up GitHub Secrets for deployment:"
echo "   - FTP_SERVER"
echo "   - FTP_USERNAME" 
echo "   - FTP_PASSWORD"
echo "   - FTP_SERVER_DIR (optional)"
echo "3. Test the functionality with sample data"
echo "4. Customize the UI to match your design"
echo ""
print_status "For detailed instructions, see: ARTIST_IMAGES_IMPLEMENTATION.md"
echo ""
print_success "Happy coding! 🎵"
