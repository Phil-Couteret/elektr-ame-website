# 🤖 GitHub Actions Automatic Build Guide

GitHub Actions will now **automatically build** your project every time you push code!

---

## 🎯 How It Works

Every time you push to the `main` branch, GitHub will:
1. ✅ Checkout your code
2. ✅ Install dependencies
3. ✅ Build the production bundle
4. ✅ Create a downloadable deployment package
5. ✅ Store it for 30 days

---

## 📥 How to Download Built Files

### **Method 1: From GitHub Website**

1. **Go to your repository on GitHub:**
   `https://github.com/YOUR_USERNAME/elektr-ame-website`

2. **Click on "Actions" tab** (top menu)

3. **Click on the latest "Build React App" workflow**
   - You'll see a list of builds
   - The top one is the most recent
   - Green checkmark ✅ = successful build

4. **Scroll down to "Artifacts" section**

5. **Download:**
   - `elektr-ame-deployment-package-XXXXX.zip` (complete package)
   - OR `elektr-ame-dist-XXXXX` (just the frontend)
   - OR `elektr-ame-api-XXXXX` (just the API)

6. **Extract and upload to OVH via iPad**

---

### **Method 2: Manual Trigger**

You can manually trigger a build anytime:

1. Go to **Actions** tab on GitHub
2. Click **"Build React App"** workflow (left sidebar)
3. Click **"Run workflow"** button (right side)
4. Select branch: `main`
5. Click **"Run workflow"**
6. Wait 2-3 minutes for build to complete
7. Download the artifacts

---

## 📋 What's in the Deployment Package?

The `elektr-ame-deployment-package.zip` contains:
```
elektr-ame-deployment.zip
├── index.html
├── favicon.ico
├── assets/
│   ├── index-*.js
│   └── index-*.css
├── lovable-uploads/
├── api/
│   ├── auth-login.php
│   ├── auth-logout.php
│   ├── auth-check.php
│   └── ... (all API files)
└── database/
    └── schema.sql
```

**Upload to OVH:**
- Extract the zip
- Upload everything to `www/` folder
- Overwrite existing files

---

## 🔄 Typical Workflow

### **When You Make Changes:**

**On Cursor Machine (or any machine with Git):**
```bash
# 1. Make your code changes
# 2. Commit and push
git add .
git commit -m "Your changes description"
git push origin main

# 3. GitHub Actions automatically builds (2-3 minutes)
# 4. Download from GitHub Actions
# 5. Upload to OVH via iPad
```

---

## ✅ Current Status

After this push, GitHub Actions is:
- ✅ **Active** - Will build on every push
- ✅ **Ready** - You can trigger manually right now
- ✅ **Free** - GitHub provides free build minutes

---

## 🎉 Next Steps

1. **Go to GitHub → Actions tab**
2. **Watch the first build complete** (should be running now!)
3. **Download the deployment package**
4. **Upload to OVH**
5. **Test login with tech@elektr-ame.com**

---

## 💡 Tips

- **Build takes 2-3 minutes** - GitHub will email you when done
- **Artifacts expire after 30 days** - Download and deploy promptly
- **Multiple builds available** - You can download any previous build
- **Manual trigger** - Use "Run workflow" button anytime

---

## 🐛 Troubleshooting

**Build fails?**
- Check the "Actions" tab for error logs
- Usually means a dependency issue or code error

**Can't find artifacts?**
- Make sure the build finished successfully (green checkmark)
- Scroll down to "Artifacts" section at the bottom

**Wrong files in package?**
- Make sure you pushed all changes to Git
- Trigger a new manual build

---

**Your first build should be running RIGHT NOW!** 🎉

Go check: `https://github.com/YOUR_USERNAME/elektr-ame-website/actions`

