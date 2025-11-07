# 🎵 Elektr-Âme Website

A modern, multilingual website for Barcelona's vibrant electronic music community.

## 🌟 Features

- **Multilingual Support** - English, Spanish, and Catalan
- **Responsive Design** - Works on all devices
- **Artist Showcase** - Featured artists with bios and social links
- **Events Management** - Upcoming electronic music events
- **Join Us Form** - Community registration with PHP backend
- **Admin Panel** - Content management system
- **Modern UI** - Built with React, TypeScript, and Tailwind CSS

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Hook Form** with Zod validation

### Backend
- **PHP 8.4** for API endpoints
- **MySQL** for data storage
- **PDO** for database operations

## 📦 Installation

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Phil-Couteret/elektr-ame-website.git
   cd elektr-ame-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up database configuration:**
   ```bash
   cp api/config-template.php api/config.php
   # Edit api/config.php with your local MySQL credentials
   ```

4. **Start development servers:**
   ```bash
   ./start-local.sh
   ```

5. **Access the website:**
   - Frontend: http://localhost:8080
   - Admin Panel: http://localhost:8080/admin
   - API: http://localhost:8000/api

**For detailed local setup, see:** [`LOCAL_SETUP_GUIDE.md`](LOCAL_SETUP_GUIDE.md)

## 🌐 Deployment

### OVH Production Deployment

The codebase is **environment-aware** and automatically adapts to local or production.

**Quick Reference:** See [`DEPLOYMENT_QUICK_REFERENCE.md`](DEPLOYMENT_QUICK_REFERENCE.md)

**Full Guide:** See [`OVH_DEPLOYMENT_GUIDE.md`](OVH_DEPLOYMENT_GUIDE.md)

**Key Points:**
- `api/config.php` must be manually uploaded to OVH (not in git)
- Use `api/config-ovh-template.php` as a template
- Environment is auto-detected - no manual switching needed
- CORS and file paths adapt automatically

## 📁 Project Structure

```
elektr-ame-website/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   ├── locales/       # Translation files
│   └── types/         # TypeScript types
├── api/               # PHP backend
├── database/          # Database schema
├── public/            # Static assets
└── dist/              # Built files
```

## 🎨 Design Features

- **Dark Theme** with electric blue accents
- **Gradient Backgrounds** for visual appeal
- **Smooth Animations** and transitions
- **Mobile-First** responsive design
- **Accessibility** compliant components

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Languages
1. Create new locale file in `src/locales/`
2. Add language option to `LanguageContext.tsx`
3. Update `LanguageSelector.tsx`

## 📝 License

This project is created for Elektr-Âme, a musical association based in Barcelona.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Contact

For questions about this project, contact the Elektr-Âme team.

---

**Built with ❤️ for the Barcelona electronic music community**