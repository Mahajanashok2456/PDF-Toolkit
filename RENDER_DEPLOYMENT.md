# Render Deployment Guide (Backend)

## Prerequisites

- Render account (https://render.com)
- MongoDB Atlas account (for ratings feature) - Optional

## Create Web Service on Render

1. **Go to Render Dashboard** → New → Web Service
2. **Connect Repository** → Link your GitHub repository
3. **Configure Service:**

### Basic Settings

- **Name:** `pdf-toolkit-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `master` or `main`
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

### Instance Type

- **Free tier** works for testing
- **Starter** or higher recommended for production

## Environment Variables

Add these in Render → Environment → Environment Variables:

### Required

```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-*.vercel.app
PORT=3001
NODE_ENV=production
```

### Optional (for ratings feature)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pdf-toolkit?retryWrites=true&w=majority
```

### Optional (for JPG to PDF optimization)

```
JPG_TO_PDF_MAX_DIM=2000
JPG_TO_PDF_QUALITY=70
```

**Important Notes:**

- Replace `your-app.vercel.app` with your actual Vercel domain(s)
- The `ALLOWED_ORIGINS` must include:
  - Your production domain: `https://your-app.vercel.app`
  - Preview domains pattern: `https://your-app-git-*.vercel.app` (for PR previews)
- Render automatically sets `PORT`, but you can override if needed

## MongoDB Setup (Optional - for Ratings)

### If you want the ratings feature:

1. **Create MongoDB Atlas Account:** https://www.mongodb.com/cloud/atlas
2. **Create Cluster** (Free M0 tier available)
3. **Create Database User:**
   - Database Access → Add New Database User
   - Set username and password
   - Grant read/write access
4. **Whitelist Render IPs:**
   - Network Access → Add IP Address
   - Allow access from anywhere (0.0.0.0/0) or use Render IPs
5. **Get Connection String:**
   - Database → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password
6. **Add to Render:**
   - Paste connection string as `MONGODB_URI` environment variable

### If you don't need ratings:

- Simply don't set `MONGODB_URI`
- The backend will work without MongoDB (ratings endpoints will return 503)

## Health Check Configuration

Render will automatically ping your service. Configure:

- **Health Check Path:** `/api/health`
- **Expected Status:** 200

## Deploy

1. Click **Create Web Service**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Start the server
3. Monitor logs for any errors

## Get Your Service URL

After deployment completes:

1. Copy the service URL (e.g., `https://pdf-toolkit-backend.onrender.com`)
2. Use this URL as `REACT_APP_API_URL` in Vercel
3. Test the health endpoint: `https://your-service.onrender.com/api/health`

## Update Vercel Environment

Now that you have your Render URL:

1. Go to Vercel → Settings → Environment Variables
2. Add: `REACT_APP_API_URL=https://your-render-service.onrender.com`
3. Redeploy frontend

## Testing Backend Endpoints

Test using curl or Postman:

```bash
# Health check
curl https://your-service.onrender.com/api/health

# Test merge (requires 2 PDF files)
curl -X POST https://your-service.onrender.com/api/merge \
  -F "pdfs=@test1.pdf" \
  -F "pdfs=@test2.pdf" \
  --output merged.pdf

# Test ratings stats
curl https://your-service.onrender.com/api/ratings/stats
```

## Post-Deployment Checklist

- [ ] Service is running (green status in Render)
- [ ] Health check passing (`/api/health` returns 200)
- [ ] CORS configured with correct Vercel domains
- [ ] MongoDB connected (if using ratings)
- [ ] Logs show no errors
- [ ] Test at least one PDF operation (merge/split)

## Important Notes

### Free Tier Limitations

- Render free tier **spins down after 15 minutes of inactivity**
- First request after spin-down will take 30-60 seconds
- Consider upgrading to Starter tier ($7/month) for always-on service

### File Upload Limits

- Current limit: 50MB per file
- Adjust in `backend/server.js` if needed:
  ```javascript
  limits: {
    fileSize: 50 * 1024 * 1024;
  }
  ```

### Protect PDF Feature

The `/api/protect-pdf` endpoint requires `qpdf` to be installed on the server.

**On Render's default image, qpdf is NOT pre-installed.** Options:

1. **Remove/disable** this endpoint if not needed
2. **Use a Docker deployment** with qpdf installed
3. **Wait for the first request** to fail and handle gracefully

If you need protect-pdf, you'll need to create a `Dockerfile`:

```dockerfile
FROM node:18
RUN apt-get update && apt-get install -y qpdf
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
CMD ["node", "server.js"]
```

Then switch Render to Docker runtime.

## Troubleshooting

### Build Fails

- Check Root Directory is set to `backend`
- Verify package.json exists in backend/
- Check build logs for specific errors

### Service Crashes

- Check Logs in Render dashboard
- Common issues:
  - Missing environment variables
  - MongoDB connection failures (won't crash, but logs warnings)
  - Memory limits exceeded (upgrade instance)

### CORS Errors from Frontend

- Verify `ALLOWED_ORIGINS` includes your Vercel domains
- Include wildcard pattern for preview deploys
- Restart service after updating env vars

### Slow First Request

- This is normal on free tier (cold start)
- Upgrade to paid tier for always-on service
- Or implement a ping/keep-alive service

## Monitoring

Render provides:

- Logs (live and historical)
- Metrics (CPU, memory, request count)
- Health check status

Monitor these regularly, especially after deployment.
