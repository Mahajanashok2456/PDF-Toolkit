# Vercel Deployment Guide (Frontend)

## Prerequisites

- Vercel account connected to your GitHub repository
- Backend deployed on Render (see RENDER_DEPLOYMENT.md)

## Environment Variables to Set in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

### Production Environment

```
REACT_APP_API_URL=https://your-render-service.onrender.com
```

### Preview Environment (Optional but Recommended)

```
REACT_APP_API_URL=https://your-render-service.onrender.com
```

**Important:** Replace `your-render-service` with your actual Render service name.

## Build Settings

### Framework Preset

- **Framework:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Root Directory

Leave as `/` (project root)

## Deployment Steps

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Option 2: Using Git Integration

1. Push your code to GitHub
2. Connect repository in Vercel dashboard
3. Vercel will automatically deploy on every push to main/master

## Verify Deployment

After deployment, test these endpoints from your browser console:

```javascript
// Test API connectivity (replace with your Vercel URL)
fetch("https://your-app.vercel.app")
  .then((r) => r.text())
  .then(console.log);

// Verify API calls work
// This should hit your Render backend
console.log("API URL:", process.env.REACT_APP_API_URL);
```

## Post-Deployment Checklist

- [ ] Verify `REACT_APP_API_URL` is set correctly
- [ ] Test merge PDF functionality
- [ ] Test split PDF functionality
- [ ] Test rotate PDF functionality
- [ ] Test remove pages functionality
- [ ] Test extract pages functionality
- [ ] Test organize PDF functionality
- [ ] Test JPG to PDF conversion
- [ ] Test ratings submission
- [ ] Check console for CORS errors (if any, update Render `ALLOWED_ORIGINS`)

## Common Issues

### CORS Errors

If you see CORS errors in the browser console, make sure:

1. Your Render backend has the correct `ALLOWED_ORIGINS` environment variable
2. Include both production and preview URLs: `https://your-app.vercel.app,https://your-app-preview.vercel.app`

### API Not Found (404)

- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check that the Render service is running and accessible

### Build Failures

- Ensure all dependencies are listed in package.json
- Check build logs in Vercel dashboard for specific errors
