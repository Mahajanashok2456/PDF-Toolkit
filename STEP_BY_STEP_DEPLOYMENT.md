# Step-by-Step Deployment Process

Follow these steps in order to deploy your PDF Toolkit.

---

## 🎯 STEP 1: Prepare Your Code

### 1.1 Commit and Push to GitHub

```bash
# In your project root
git add .
git commit -m "Prepare for deployment - backend ready"
git push origin master
```

**✓ Verify:** Your latest code is on GitHub

---

## 🔧 STEP 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up using GitHub (recommended)
3. Authorize Render to access your repositories

### 2.2 Create Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Find and select your `universal pdf` repository
4. Click **"Connect"**

### 2.3 Configure Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `pdf-toolkit-backend` |
| **Region** | Select closest to you (e.g., Oregon, Frankfurt) |
| **Branch** | `master` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

### 2.4 Select Plan
- For testing: **Free** (spins down after 15 min)
- For production: **Starter - $7/month** (always on)

### 2.5 Set Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these:
```
ALLOWED_ORIGINS=http://localhost:3000
NODE_ENV=production
```

⚠️ **Note:** We'll update ALLOWED_ORIGINS after getting Vercel URL

### 2.6 Deploy
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for build and deploy
3. Watch the logs - should see "Backend server running on port..."

### 2.7 Copy Your Backend URL
When deployment succeeds, copy the URL at the top:
```
Example: https://pdf-toolkit-backend.onrender.com
```

### 2.8 Test Backend
Open in browser or use curl:
```bash
curl https://YOUR-SERVICE-NAME.onrender.com/api/health
```

Should return: `{"status":"OK"}`

**✓ Backend is LIVE!** Write down your Render URL.

---

## 🚀 STEP 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up using GitHub
3. Authorize Vercel

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Find your `universal pdf` repository
3. Click **"Import"**

### 3.3 Configure Project
Vercel auto-detects Create React App. Verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Create React App |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install` |

### 3.4 Add Environment Variable
**BEFORE clicking Deploy:**

1. Click **"Environment Variables"**
2. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://YOUR-RENDER-SERVICE.onrender.com`
   - **Environments:** Check all (Production, Preview, Development)
3. Click **"Add"**

⚠️ **IMPORTANT:** Use YOUR actual Render URL from Step 2.7

### 3.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Watch the build logs

### 3.6 Copy Your Frontend URL
When deployment succeeds, click **"Visit"** or copy the URL:
```
Example: https://your-app.vercel.app
```

**✓ Frontend is LIVE!** Write down your Vercel URL.

---

## 🔗 STEP 4: Connect Frontend & Backend

### 4.1 Update Backend CORS
Now that you have Vercel URL, update Render:

1. Go to Render dashboard
2. Click your **pdf-toolkit-backend** service
3. Go to **"Environment"** tab
4. Find **ALLOWED_ORIGINS** and click **"Edit"**
5. Update value to:
   ```
   https://your-app.vercel.app,https://your-app-git-*.vercel.app
   ```
   Replace `your-app` with YOUR actual Vercel domain
6. Click **"Save Changes"**
7. Wait ~30 seconds for automatic redeploy

**✓ CORS is configured!**

---

## 🧪 STEP 5: Test Everything

### 5.1 Open Your App
1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Open browser DevTools (F12)
3. Go to **Console** tab

### 5.2 Test Each Feature
Try these in order:

- [ ] **Merge PDFs:** Upload 2 PDFs, click Merge
- [ ] **Split PDF:** Upload 1 PDF, set page range, click Split  
- [ ] **Rotate PDF:** Upload 1 PDF, select angle, click Rotate
- [ ] **Remove Pages:** Upload 1 PDF, enter pages to remove
- [ ] **Extract Pages:** Upload 1 PDF, enter pages to extract
- [ ] **Organize PDF:** Upload 1 PDF, reorder pages
- [ ] **JPG to PDF:** Upload image files, convert

### 5.3 Check for Errors
In Console tab, you should see:
- ✅ No CORS errors
- ✅ API calls going to your Render URL
- ✅ Successful responses (200 status)

**❌ If you see CORS errors:**
- Double-check ALLOWED_ORIGINS in Render includes your Vercel domain
- Make sure you saved changes and service redeployed

**❌ If API calls fail (404):**
- Check REACT_APP_API_URL in Vercel settings
- Make sure it matches your Render URL exactly
- Redeploy frontend if you changed it

---

## 📊 STEP 6: Optional - MongoDB Setup (for Ratings)

### 6.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create Organization → Create Project

### 6.2 Create Cluster
1. Click **"Build a Database"**
2. Select **"M0 Free"** tier
3. Choose provider (AWS) and region
4. Click **"Create"**

### 6.3 Create Database User
1. Security → Database Access
2. Click **"Add New Database User"**
3. Authentication: Password
4. Username: `pdfuser` (or your choice)
5. Password: Generate secure password and SAVE IT
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 6.4 Allow Access
1. Security → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 6.5 Get Connection String
1. Go to Database → Click **"Connect"**
2. Select **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://pdfuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name before the `?`:
   ```
   mongodb+srv://pdfuser:yourpass@cluster0.xxxxx.mongodb.net/pdf-toolkit?retryWrites=true&w=majority
   ```

### 6.6 Add to Render
1. Go to Render → Your backend service
2. Environment → Add Environment Variable
3. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** Your full connection string
4. Click **"Save Changes"**
5. Service will redeploy automatically

### 6.7 Test Ratings
1. Go to your app
2. Submit a rating
3. Check Render logs - should see "MongoDB connected"

**✓ Ratings feature enabled!**

---

## ✅ Final Checklist

- [ ] Backend deployed to Render and showing green status
- [ ] Frontend deployed to Vercel
- [ ] ALLOWED_ORIGINS updated in Render with Vercel URL
- [ ] REACT_APP_API_URL set in Vercel with Render URL
- [ ] At least one PDF operation tested successfully
- [ ] No CORS errors in browser console
- [ ] (Optional) MongoDB connected for ratings

---

## 📝 Your Deployment Info

Fill this out for reference:

```
Backend URL (Render):    https://______________________.onrender.com
Frontend URL (Vercel):   https://______________________.vercel.app
MongoDB URI (if used):   mongodb+srv://______________ (keep private!)
Deployed Date:           ________________
```

---

## 🆘 Common Issues & Fixes

### Issue: "Backend keeps sleeping" (Free Tier)
**Solution:** 
- Normal behavior on Render free tier
- Upgrade to Starter ($7/mo) for always-on
- Or accept 30-60s first-load delay

### Issue: CORS error in browser
**Solution:**
```bash
# In Render Environment Variables:
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```
Make sure no typos, no trailing slashes

### Issue: API returns 404
**Solution:**
```bash
# In Vercel Environment Variables:
REACT_APP_API_URL=https://your-render-url.onrender.com
```
No trailing slash, must match Render URL exactly
Then redeploy frontend

### Issue: Build fails on Vercel
**Check:**
- Is `REACT_APP_API_URL` set correctly?
- Are all dependencies in root `package.json`?
- Check build logs for specific error

### Issue: Build fails on Render
**Check:**
- Root Directory is set to `backend`
- Start command is `node server.js`
- Check logs for missing dependencies

---

## 🎉 Success!

Your PDF Toolkit is now live!

- ✅ Frontend: Static React app on Vercel
- ✅ Backend: Node.js API on Render
- ✅ CORS: Properly configured
- ✅ All features working

**Share your app:** Give your Vercel URL to users!

**Next steps:**
- Set up custom domain (optional)
- Monitor usage in Render/Vercel dashboards
- Consider upgrading if you exceed free tier limits

---

Need help? Check:
- Render Logs: Dashboard → Your Service → Logs
- Vercel Logs: Dashboard → Your Project → Deployments → Latest → View Function Logs
- Browser Console: F12 → Console tab (for frontend errors)
