# Icon Fixes - Deployment Instructions

## What Was Fixed
- ✅ Corrected Linktree icon (was using wrong SVG)
- ✅ Added missing icons for: Spotify, Beatport, Resident Advisor, Facebook, Twitter/X, YouTube, TikTok
- ✅ All 10 social/music platforms now display correctly in artist profiles

## Files Changed (Frontend Only)
- `src/components/ArtistSection.tsx`

## Files to Deploy
After running `npm run build`, only these files need to be uploaded:

### Option 1: Upload Only Changed Files
```
dist/index.html
dist/assets/index-CWyzCZ9C.js  (the new JavaScript bundle)
dist/assets/index-J9OdsC4-.css  (the new CSS bundle)
```

### Option 2: Upload Entire dist/ Folder (Safer)
```
dist/
├── index.html
├── assets/
│   ├── index-CWyzCZ9C.js
│   ├── index-J9OdsC4-.css
│   └── html2canvas.esm-CBrSDip1.js
├── favicon.ico
├── placeholder.svg
├── robots.txt
└── lovable-uploads/ (or elektr-ame-media/ if renamed)
```

## Deployment Steps

### Step 1: Build (Already Done ✅)
```bash
npm run build
```
Output files are in `dist/` folder.

### Step 2: Create Deployment Package
You can create a ZIP file to share with whoever has FTP access:

```bash
cd dist
zip -r elektr-ame-icons-update.zip .
```

Or manually:
1. Navigate to `dist/` folder
2. Select all contents
3. Create ZIP file named `elektr-ame-icons-update.zip`

### Step 3: Provide to Admin with FTP Access

**Files to upload:**
- Upload **entire contents** of `dist/` folder to `~/www/` on OVH server
- Overwrite existing files

**Important:** After upload, users need to **hard refresh** their browsers:
- **Chrome/Firefox**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- **Safari**: `Cmd + Option + R`

## Verification

After deployment, verify the fix:
1. Go to https://www.elektr-ame.com
2. Scroll to "Artists" section
3. Check that all social/music icons display correctly
4. Click icons to ensure links work

## Who Can Deploy This?

Since you don't have FTP/database access, you need someone with:
- ✅ FTP access to OVH server
- ❌ NO database access needed (frontend-only change)
- ❌ NO backend PHP changes needed

## Alternative: GitHub Actions (Future Setup)

If you want to automate deployments in the future, you could set up:
1. GitHub Actions workflow
2. Automatic FTP upload on push to main
3. No manual FTP needed

Would you like me to create this automation?

