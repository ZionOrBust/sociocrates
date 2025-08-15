# Sociocrates Vercel Deployment Guide

## 🚀 Quick Vercel Deployment

Since you have a connected GitHub repo, Vercel deployment is straightforward!

### Step 1: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository:**
   - Repository: `offgridhomesteads/homesteading-youtube-videos` (contains Sociocrates app)
   - Branch: `flare-verse` (your current branch)

### Step 2: Configure Project Settings

When importing the project:

**Framework Preset:** Select "Other" or "Node.js"
**Root Directory:** Leave as `.` (root)
**Build Command:** `npm run vercel-build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Step 3: Set Environment Variables

In Vercel dashboard, add these environment variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_X47CwdgqZFYK@ep-weathered-bird-aafglqfx-pooler.westus3.azure.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0

NODE_ENV=production
```

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (2-3 minutes)
3. **Get your Vercel URL** (e.g., `sociocrates-xyz.vercel.app`)

### Step 5: Configure Custom Domain (Optional)

To use `app.sociocrates.com`:

1. **In Vercel dashboard** → Project → Settings → Domains
2. **Add domain:** `app.sociocrates.com`
3. **In GoDaddy DNS settings:**
   - Add CNAME record: `app` → `your-project.vercel.app`

## 🔧 Alternative: Deploy via CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from this directory
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

## 📱 WordPress Integration

Update your WordPress site to link to the Vercel deployment:

### Option A: Vercel Subdomain
- Update WordPress links to: `https://your-project.vercel.app`
- Professional but shows Vercel branding

### Option B: Custom Subdomain
- Update WordPress links to: `https://app.sociocrates.com`
- Requires DNS configuration but looks professional

### WordPress Button Code:
```html
<div style="text-align: center; padding: 20px;">
  <a href="https://app.sociocrates.com" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
    Launch Sociocratic Platform →
  </a>
</div>
```

## ✅ Success Indicators

After deployment, verify:

- [ ] **Build successful** in Vercel dashboard
- [ ] **Functions deployed** (shows API endpoints)
- [ ] **App accessible** at Vercel URL
- [ ] **Login page loads** with Sociocrates branding
- [ ] **Database connected** (can register/login)
- [ ] **Demo accounts work**

## 🔄 Automatic Deployments

Vercel will automatically redeploy when you:
- **Push to GitHub** (flare-verse branch)
- **Merge pull requests**
- **Update any files** in the repository

## 🛠️ Troubleshooting

### Build Fails:
- Check Vercel build logs
- Verify Node.js version (should be 18+)
- Ensure all dependencies are in package.json

### Database Connection Issues:
- Verify environment variables are set correctly
- Test DATABASE_URL from Vercel function logs
- Check Neon database is accessible

### App Not Loading:
- Check Vercel function logs
- Verify vercel.json routing configuration
- Test API endpoints directly

## 📊 Vercel Benefits

✅ **Modern Node.js 18+** - No version issues
✅ **Automatic HTTPS** - Secure by default  
✅ **Global CDN** - Fast worldwide access
✅ **Automatic deployments** - Updates from GitHub
✅ **Function logs** - Easy debugging
✅ **Free tier** - No cost for small apps
✅ **Custom domains** - Professional URLs

Your Sociocrates app will be live at a Vercel URL within minutes! 🎉
