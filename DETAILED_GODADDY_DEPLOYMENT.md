# Detailed GoDaddy Deployment Guide for Sociocrates

## Step 2: Set Environment Variables in GoDaddy (DETAILED)

### Method A: Using GoDaddy cPanel (Most Common)

1. **Log into your GoDaddy hosting account**
   - Go to https://sso.godaddy.com/
   - Enter your GoDaddy username/password
   - Navigate to "My Products" → "Web Hosting"

2. **Access cPanel**
   - Click "Manage" next to your hosting account
   - Click "cPanel Admin" button
   - You'll see the cPanel dashboard

3. **Find Node.js App Settings**
   - Look for "Software" section in cPanel
   - Click on "Node.js" or "Node.js Selector"
   - If you don't see it, look for "CloudLinux Node.js" or "LiteSpeed Node.js"

4. **Set Environment Variables**
   - In the Node.js interface, find your app
   - Click "Edit" or "Environment Variables"
   - Add these variables ONE BY ONE:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_X47CwdgqZFYK@ep-weathered-bird-aafglqfx-pooler.westus3.azure.neon.tech/neondb?sslmode=require&channel_binding=require`

   **Variable 2:**
   - Name: `JWT_SECRET`
   - Value: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0`

   **Variable 3:**
   - Name: `NODE_ENV`
   - Value: `production`

   **Variable 4:**
   - Name: `PORT`
   - Value: `3000` (or whatever port GoDaddy assigns)

5. **Save the Environment Variables**
   - Click "Save" or "Apply" after each variable
   - Verify all 4 variables are listed correctly

### Method B: Using SSH Terminal (Alternative)

1. **Access SSH (if available)**
   - In cPanel, look for "Terminal" under "Advanced"
   - Or use SSH client like PuTTY (Windows) or Terminal (Mac/Linux)

2. **Navigate to your app directory**
   ```bash
   cd ~/public_html/app
   ```

3. **Create .env file manually**
   ```bash
   nano .env
   ```

4. **Add these lines to the .env file:**
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_X47CwdgqZFYK@ep-weathered-bird-aafglqfx-pooler.westus3.azure.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0
   NODE_ENV=production
   PORT=3000
   ```

5. **Save and exit**
   - Press `Ctrl + X`
   - Press `Y` to confirm
   - Press `Enter` to save

---

## Step 3: Install Dependencies (npm install --production) - DETAILED

### Method A: Using cPanel Terminal

1. **Open Terminal in cPanel**
   - In your cPanel dashboard
   - Find "Terminal" under "Advanced" section
   - Click to open a command line interface

2. **Navigate to your app directory**
   ```bash
   cd ~/public_html/app
   ```
   
   *Note: Replace "app" with wherever you uploaded the files*

3. **Verify you're in the right location**
   ```bash
   ls -la
   ```
   
   *You should see: package.json, dist/, server/, shared/ folders*

4. **Check Node.js version**
   ```bash
   node --version
   npm --version
   ```
   
   *You need Node.js 18+ for the app to work*

5. **Install dependencies**
   ```bash
   npm install --production
   ```
   
   **What this does:**
   - Downloads all required packages (express, drizzle-orm, etc.)
   - Creates `node_modules/` folder
   - May take 2-5 minutes depending on connection
   - Only installs production dependencies (not dev tools)

6. **Verify installation**
   ```bash
   ls -la node_modules/
   npm list --depth=0
   ```

### Method B: Using GoDaddy File Manager (If Terminal not available)

1. **Download dependencies locally first**
   - On your computer, run `npm install --production` 
   - Upload the entire `node_modules/` folder to GoDaddy
   - ⚠️ **Warning:** This is slow due to thousands of files

2. **Alternative: Request Node.js access**
   - Contact GoDaddy support
   - Ask them to enable Node.js for your account
   - Some plans don't include Node.js by default

### Common Issues and Solutions:

**Problem: "npm command not found"**
- Solution: Node.js not installed/enabled
- Contact GoDaddy support to enable Node.js

**Problem: "Permission denied"**
- Solution: Run with proper permissions:
  ```bash
  sudo npm install --production
  ```

**Problem: "Network error" or timeouts**
- Solution: Try alternative registry:
  ```bash
  npm install --production --registry https://registry.npmjs.org/
  ```

---

## Step 4: Start the App (npm start) - DETAILED

### Method A: Using Node.js App Manager (Recommended)

1. **Find Node.js App Manager in cPanel**
   - Look for "Node.js App" or "Node.js Selector"
   - Click to open the interface

2. **Create New Application**
   - Click "Create Application" or "Add Application"
   - Fill in the form:
     - **App Root:** `/public_html/app` (where you uploaded files)
     - **App URL:** `sociocrates.com/app` or just `/app`
     - **Application Mode:** `Production`
     - **Node.js Version:** `18.x` or latest available

3. **Set Startup File**
   - **Startup File:** `dist/index.js` (this is your built server)
   - **NOT** `server/index.ts` (that's the source file)

4. **Configure Application**
   - **Port:** Usually auto-assigned by GoDaddy
   - **Environment:** `production`
   - Make sure environment variables are set (from Step 2)

5. **Start the Application**
   - Click "Save" or "Create"
   - Then click "Start" or "Enable"
   - Status should show "Running" or "Active"

### Method B: Using Terminal/SSH

1. **Navigate to app directory**
   ```bash
   cd ~/public_html/app
   ```

2. **Test the app manually first**
   ```bash
   node dist/index.js
   ```
   
   **Expected output:**
   ```
   ✅ Database connected successfully
   Environment: production, Setting up static serving
   🏛️ Sociocratic Decision App serving on port 5000
   ```

3. **If manual test works, use npm start**
   ```bash
   npm start
   ```

4. **Run in background (persistent)**
   ```bash
   nohup npm start > app.log 2>&1 &
   ```
   
   *This keeps the app running even if you close the terminal*

5. **Check if it's running**
   ```bash
   ps aux | grep node
   netstat -tulpn | grep :5000
   ```

### Method C: Using PM2 (Process Manager)

1. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

2. **Start app with PM2**
   ```bash
   pm2 start dist/index.js --name "sociocrates"
   ```

3. **Set PM2 to auto-restart**
   ```bash
   pm2 startup
   pm2 save
   ```

4. **Monitor the app**
   ```bash
   pm2 status
   pm2 logs sociocrates
   ```

---

## Verification Steps

### 1. Check if App is Running
```bash
curl http://localhost:5000/
# or 
curl http://your-domain.com/app/
```

### 2. Test Database Connection
Visit: `https://sociocrates.com/app/api/auth/me`
Should return: `{"message":"Access token required"}`

### 3. Test Full Login Page
Visit: `https://sociocrates.com/app/`
Should show: Sociocrates login page with demo buttons

---

## Troubleshooting Common Issues

### App Won't Start
1. **Check logs:**
   ```bash
   tail -f app.log
   npm start 2>&1 | tee debug.log
   ```

2. **Common errors and solutions:**
   - `DATABASE_URL must be set` → Check environment variables
   - `Port already in use` → Change PORT environment variable
   - `Module not found` → Run `npm install` again
   - `Permission denied` → Check file permissions: `chmod +x dist/index.js`

### Database Connection Issues
1. **Test connection manually:**
   ```bash
   node -e "console.log(process.env.DATABASE_URL)"
   ```

2. **Verify Neon database is accessible:**
   ```bash
   ping ep-weathered-bird-aafglqfx-pooler.westus3.azure.neon.tech
   ```

### Port Configuration
1. **Check what port GoDaddy assigned:**
   - Look in cPanel Node.js settings
   - Usually 3000, 8080, or 8443

2. **Update PORT environment variable accordingly**

---

## Final Testing Checklist

- [ ] Environment variables set correctly
- [ ] `npm install` completed without errors
- [ ] `npm start` runs without crashing
- [ ] Database connection successful
- [ ] App accessible at `sociocrates.com/app/`
- [ ] Login page loads with demo buttons
- [ ] Can register new account
- [ ] Can create proposals and circles

Once all these steps are complete, your Sociocrates collaborative decision-making platform will be live at `sociocrates.com/app/`! 🎉
