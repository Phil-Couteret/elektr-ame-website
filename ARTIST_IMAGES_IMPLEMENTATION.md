# 🎵 Artist Images Implementation Guide

This guide explains how to implement multiple artist images functionality for the Elekr-Âme website.

## 🚀 Features Implemented

- ✅ **Multiple image uploads** - Upload several images at once
- ✅ **Image categories** - Profile, Stage, Studio, Fans, Behind Scenes, Other
- ✅ **Profile picture management** - Set one image as profile picture
- ✅ **Image descriptions** - Add descriptions to each image
- ✅ **Automatic thumbnails** - Generate thumbnails automatically
- ✅ **Admin management** - Upload and delete images
- ✅ **Public gallery** - Display images by category
- ✅ **GitHub Actions** - Automated deployment

## 📁 Files Created

### React Components
- `src/components/ArtistImageUpload.jsx` - Multi-image upload component
- `src/components/ArtistProfile.jsx` - Enhanced artist profile with image gallery

### PHP API Endpoints
- `api/upload-artist-images.php` - Handle multiple image uploads
- `api/get-artist-images.php` - Retrieve artist images
- `api/delete-artist-image.php` - Delete specific images

### Database
- `database/artist_images_schema.sql` - Database schema for artist images

### GitHub Actions
- `.github/workflows/deploy.yml` - Automated deployment workflow

## 🗄️ Database Setup

1. **Run the database schema:**
   ```sql
   -- Execute the SQL file
   source database/artist_images_schema.sql
   ```

2. **Verify the table was created:**
   ```sql
   DESCRIBE artist_images;
   ```

## 🔧 Frontend Integration

### 1. Import the Components

Add to your artist page or admin panel:

```jsx
import ArtistProfile from '../components/ArtistProfile';
import ArtistImageUpload from '../components/ArtistImageUpload';
```

### 2. Use the ArtistProfile Component

```jsx
// For public artist pages
<ArtistProfile 
  artistId={artist.id} 
  artistName={artist.name} 
  isAdmin={false} 
/>

// For admin panels
<ArtistProfile 
  artistId={artist.id} 
  artistName={artist.name} 
  isAdmin={true} 
/>
```

### 3. Use the Upload Component (Admin Only)

```jsx
<ArtistImageUpload 
  artistId={artistId} 
  onImagesUploaded={() => {
    // Refresh the gallery or show success message
    console.log('Images uploaded successfully!');
  }} 
/>
```

## 🎨 Image Categories

The system supports these categories:

- **Profile** - Main profile pictures
- **Stage** - Live performances
- **Studio** - Recording sessions
- **Fans** - With fans/audience
- **Behind Scenes** - Behind the scenes content
- **Other** - Miscellaneous images

## 📱 Usage Examples

### For Artists (Public View)
```jsx
// Display artist's image gallery
<ArtistProfile 
  artistId="123" 
  artistName="DJ Example" 
  isAdmin={false} 
/>
```

### For Admins (Management View)
```jsx
// Full management interface
<ArtistProfile 
  artistId="123" 
  artistName="DJ Example" 
  isAdmin={true} 
/>
```

## 🔐 API Endpoints

### Upload Images
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

### Get Images
```
GET /api/get-artist-images.php?artist_id=123&category=stage&limit=10&offset=0
```

### Delete Image
```
POST /api/delete-artist-image.php
Content-Type: application/json

{
  "image_id": 456
}
```

## 🚀 GitHub Actions Setup

1. **Copy the workflow file** to your repository:
   ```bash
   cp .github/workflows/deploy.yml /path/to/your/repo/.github/workflows/
   ```

2. **Set up GitHub Secrets:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add these secrets:
     - `FTP_SERVER` - Your FTP server address
     - `FTP_USERNAME` - Your FTP username
     - `FTP_PASSWORD` - Your FTP password
     - `FTP_SERVER_DIR` - Directory path (optional)

3. **Push to trigger deployment:**
   ```bash
   git add .
   git commit -m "Add artist images functionality"
   git push origin main
   ```

## 📁 Directory Structure

After implementation, your project should have:

```
elekr-ame-website/
├── .github/workflows/
│   └── deploy.yml
├── api/
│   ├── upload-artist-images.php
│   ├── get-artist-images.php
│   └── delete-artist-image.php
├── database/
│   └── artist_images_schema.sql
├── public/
│   └── artist-images/
│       ├── [uploaded images]
│       └── thumbnails/
│           └── [thumbnail images]
└── src/components/
    ├── ArtistImageUpload.jsx
    └── ArtistProfile.jsx
```

## 🔧 Configuration

### PHP Configuration
Make sure your PHP configuration allows:
- File uploads: `file_uploads = On`
- Max file size: `upload_max_filesize = 5M`
- Max post size: `post_max_size = 10M`

### Directory Permissions
```bash
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
   - Check if files exist in public/artist-images/
   - Clear browser cache

3. **Thumbnails not generating:**
   - Check if GD extension is enabled
   - Verify thumbnail directory permissions

### Debug Mode
Add this to your PHP files for debugging:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📊 Performance Considerations

- **Image optimization:** Consider compressing images before upload
- **Lazy loading:** Implement lazy loading for large galleries
- **Pagination:** Use the limit/offset parameters for large image sets
- **CDN:** Consider using a CDN for image delivery

## 🔒 Security Notes

- **File validation:** Only allow image file types
- **File size limits:** Enforce reasonable file size limits
- **Access control:** Ensure only admins can upload/delete images
- **SQL injection:** Use prepared statements (already implemented)

## 🎯 Next Steps

1. **Test the functionality** with sample data
2. **Customize the UI** to match your design
3. **Add image editing** features if needed
4. **Implement image optimization** for better performance
5. **Add image metadata** like EXIF data extraction

## 📞 Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the PHP error logs
3. Verify database connections
4. Test API endpoints directly

---

**Built with ❤️ for the Elekr-Âme community**
