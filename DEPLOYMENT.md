# Sociocrates Deployment Guide

## Prerequisites
1. **Neon.tech PostgreSQL Database**
2. **Hosting Provider Account** (Vercel, Netlify, or VPS)
3. **Domain**: sociocrates.com

## Step 1: Database Setup

### Create Neon Database
1. Go to [Neon.tech](https://neon.tech)
2. Create new project: "Sociocrates Production"
3. Copy the connection string
4. Save as `DATABASE_URL` environment variable

### Initialize Database Schema
```bash
# Set environment variable
export DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.postgres.neon.tech/dbname?sslmode=require"

# Generate and run migrations
npm run db:generate
npm run db:push
```

## Step 2: Environment Variables

Set these in your hosting provider:
```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=generate-a-secure-random-key-here
NODE_ENV=production
PORT=5000
```

## Step 3: Build and Deploy

### For Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### For Traditional Hosting:
```bash
# Build the application
npm run build

# Deploy dist/ folder to your server
# Set environment variables
# Run: npm start
```

## Step 4: Post-Deployment

1. **Create Admin User**
   - Register first user via the app
   - Manually update their role to 'admin' in the database

2. **Configure Domain**
   - Point sociocrates.com to your hosting provider
   - Set up SSL certificate

3. **Test Functionality**
   - Login with admin account
   - Create test circle and proposal
   - Verify 7-step process works

## Database Management

```bash
# View database in browser
npm run db:studio

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate
```

## Security Checklist

- [ ] JWT_SECRET is cryptographically secure
- [ ] DATABASE_URL uses SSL (sslmode=require)
- [ ] All environment variables are secure
- [ ] HTTPS is enabled on domain
- [ ] CORS is properly configured for production
