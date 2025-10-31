# 🎵 GitHub Deployment Package - Elekr-Âme

This package contains everything you need to implement Gallery and Artist Images functionality in your Elekr-Âme repository.

## 📦 What's Included

### ✅ Complete File Structure
```
elekr-ame-website/
├── .github/workflows/
│   └── deploy.yml                          # GitHub Actions deployment
├── api/
│   ├── upload-gallery-images.php          # Gallery image uploads
│   ├── get-gallery-images.php             # Retrieve gallery images
│   ├── delete-gallery-image.php           # Delete gallery images
│   ├── upload-artist-images.php           # Artist image uploads
│   ├── get-artist-images.php              # Retrieve artist images
│   └── delete-artist-image.php            # Delete artist images
├── database/
│   ├── gallery_images_schema.sql          # Gallery database schema
│   └── artist_images_schema.sql           # Artist images database schema
├── src/components/
│   ├── Gallery.jsx                        # Main gallery component
│   ├── MultiImageUpload.jsx               # Multi-image upload component
│   ├── ArtistImageUpload.jsx              # Artist-specific upload component
│   └── ArtistProfile.jsx                  # Enhanced artist profile
└── Documentation files
```

## 🚀 Quick Deployment Steps

### Step 1: Clone Your Repository
```bash
git clone https://github.com/Phil-Couteret/elekr-ame-website.git
cd elekr-ame-website
```

### Step 2: Copy All Files
Copy all the files from this package into your repository maintaining the same structure.

### Step 3: Set Up GitHub Secrets
Go to your repository on GitHub:
1. Click **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `FTP_SERVER` - Your FTP server address
   - `FTP_USERNAME` - Your FTP username
   - `FTP_PASSWORD` - Your FTP password
   - `FTP_SERVER_DIR` - Directory path (optional, defaults to '/')

### Step 4: Commit and Push
```bash
git add .
git commit -m "Add Gallery and Artist Images functionality with GitHub Actions"
git push origin main
```

### Step 5: Set Up Database
Run these SQL commands on your server:
```sql
-- Gallery images table
source database/gallery_images_schema.sql

-- Artist images table  
source database/artist_images_schema.sql
```

## 🎯 Features Implemented

### Gallery Features
- Multiple image uploads (drag & drop)
- Image categories (Events, Artists, Venue, Community, Other)
- Search functionality
- Grid/List view toggle
- Bulk operations (select multiple, delete)
- Admin management interface

### Artist Images Features
- Multiple images per artist
- Categories (Profile, Stage, Studio, Fans, Behind Scenes, Other)
- Profile picture management
- Image descriptions
- Admin upload/delete interface

### GitHub Actions
- Automated FTP deployment
- Builds React frontend
- Packages PHP backend
- Deploys everything to your server

## 🔧 Usage Examples

### Gallery Component
```jsx
import Gallery from './components/Gallery';

// Public gallery
<Gallery isAdmin={false} />

// Admin gallery management
<Gallery isAdmin={true} />
```

### Artist Profile Component
```jsx
import ArtistProfile from './components/ArtistProfile';

// Artist page
<ArtistProfile 
  artistId={artist.id} 
  artistName={artist.name} 
  isAdmin={false} 
/>

// Admin artist management
<ArtistProfile 
  artistId={artist.id} 
  artistName={artist.name} 
  isAdmin={true} 
/>
```

## 📱 API Endpoints

### Gallery APIs
- `POST /api/upload-gallery-images.php` - Upload multiple images
- `GET /api/get-gallery-images.php` - Get images with search/filter
- `POST /api/delete-gallery-image.php` - Delete images

### Artist Image APIs
- `POST /api/upload-artist-images.php` - Upload artist images
- `GET /api/get-artist-images.php` - Get artist images
- `POST /api/delete-artist-image.php` - Delete artist images

## 🗄️ Database Tables

### gallery_images
- Stores general gallery images
- Categories: events, artists, venue, community, other
- Includes thumbnails and metadata

### artist_images
- Stores artist-specific images
- Categories: profile, stage, studio, fans, behind_scenes, other
- Profile picture management
- Linked to artists table

## 🔒 Security Features

- File type validation (images only)
- File size limits (5MB max)
- SQL injection protection
- XSS protection
- Admin-only upload/delete operations

## 📊 Performance Features

- Automatic thumbnail generation
- Image optimization
- Pagination support
- Lazy loading ready
- CDN compatible

## 🐛 Troubleshooting

### Common Issues
1. **Upload fails** - Check PHP file upload limits
2. **Images not displaying** - Verify file paths and permissions
3. **Thumbnails not generating** - Check GD extension is enabled
4. **Deployment fails** - Verify GitHub Secrets are set correctly

### Debug Mode
Add to PHP files for debugging:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📞 Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Check PHP error logs
3. Verify database connections
4. Test API endpoints directly
5. Check file permissions

## 🎉 Ready to Deploy!

This package contains everything you need. Simply copy the files to your repository, set up the GitHub Secrets, and push to deploy automatically!

---

**Built with ❤️ for the Elekr-Âme community**
