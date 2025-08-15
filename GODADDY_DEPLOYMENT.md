# Sociocrates - GoDaddy Deployment Guide

## Prerequisites
✅ GoDaddy hosting account with Node.js support  
✅ Neon PostgreSQL database (already connected)  
✅ Sociocrates.com domain pointed to GoDaddy  

## Step 1: Build Production Files

The production files are ready to upload to your GoDaddy hosting account.

## Step 2: Upload Files to GoDaddy

### Via File Manager (GoDaddy cPanel):
1. **Log into GoDaddy cPanel**
2. **Open File Manager**
3. **Navigate to your domain's public_html folder**
4. **Upload these files/folders:**
   ```
   dist/           (built React app)
   server/         (Node.js backend)
   shared/         (database schema)
   package.json
   node_modules/   (or run npm install on server)
   ```

### Via FTP/SFTP:
```bash
# Upload all files to your domain root
# Make sure to include:
- dist/ folder (frontend build)
- server/ folder (backend)
- package.json
- All dependencies
```

## Step 3: Configure Environment Variables

In GoDaddy hosting panel, set these environment variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_X47CwdgqZFYK@ep-weathered-bird-aafglqfx-pooler.westus3.azure.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-super-secure-random-key-here-min-32-chars
NODE_ENV=production
PORT=3000
```

## Step 4: Install Dependencies & Start

In GoDaddy terminal/SSH:
```bash
cd /home/yourusername/public_html
npm install --production
npm start
```

## Step 5: Configure Node.js App

In GoDaddy hosting settings:
- **App Root**: `/public_html`
- **Startup File**: `dist/index.js`
- **Port**: Use GoDaddy's assigned port (usually 3000)

## Step 6: Database Connection

Your Neon database is already configured and ready! The app will automatically:
- Connect to your PostgreSQL database
- Create the first admin user when someone registers
- Handle all sociocratic processes

## Step 7: Create First Admin User

1. **Visit**: https://sociocrates.com
2. **Register** with your email
3. **Manually promote to admin**: Connect to your Neon database and run:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

## File Structure for Upload:
```
public_html/
├── dist/
│   ├── index.html
│   ├── assets/
│   └── index.js
├── server/
├── shared/
├── package.json
└── node_modules/
```

## Troubleshooting

**If app won't start:**
- Check Node.js version (requires Node 18+)
- Verify environment variables are set
- Check GoDaddy error logs

**If database won't connect:**
- Verify DATABASE_URL is exactly correct
- Check Neon database is running
- Ensure SSL is enabled

## Alternative: Static Build (If Node.js not available)

If GoDaddy doesn't support Node.js apps, we can create a static version with a separate API backend.
