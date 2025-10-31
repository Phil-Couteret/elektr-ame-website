# 🎵 Complete Implementation Guide - Gallery & Artist Images

This guide covers the complete implementation of both **Gallery** and **Artist Images** functionality for the Elekr-Âme website.

## 🚀 Features Implemented

### Gallery Features
- ✅ **Multiple image uploads** - Upload several images at once
- ✅ **Image categories** - Events, Artists, Venue, Community, Other
- ✅ **Search functionality** - Search by filename, description, or alt text
- ✅ **Grid/List views** - Toggle between different display modes
- ✅ **Bulk operations** - Select and delete multiple images
- ✅ **Admin management** - Upload, delete, and manage images
- ✅ **Public gallery** - Display images by category

### Artist Images Features
- ✅ **Multiple image uploads** - Upload several images per artist
- ✅ **Image categories** - Profile, Stage, Studio, Fans, Behind Scenes, Other
- ✅ **Profile picture management** - Set one image as profile picture
- ✅ **Image descriptions** - Add descriptions to each image
- ✅ **Admin management** - Upload and delete images
- ✅ **Public gallery** - Display images by category

## 📁 Complete File Structure

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
├── public/
│   ├── gallery-images/                    # Gallery image storage
│   │   └── thumbnails/                    # Gallery thumbnails
│   └── artist-images/                     # Artist image storage
│       └── thumbnails/                    # Artist thumbnails
└── src/components/
    ├── Gallery.jsx                        # Main gallery component
    ├── MultiImageUpload.jsx               # Multi-image upload component
    ├── ArtistImageUpload.jsx              # Artist-specific upload component
    └── ArtistProfile.jsx                  # Enhanced artist profile
```

## 🗄️ Database Setup

### 1. Run Both Database Schemas

```sql
-- Gallery images table
source database/gallery_images_schema.sql

-- Artist images table  
source database/artist_images_schema.sql
```

### 2. Verify Tables Created

```sql
-- Check gallery table
DESCRIBE gallery_images;

-- Check artist images table
DESCRIBE artist_images;
```

## 🔧 Frontend Integration

### 1. Gallery Component Usage

```jsx
import Gallery from '../components/Gallery';

// For public gallery
<Gallery isAdmin={false} />

// For admin gallery management
<Gallery isAdmin={true} />
```

### 2. Artist Profile Component Usage

```jsx
import ArtistProfile from '../components/ArtistProfile';

// For public artist pages
<ArtistProfile 
  artistId={artist.id} 
  artistName={artist.name} 
  isAdmin={false} 
/>

// For admin artist management
<ArtistProfile 
  artistId={artist.id} 
  artistName={artist.name} 
  isAdmin={true} 
/>
```

### 3. Multi-Image Upload Component

```jsx
import MultiImageUpload from '../components/MultiImageUpload';

// For gallery uploads
<MultiImageUpload onImagesUploaded={handleImagesUploaded} />

// For artist uploads (with artist ID)
<ArtistImageUpload 
  artistId={artistId} 
  onImagesUploaded={handleImagesUploaded} 
/>
```

## 🎨 Image Categories

### Gallery Categories
- **Events** - Electronic music events and parties
- **Artists** - Artist performances and showcases
- **Venue** - Club and venue photos
- **Community** - Community events and gatherings
- **Other** - Miscellaneous images

### Artist Image Categories
- **Profile** - Main profile pictures
- **Stage** - Live performances
- **Studio** - Recording sessions
- **Fans** - With fans/audience
- **Behind Scenes** - Behind the scenes content
- **Other** - Miscellaneous images

## 🔐 API Endpoints

### Gallery APIs

#### Upload Gallery Images
```
POST /api/upload-gallery-images.php
Content-Type: multipart/form-data

Parameters:
- images[0][file]: Image file
- images[0][category]: Image category
- images[0][description]: Image description
```

#### Get Gallery Images
```
GET /api/get-gallery-images.php?search=term&category=events&limit=10&offset=0
```

#### Delete Gallery Image(s)
```
POST /api/delete-gallery-image.php
Content-Type: application/json

// Single image
{ "image_id": 123 }

// Multiple images
{ "image_ids": [123, 456, 789] }
```

### Artist Image APIs

#### Upload Artist Images
```
POST /api/upload-artist-images.php
Content-Type: multipart/form-data

Parameters:
- artist_id: Artist ID
- images[0][file]: Image file
- images[0][category]: Image category
- images[0][description]: Image description
- images[0][is_profile_picture]: 1 or 0
```

#### Get Artist Images
```
GET /api/get-artist-images.php?artist_id=123&category=stage&limit=10&offset=0
```

#### Delete Artist Image
```
POST /api/delete-artist-image.php
Content-Type: application/json

{ "image_id": 456 }
```

## 🚀 GitHub Actions Setup

### 1. Copy Workflow File
The deployment workflow is already in `.github/workflows/deploy.yml`

### 2. Set Up GitHub Secrets
Go to your repository Settings → Secrets and variables → Actions and add:
- `FTP_SERVER` - Your FTP server address
- `FTP_USERNAME` - Your FTP username
- `FTP_PASSWORD` - Your FTP password
- `FTP_SERVER_DIR` - Directory path (optional)

### 3. Deploy
```bash
git add .
git commit -m "Add gallery and artist images functionality"
git push origin main
```

## 📱 Usage Examples

### Gallery Page
```jsx
// Public gallery page
function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Gallery isAdmin={false} />
    </div>
  );
}

// Admin gallery management
function AdminGalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Gallery isAdmin={true} />
    </div>
  );
}
```

### Artist Page
```jsx
// Artist profile page
function ArtistPage({ artist }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>{artist.name}</h1>
      <ArtistProfile 
        artistId={artist.id} 
        artistName={artist.name} 
        isAdmin={false} 
      />
    </div>
  );
}

// Admin artist management
function AdminArtistPage({ artist }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Manage {artist.name}</h1>
      <ArtistProfile 
        artistId={artist.id} 
        artistName={artist.name} 
        isAdmin={true} 
      />
    </div>
  );
}
```

## 🔧 Configuration

### PHP Configuration
Ensure your PHP settings allow:
```ini
file_uploads = On
upload_max_filesize = 5M
post_max_size = 10M
max_file_uploads = 20
```

### Directory Permissions
```bash
chmod 755 public/gallery-images/
chmod 755 public/gallery-images/thumbnails/
chmod 755 public/artist-images/
chmod 755 public/artist-images/thumbnails/
```

## 🐛 Troubleshooting

### Common Issues

1. **Upload fails:**
   - Check PHP file upload limits
   - Verify directory permissions
   - Check database connection

2. **Images not displaying:**
   - Verify file paths are correct
   - Check if files exist in public directories
   - Clear browser cache

3. **Thumbnails not generating:**
   - Check if GD extension is enabled
   - Verify thumbnail directory permissions

### Debug Mode
Add to your PHP files for debugging:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📊 Performance Considerations

- **Image optimization:** Consider compressing images before upload
- **Lazy loading:** Implement lazy loading for large galleries
- **Pagination:** Use limit/offset parameters for large image sets
- **CDN:** Consider using a CDN for image delivery
- **Caching:** Implement browser caching for images

## 🔒 Security Notes

- **File validation:** Only allow image file types
- **File size limits:** Enforce reasonable file size limits
- **Access control:** Ensure only admins can upload/delete images
- **SQL injection:** Use prepared statements (already implemented)
- **XSS protection:** Sanitize user inputs

## 🎯 Next Steps

1. **Test the functionality** with sample data
2. **Customize the UI** to match your design
3. **Add image editing** features if needed
4. **Implement image optimization** for better performance
5. **Add image metadata** like EXIF data extraction
6. **Set up monitoring** for upload success/failure rates

## 📞 Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the PHP error logs
3. Verify database connections
4. Test API endpoints directly
5. Check file permissions

---

**Built with ❤️ for the Elekr-Âme community**

## 🎵 Quick Start Checklist

- [ ] Run database schemas
- [ ] Set up directory permissions
- [ ] Configure PHP settings
- [ ] Test gallery functionality
- [ ] Test artist images functionality
- [ ] Set up GitHub Actions secrets
- [ ] Deploy to production
- [ ] Test on live site
