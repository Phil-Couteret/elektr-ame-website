# Elektr-Âme Website Deployment Guide

This guide will help you deploy your Elektr-Âme website to make it live on the internet.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

**For React Frontend Only:**
1. **Prepare your code:**
   ```bash
   # Build the React app
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite + React
   - Click "Deploy"

3. **Configure environment:**
   - In Vercel dashboard, go to your project
   - Go to Settings > Environment Variables
   - Add any needed environment variables

**Result:** Your site will be live at `https://your-project-name.vercel.app`

### Option 2: Netlify (Also Free & Easy)

**For React Frontend Only:**
1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

**Result:** Your site will be live at `https://random-name.netlify.app`

### Option 3: Traditional Web Hosting (Full Stack with PHP)

**For React + PHP Backend:**

**Recommended Hosts:**
- **Hostinger** (~$2-4/month) - Great for PHP
- **SiteGround** (~$4-7/month) - Reliable
- **DigitalOcean** (~$5/month) - More control
- **AWS** (Pay as you go) - Scalable

**Steps:**
1. **Prepare files:**
   ```bash
   # Build React app
   npm run build
   
   # Your files to upload:
   # - dist/ folder (React build)
   # - api/ folder (PHP backend)
   # - database/ folder (SQL schema)
   ```

2. **Upload to hosting:**
   - Upload `dist/` contents to `public_html/`
   - Upload `api/` folder to `public_html/api/`
   - Set up MySQL database using `database/schema.sql`

3. **Configure:**
   - Update `api/config.php` with your database credentials
   - Test the API endpoints

## 🔧 Pre-Deployment Checklist

### 1. Build Your React App
```bash
cd "/Users/philippe.couteret@iqvia.com/Dev .NET/Elektr-ame/elektr-ame-website"
npm run build
```

### 2. Test Your Build Locally
```bash
# Test the built version
npm run preview
```

### 3. Update API Endpoints (if using PHP backend)
If you're deploying the PHP backend separately, update the API URL in your React app:

```typescript
// In your React components, update the fetch URL
const response = await fetch('https://your-domain.com/api/join-us.php', {
  // ... rest of your code
});
```

### 4. Environment Variables
Create a `.env` file for production:
```env
VITE_API_URL=https://your-domain.com/api
VITE_SITE_URL=https://your-domain.com
```

## 📁 File Structure for Deployment

```
your-website/
├── dist/                    # React build (upload to web root)
│   ├── index.html
│   ├── assets/
│   └── ...
├── api/                     # PHP backend (if using traditional hosting)
│   ├── join-us.php
│   ├── config.php
│   └── ...
├── database/                # Database schema
│   └── schema.sql
└── DEPLOYMENT.md           # This file
```

## 🌐 Domain Setup (Optional)

### Custom Domain
1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Point to your hosting:**
   - For Vercel: Add domain in Vercel dashboard
   - For Netlify: Add domain in Netlify dashboard
   - For traditional hosting: Update DNS records

### SSL Certificate
- **Vercel/Netlify:** Automatic HTTPS
- **Traditional hosting:** Most hosts provide free SSL

## 🚨 Important Notes

### For Vercel/Netlify (Frontend Only)
- Your PHP backend won't work on these platforms
- You'll need to either:
  1. Use a separate PHP hosting for the backend
  2. Convert to a serverless function
  3. Use a different backend service

### For Traditional Hosting (Full Stack)
- Make sure your host supports PHP 8.4
- Ensure MySQL database is available
- Test the PHP API endpoints after deployment

## 🔍 Testing Your Live Site

1. **Check all pages load correctly**
2. **Test language switching**
3. **Test the Join Us form** (if using PHP backend)
4. **Test responsive design on mobile**
5. **Check all links and navigation**

## 📞 Need Help?

If you run into issues:
1. Check the browser console for errors
2. Check your hosting provider's error logs
3. Test locally first with `npm run preview`
4. Make sure all file paths are correct

## 🎉 Success!

Once deployed, your Elektr-Âme website will be live and accessible to the world!

**Next Steps:**
- Share your live URL
- Set up analytics (Google Analytics)
- Consider SEO optimization
- Set up monitoring and backups

