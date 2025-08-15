# GoDaddy cPanel Node.js Configuration

## Exact Values for "Create Application" Form

### 1. **Application Mode**
```
Production
```
**Why:** Your app is built and ready for live use, not development.

### 2. **Application Startup File**
```
dist/index.js
```
**Important Notes:**
- **NOT** `server/index.ts` (that's the source TypeScript file)
- **NOT** `index.js` (needs the dist/ folder path)
- This is the compiled JavaScript file created by `npm run build`

### 3. **Passenger Log File** (Optional)
```
logs/app.log
```
**Or you can leave this blank** - GoDaddy will create a default log location.

## Complete Form Values Summary:

| Field | Value |
|-------|--------|
| **Application Mode** | `Production` |
| **Application Startup File** | `dist/index.js` |
| **Passenger Log File** | `logs/app.log` (or leave blank) |
| **App Root Directory** | `/public_html/app` |
| **App URL** | `/app` |
| **Node.js Version** | `18.x` or latest available |

## Additional Settings (if available):

### **Environment Variables** (set these in the environment section):
- `DATABASE_URL` = `postgresql://neondb_owner:npg_X47CwdgqZFYK@ep-weathered-bird-aafglqfx-pooler.westus3.azure.neon.tech/neondb?sslmode=require&channel_binding=require`
- `JWT_SECRET` = `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0`
- `NODE_ENV` = `production`
- `PORT` = `3000`

### **Memory Limit** (if asked):
```
512MB
```
(The Sociocrates app is lightweight and doesn't need much memory)

### **CPU Limit** (if asked):
```
100%
```
(Allow full CPU usage for the Node.js process)

## File Structure Verification

Before creating the application, verify your uploaded files are in this structure:
```
/public_html/app/
├── dist/
│   ├── index.js          ← This is your startup file
│   ├── index.html
│   └── assets/
├── server/
├── shared/
├── package.json
└── node_modules/         ← Created after npm install
```

## What Happens After Creation:

1. **GoDaddy will attempt to start your app** using `dist/index.js`
2. **Check the status** - should show "Running" or "Active"
3. **View logs** to see if there are any startup errors
4. **Test the URL** at `https://sociocrates.com/app/`

## Troubleshooting:

### If app status shows "Stopped" or "Error":
1. **Check the passenger/application logs**
2. **Common issues:**
   - Environment variables not set
   - `npm install` wasn't run
   - Wrong startup file path
   - Node.js version incompatibility

### If you see "Cannot find module" errors:
1. **SSH into your account**
2. **Navigate to app directory:** `cd ~/public_html/app`
3. **Run:** `npm install --production`
4. **Restart the application** in cPanel

### If you see database connection errors:
1. **Verify environment variables** are set exactly as shown above
2. **Test database connection** from your server to Neon
3. **Check Neon database** is running and accessible

## Success Indicators:

✅ **Application Status:** "Running" or "Active"  
✅ **No errors** in the application logs  
✅ **URL accessible:** `https://sociocrates.com/app/` loads  
✅ **Login page appears** with Sociocrates branding  
✅ **Demo buttons work** on the login page  

Once you see these indicators, your Sociocrates collaborative decision-making platform is live! 🎉
