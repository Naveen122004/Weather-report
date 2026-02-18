# 📋 Setup & Deployment Guide

## 🚀 Quick Setup

### Local Development (Current)

1. **Server is Running**: The HTTP server is already running on `http://localhost:8000`
2. **Access the App**: Open your browser and navigate to `http://localhost:8000`
3. **Try the App**: 
   - Search for any city (e.g., "London", "New York", "Tokyo")
   - Click "📍 Use My Location" to get weather for your current location
   - Toggle "🌙 Dark Mode" to switch themes
   - Click recent searches for quick access

---

## 🌐 Deployment Options

### Option 1: GitHub Pages (Free, Best for Static Sites)

**Steps:**
1. Create a GitHub account (if you don't have one)
2. Create a new repository called `weather-app`
3. Clone the repository locally
4. Copy all files from your weather-app folder into the repository
5. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial weather app commit"
   git push origin main
   ```
6. Go to Settings → Pages
7. Select "Deploy from a branch" and choose `main` branch
8. Your app will be live at `https://<your-username>.github.io/weather-app`

**Pros**: Free, no server needed, fast CDN  
**Cons**: Static hosting only (no backend)

---

### Option 2: Netlify (Free Tier)

**Steps:**
1. Go to [netlify.com](https://www.netlify.com)
2. Sign up with GitHub account
3. Click "New site from Git"
4. Select your GitHub repository
5. Keep default build settings
6. Click "Deploy"
7. Your app will be live at `https://<app-name>.netlify.app`

**Pros**: Very easy, automatic deployments from Git, good free tier  
**Cons**: Requires Git repository

---

### Option 3: Vercel (Free Tier)

**Steps:**
1. Go to [vercel.com](https://www.vercel.com)
2. Sign up with GitHub account
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Click "Deploy"
6. Your app will be live at `https://<project-name>.vercel.app`

**Pros**: Optimized for web apps, great performance, free tier  
**Cons**: Requires Git repository

---

### Option 4: Using File Protocol (Simplest, Limited)

**Steps:**
1. Open `index.html` directly in your browser
2. File path: `C:\Users\Naveen magadum\OneDrive\Desktop\JAVA\weather\index.html`

**Pros**: Simplest, no server needed  
**Cons**: Some features may not work (geolocation, some CORS issues), security limitations

---

### Option 5: Traditional Web Hosting

**Popular Providers:**
- Bluehost
- HostGator
- SiteGround
- GoDaddy

**Steps:**
1. Sign up for a hosting plan
2. Upload files via FTP to `public_html` folder
3. Access at your domain name

**Pros**: Full control, custom domain  
**Cons**: Requires paid hosting, more complex setup

---

## 🔧 Production Considerations

### API Key Security (Important!)

**Current Setup:** API key is hardcoded in `script.js`

**For Production, Use a Backend Proxy:**

Create a simple Node.js backend:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const API_KEY = process.env.WEATHER_API_KEY;

app.get('/api/weather', async (req, res) => {
    const { city } = req.query;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

Then update `script.js`:
```javascript
// Call your backend instead
const response = await fetch(`/api/weather?city=${city}`);
```

---

## 📦 Project Files Overview

| File | Purpose |
|------|---------|
| `index.html` | HTML structure & DOM elements |
| `style.css` | Styling, responsive design, animations |
| `script.js` | JavaScript logic, API calls, event handlers |
| `README.md` | Complete documentation |
| `.gitignore` | Files to ignore in Git |
| `assets/` | Additional resources (images, fonts) |

---

## ✅ Testing Checklist

Before deploying, test:

- [ ] Search by city name works
- [ ] Error message shows for invalid city
- [ ] Geolocation works (grant permission)
- [ ] Dark mode toggles correctly
- [ ] Recent searches save and display
- [ ] Weather card displays all data
- [ ] Mobile responsive (test on different sizes)
- [ ] No console errors (F12 → Console tab)
- [ ] Links work and no CORS issues

---

## 🐛 Troubleshooting

### App doesn't load
- **Solution**: Make sure you're using a web server (not file://)
- **Check**: Open DevTools (F12) → Network tab → Check for errors

### Geolocation not working
- **Solution**: Allow location access when browser asks
- **Check**: Ensure HTTPS (some browsers require it)

### API returns 401 error
- **Solution**: API key may be invalid or expired
- **Action**: Generate new key at openweathermap.org

### Weather card not showing
- **Solution**: Check browser console for JavaScript errors
- **Action**: F12 → Console → Look for red error messages

### Styling looks broken
- **Solution**: Clear browser cache (Ctrl+Shift+Delete)
- **Action**: Hard refresh (Ctrl+F5)

---

## 📊 Performance Tips

1. **Minify CSS & JavaScript** (in production)
2. **Optimize Images** (use WebP format)
3. **Enable Gzip Compression** (on server)
4. **Use CDN** for static assets
5. **Cache API Responses** (reduce API calls)
6. **Lazy Load Images** (for future features)

---

## 🔐 Security Checklist

- [ ] API key moved to environment variables
- [ ] Validate user input
- [ ] Use HTTPS in production
- [ ] Set proper CORS headers
- [ ] Keep dependencies updated
- [ ] Regular security audits

---

## 📞 Support Resources

- **OpenWeatherMap Docs**: https://openweathermap.org/api
- **MDN Web Docs**: https://developer.mozilla.org/
- **GitHub Pages Help**: https://docs.github.com/en/pages
- **Netlify Docs**: https://docs.netlify.com/

---

## 🎉 You're Ready to Deploy!

Choose your preferred platform from the options above and deploy your weather app to the world! 🌍

---

*Last Updated: February 18, 2026*
