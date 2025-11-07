# ⚡ Quick Deployment Reference

## 🏠 Local Development

**Database Config:** `api/config.php` (uses `localhost`)

**Start Servers:**
```bash
./start-local.sh
```

**Access:**
- Frontend: http://localhost:8080
- Admin: http://localhost:8080/admin
- API: http://localhost:8000/api

---

## 🌐 OVH Production Deployment

### 1. Database Configuration

**OVH Credentials:**
- Host: `elektry2025.mysql.db`
- Database: `elektry2025`
- Username: `elektry2025`
- Password: (from OVH control panel)

**Create `api/config.php` on OVH:**
```bash
# On OVH server
cp api/config-ovh-template.php api/config.php
# Edit with OVH password
```

### 2. Deploy Code

**Option A: GitHub Actions (Auto)**
```bash
npm run build
git add .
git commit -m "Deploy"
git push
# Manually upload api/config.php via FTP
```

**Option B: Manual FTP**
```bash
npm run build
# Upload dist/ to www/
# Upload api/* to www/api/
# Manually upload api/config.php
```

### 3. Database Setup

1. Import via phpMyAdmin:
   - `database/schema.sql`
   - `database/gallery_images_schema.sql`
   - `database/artist_images_schema.sql`
   - `database/admin-users.sql`

2. Create admin user (see `OVH_DEPLOYMENT_GUIDE.md`)

### 4. Verify

- ✅ `https://www.elektr-ame.com/api/events-list.php`
- ✅ `https://www.elektr-ame.com/admin`
- ✅ Gallery upload works
- ✅ Images display correctly

---

## 🔑 Key Files

| File | Local | OVH | In Git? |
|------|-------|-----|---------|
| `api/config.php` | localhost | elektry2025.mysql.db | ❌ NO |
| `api/config-helper.php` | Auto-detects | Auto-detects | ✅ YES |
| `api/config-ovh-template.php` | Template | Template | ✅ YES |

---

## ⚠️ Important Notes

1. **`config.php` is NEVER in git** - manually upload to OVH
2. **Environment is auto-detected** - no manual switching
3. **CORS is environment-aware** - works in both local and production
4. **File paths are environment-aware** - uploads work in both

---

## 📚 Full Documentation

- **Local Setup:** `LOCAL_SETUP_GUIDE.md`
- **OVH Deployment:** `OVH_DEPLOYMENT_GUIDE.md`
- **Environment Config:** `ENVIRONMENT_SETUP.md`

