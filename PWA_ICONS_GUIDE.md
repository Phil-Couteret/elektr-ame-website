# PWA Icons Guide

## 📱 Required Icons

Your PWA needs app icons in multiple sizes. You need to create a folder `public/pwa-icons/` with the following files:

### Required Sizes:
- `icon-72x72.png` (Android)
- `icon-96x96.png` (Android)
- `icon-128x128.png` (Android)
- `icon-144x144.png` (Windows, Android)
- `icon-152x152.png` (iOS)
- `icon-192x192.png` (Android, Standard)
- `icon-384x384.png` (Android)
- `icon-512x512.png` (Android, Splash Screen)

### Optional (but recommended):
- `screenshot-1.png` (540x720) - Narrow screen showcase
- `screenshot-2.png` (1080x720) - Wide screen showcase

---

## 🎨 How to Generate Icons

### Option 1: Use an Online Tool (EASIEST) ⭐

**Recommended: PWA Asset Generator**
1. Go to: https://www.pwabuilder.com/imageGenerator
2. Upload your logo (preferably 512x512px or larger, square)
3. Click "Generate"
4. Download the ZIP file
5. Extract and copy the icons to `public/pwa-icons/`

**Alternative: Favicon.io**
1. Go to: https://favicon.io/favicon-converter/
2. Upload your logo
3. Download the package
4. Rename and resize as needed

---

### Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Navigate to your project
cd public/pwa-icons

# Starting with your source image (logo.png)
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

---

### Option 3: Use Photoshop / GIMP

1. Open your logo in Photoshop/GIMP
2. For each size:
   - Image → Image Size
   - Set width and height to the required size
   - Export as PNG
   - Save with the appropriate filename

---

## 🖼️ Icon Design Tips

### Best Practices:
✅ **Use your Elektr-Âme logo** (the electric blue logo you already have)  
✅ **Square format** (1:1 aspect ratio)  
✅ **Transparent or solid background**  
✅ **High contrast** (visible on dark and light backgrounds)  
✅ **Simple design** (recognizable at small sizes)  
✅ **Minimum 512x512px source** (scale down, not up)  

### Color Scheme:
- **Primary:** #00D9FF (Electric Blue)
- **Background:** #1a0033 (Deep Purple) or transparent
- **Text/Details:** White (#FFFFFF)

---

## 🚀 Quick Setup

### Using Your Current Logo

You already have a logo at:
```
/Users/philippe.couteret@iqvia.com/Dev .NET/Elektr-ame/elektr-ame-website/public/elektr-ame-media/85e5425f-9e5d-4f41-a064-2e7734dc6c51.png
```

**Steps:**
1. Create the folder:
   ```bash
   mkdir -p public/pwa-icons
   ```

2. Copy your logo as a base:
   ```bash
   cp public/elektr-ame-media/85e5425f-9e5d-4f41-a064-2e7734dc6c51.png public/pwa-icons/source.png
   ```

3. Use one of the methods above to generate all sizes

---

## 🔍 Maskable Icons

For Android adaptive icons, you may want "maskable" versions:
- Add safe zone padding (20% on all sides)
- Important content should be in center 80%
- Tool: https://maskable.app/

---

## ✅ Testing Your Icons

After generating icons:

1. **Check file structure:**
   ```
   public/
   └── pwa-icons/
       ├── icon-72x72.png
       ├── icon-96x96.png
       ├── icon-128x128.png
       ├── icon-144x144.png
       ├── icon-152x152.png
       ├── icon-192x192.png
       ├── icon-384x384.png
       └── icon-512x512.png
   ```

2. **Test in browser:**
   - Build and deploy
   - Open DevTools → Application → Manifest
   - Check that all icons load

3. **Test installation:**
   - Mobile: Install PWA and check home screen icon
   - Desktop: Install and check app list icon

---

## 📱 Screenshots (Optional)

For a richer install experience, add screenshots:

### Narrow (Mobile):
- Size: 540x720px
- Filename: `screenshot-1.png`
- Content: Show member portal or card view

### Wide (Tablet/Desktop):
- Size: 1080x720px
- Filename: `screenshot-2.png`
- Content: Show events page or dashboard

---

## ⚠️ Temporary Workaround

If you want to **deploy now** without custom icons:

1. Use your existing logo for all sizes (it will scale automatically)
2. Later, generate proper sizes for optimal quality

Or skip icons for now - the PWA will still work, just without custom app icons.

---

## 🎯 Priority

**Must Have:**
- icon-192x192.png (Android)
- icon-512x512.png (Android/Splash)

**Nice to Have:**
- All other sizes (for best cross-device support)
- Screenshots (for better install prompt)

---

**Need help?** The PWA will work without icons, but for the best experience, generate them before deployment! 🚀

