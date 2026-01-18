# Complete Deployment Guide: Vercel + Render

This guide walks you through deploying your PDF Toolkit with:

- **Frontend:** Vercel (static React app)
- **Backend:** Render (Node.js API)

## Quick Overview

```
Frontend (Vercel)          Backend (Render)
┌─────────────────┐       ┌──────────────────┐
│  React SPA      │──────▶│  Express API     │
│  (build/)       │       │  + PDF processing│
│                 │       │  + Ratings DB    │
└─────────────────┘       └──────────────────┘
        │                          │
        │                          ├─ MongoDB Atlas
        │                          └─ (Optional - ratings)
        └─ Calls via REACT_APP_API_URL
```

## Prerequisites

- [ ] GitHub account with your code pushed
- [ ] Vercel account (https://vercel.com)
- [ ] Render account (https://render.com)
- [ ] MongoDB Atlas account (optional - for ratings)

## Step 1: Deploy Backend to Render

### 1.1 Create Web Service

1. Go to https://render.com/dashboard
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `pdf-toolkit-backend`
   - **Region:** Choose closest region
   - **Branch:** `master` or `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free (for testing) or Starter ($7/mo)

### 1.2 Set Environment Variables

Click **Advanced** → **Add Environment Variable**:

```
ALLOWED_ORIGINS=http://localhost:3000
NODE_ENV=production
```

> **Note:** We'll update `ALLOWED_ORIGINS` after deploying to Vercel

### 1.3 Optional: Setup MongoDB for Ratings

If you want ratings functionality:

1. Create MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add environment variable in Render:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pdf-toolkit
   ```

### 1.4 Deploy

1. Click **Create Web Service**
2. Wait for build to complete (~2-3 minutes)
3. **Copy your service URL** (e.g., `https://pdf-toolkit-backend.onrender.com`)
4. Test health: `https://your-service.onrender.com/api/health`

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Project

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./` (project root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### 2.2 Set Environment Variables

Before deploying, click **Environment Variables** and add:

```
REACT_APP_API_URL=https://your-render-service.onrender.com
```

**Replace** `your-render-service` with your actual Render URL from Step 1.4

### 2.3 Deploy

1. Click **Deploy**
2. Wait for build (~2-3 minutes)
3. **Copy your deployment URL** (e.g., `https://your-app.vercel.app`)

## Step 3: Update Backend CORS

Now that you have your Vercel URL, update Render:

1. Go back to Render dashboard → Your service
2. **Environment** → Edit `ALLOWED_ORIGINS`
3. Update to include your Vercel domains:
   ```
   https://your-app.vercel.app,https://*.vercel.app
   ```
4. Click **Save Changes**
5. Service will automatically redeploy

## Step 4: Verify Everything Works

### 4.1 Test Backend Health

```bash
curl https://your-render-service.onrender.com/api/health
# Should return: {"status":"OK"}
```

### 4.2 Test Frontend

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Try uploading and merging PDFs
3. Open browser console (F12) - check for errors
4. Verify API calls go to Render (Network tab)

### 4.3 End-to-End Tests

- [ ] Merge PDFs
- [ ] Split PDF
- [ ] Rotate PDF
- [ ] Remove pages
- [ ] Extract pages
- [ ] Organize PDF
- [ ] JPG to PDF conversion
- [ ] Submit rating (if MongoDB configured)

## Troubleshooting

### ❌ CORS Error: "Access-Control-Allow-Origin"

**Fix:** Update `ALLOWED_ORIGINS` in Render to include your Vercel domain

```bash
# In Render Environment Variables
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

### ❌ API Returns 404

**Fix:** Check `REACT_APP_API_URL` in Vercel:

1. Vercel → Settings → Environment Variables
2. Verify URL matches your Render service
3. Redeploy frontend

### ❌ Render Service Keeps Sleeping (Free Tier)

**Solution:**

- Render free tier spins down after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to Starter ($7/mo) for always-on

### ❌ Backend Crashes or Won't Start

**Check Render Logs:**

1. Go to Render dashboard → Your service → Logs
2. Common issues:
   - Missing dependencies: Check `backend/package.json`
   - MongoDB connection failed: Verify `MONGODB_URI`
   - Port already in use: Render sets `PORT` automatically

### ❌ Ratings Don't Work

**If MongoDB not configured:**

- Ratings endpoints will return 503 (Service Unavailable)
- This is expected - app still works without ratings

**If MongoDB is configured but failing:**

- Check `MONGODB_URI` is correct
- Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
- Check Render logs for connection errors

## Environment Variables Reference

### Vercel (Frontend)

| Variable            | Example                             | Required |
| ------------------- | ----------------------------------- | -------- |
| `REACT_APP_API_URL` | `https://your-service.onrender.com` | Yes      |

### Render (Backend)

| Variable             | Example                                            | Required         |
| -------------------- | -------------------------------------------------- | ---------------- |
| `ALLOWED_ORIGINS`    | `https://your-app.vercel.app,https://*.vercel.app` | Yes              |
| `NODE_ENV`           | `production`                                       | Yes              |
| `MONGODB_URI`        | `mongodb+srv://...`                                | No (for ratings) |
| `JPG_TO_PDF_MAX_DIM` | `2000`                                             | No               |
| `JPG_TO_PDF_QUALITY` | `70`                                               | No               |

## Cost Estimate

### Free Tier (Testing)

- **Vercel:** Free (100GB bandwidth, unlimited requests)
- **Render:** Free (750 hours/month, sleeps after 15 min)
- **MongoDB Atlas:** Free (512MB storage, M0 cluster)
- **Total:** $0/month

### Production Tier (Recommended)

- **Vercel:** Free or Pro $20/month (better performance)
- **Render:** Starter $7/month (always-on, 512MB RAM)
- **MongoDB Atlas:** Free or Shared $9/month (better performance)
- **Total:** $7-36/month depending on needs

## Next Steps

- [ ] Set up custom domain on Vercel
- [ ] Enable HTTPS (automatic on both platforms)
- [ ] Set up monitoring (Render provides basic metrics)
- [ ] Configure backup strategy for MongoDB (if using)
- [ ] Test with real PDF files
- [ ] Monitor costs and usage

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **MongoDB Docs:** https://docs.mongodb.com/

## Security Checklist

- [ ] CORS properly configured (not allowing `*`)
- [ ] MongoDB credentials secured (not in git)
- [ ] File upload limits set (50MB default)
- [ ] Rate limiting considered (future enhancement)
- [ ] HTTPS enabled (automatic on both platforms)
- [ ] Environment variables not exposed to frontend

---

**Deployment complete!** Your PDF Toolkit is now live with frontend on Vercel and backend on Render. 🚀
