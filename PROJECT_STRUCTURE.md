# Elektr-Âme Website - Project Structure

## 📁 Repository Organization

### **Core Development Files**
- **`src/`** - React/TypeScript source code
  - `components/` - Reusable UI components
  - `pages/` - Main application pages
  - `hooks/` - Custom React hooks
  - `contexts/` - React context providers
  - `types/` - TypeScript type definitions
- **`api/`** - PHP backend API endpoints (development)
- **`public/`** - Static assets and uploaded media
- **`database/`** - SQL migration scripts and schema

### **Configuration**
- **`package.json`** - Node.js dependencies
- **`vite.config.ts`** - Vite build configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript configuration

### **Build & Deployment**
- **`dist/`** - Build output (generated, not committed to git)
- **`deployment/`** - Ready-to-deploy files for OVH hosting
  - Contains latest built assets
  - Production-ready API files
  - All necessary configuration
  - Documentation: `FINAL_DEPLOYMENT_STEPS.md` and `FINAL_SUMMARY_AND_STEPS.md`

---

## 🚀 Quick Start for Collaborators

### **1. Setup Local Environment**
```bash
npm install
```

### **2. Configure Database**
- Copy `api/config-template.php` to `api/config.php`
- Update with your local database credentials
- Run SQL scripts from `database/` folder

### **3. Start Development Server**
```bash
npm run dev
```
Server runs at `http://localhost:8080`

### **4. Build for Production**
```bash
npm run build
```
Output goes to `dist/` folder

---

## 📂 Key Directories Explained

| Directory | Purpose | Notes |
|-----------|---------|-------|
| `src/` | Frontend React app | Main development work happens here |
| `api/` | Backend PHP endpoints | RESTful API for data operations |
| `database/` | SQL migrations | Run these in order on new databases |
| `deployment/` | Production files | Ready to upload to OVH server |
| `public/` | Static assets | Images, icons, uploaded media |
| `dist/` | Build output | Auto-generated, excluded from git |

---

## 🎨 Technology Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Backend:** PHP 8.4 + MySQL
- **Hosting:** OVH Shared Hosting
- **Features:**
  - Multi-language support (EN/ES/CA)
  - Admin portal with authentication
  - Event management
  - Artist profiles with galleries
  - Member portal
  - Newsletter system
  - Email automation

---

## 🔧 Development Workflow

1. **Make changes** in `src/` or `api/`
2. **Test locally** at `http://localhost:8080`
3. **Build** with `npm run build`
4. **Deploy** files from `dist/` to OVH server
5. **API files** upload from `api/` to server

---

## 📋 Deployment Notes

The `deployment/` folder contains:
- Latest production build
- Sample uploaded media
- Configuration templates
- Deployment documentation

See `deployment/FINAL_DEPLOYMENT_STEPS.md` for complete deployment guide.

---

## 🤝 Contributing

When adding new features:
1. Create feature branch
2. Make changes in `src/` and/or `api/`
3. Test thoroughly locally
4. Build and verify in `dist/`
5. Create pull request
6. After merge, deploy to production

---

## 📧 Contact

For questions or issues, contact the Elektr-Âme team.

