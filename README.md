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

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/elektr-ame-website.git
   cd elektr-ame-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Set up PHP backend (optional):**
   ```bash
   php setup-database.php
   php -S localhost:8000
   ```

## 🌐 Deployment

### Quick Deploy (Frontend Only)
- **Vercel**: Connect your GitHub repo to Vercel
- **Netlify**: Connect your GitHub repo to Netlify

### Full Stack Deploy
- Upload `dist/` contents to your web host
- Upload `api/` folder to your PHP-enabled host
- Set up MySQL database using `database/schema.sql`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

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