# ENVIRONMENT SETUP GUIDE

Complete guide for setting up your development and production environments.

## Environment Variables Reference

### `.env.local` (Development)

```env
# PostgreSQL Database Connection
# For local PostgreSQL:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/product_dashboard"

# For Neon (serverless PostgreSQL):
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/database?sslmode=require"

# NextAuth Configuration
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-256-bit-secret-key-here"

# Your application URL
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-client-id-from-google-console"
GOOGLE_CLIENT_SECRET="your-client-secret-from-google-console"

# Email Configuration (optional, for OTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"
```

### `.env.production` (Production - Vercel/Deployment)

```env
DATABASE_URL="postgresql://user:password@production-host/database?sslmode=require"
NEXTAUTH_SECRET="strong-production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
GOOGLE_CLIENT_ID="production-google-client-id"
GOOGLE_CLIENT_SECRET="production-google-client-secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"
```

---

## Step-by-Step Setup

### 1. Generate NEXTAUTH_SECRET

```bash
# macOS / Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Copy output and paste into NEXTAUTH_SECRET
```

### 2. Setup PostgreSQL Database

#### Option A: Local PostgreSQL

**macOS**:
```bash
# Install
brew install postgresql@15

# Start service
brew services start postgresql@15

# Create database
createdb product_dashboard

# Create user (optional)
createuser product_user
psql postgres -c "ALTER USER product_user WITH PASSWORD 'password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE product_dashboard TO product_user;"

# Test connection
psql postgres://product_user:password@localhost:5432/product_dashboard -c "SELECT 1;"
```

**Linux (Ubuntu/Debian)**:
```bash
# Install
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo service postgresql start

# Create database
sudo -u postgres createdb product_dashboard
sudo -u postgres createuser product_user
sudo -u postgres psql -c "ALTER USER product_user WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE product_dashboard TO product_user;"

# Test connection
psql postgres://product_user:password@localhost:5432/product_dashboard -c "SELECT 1;"
```

**Windows**:
```
1. Download PostgreSQL installer from postgresql.org
2. Run installer
3. Set password for postgres user
4. Note the port (default 5432)
5. Open pgAdmin from Windows menu
6. Create database "product_dashboard"
7. Connection string: postgresql://postgres:password@localhost:5432/product_dashboard
```

#### Option B: Neon Cloud Database (Recommended)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy connection string
5. Add to `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/database?sslmode=require"
   ```

### 3. Setup Google OAuth

1. Go to https://console.cloud.google.com
2. Create new project:
   - Project name: "Product Dashboard"
   - Click "Create"
3. Enable OAuth 2.0:
   - Go to "APIs & Services"
   - Click "OAuth consent screen"
   - Select "External"
   - Fill required fields:
     - App name: "Product Dashboard"
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
4. Create OAuth credentials:
   - Go to "Credentials" tab
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     https://yourdomain.com/api/auth/callback/google
     ```
   - Click "Create"
5. Copy `Client ID` and `Client Secret`
6. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### 4. Setup Gmail for OTP Emails

1. Enable 2-Factor Authentication on Gmail:
   - Go to myaccount.google.com
   - Security
   - 2-Step Verification
   - Follow setup steps

2. Create App Password:
   - Go to myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google generates 16-character password
   - Copy the password

3. Add to `.env.local`:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="16-character-app-password-here"
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Generate Prisma Client

```bash
npm run prisma:generate
```

### 7. Run Database Migrations

```bash
npm run prisma:migrate

# You'll be prompted for migration name
# Press Enter to skip
# Prisma will create tables
```

### 8. Start Development Server

```bash
npm run dev

# Open http://localhost:3000
```

---

## Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `.env.local` created with all required variables
- [ ] Database connection tested (`psql $DATABASE_URL`)
- [ ] Prisma migrations run successfully
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 accessible
- [ ] Redirected to login page
- [ ] Can create account with email/password
- [ ] Can login with created account
- [ ] Can add products
- [ ] Charts display on Analytics tab
- [ ] Can logout

---

## Development Environment Variables

### Minimal Setup (Email optional)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/product_dashboard"
NEXTAUTH_SECRET="test-secret-key-32-character-minimum"
NEXTAUTH_URL="http://localhost:3000"
# Google OAuth optional for development
# SMTP optional - OTP won't work without it
```

### Full Setup
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/product_dashboard"
NEXTAUTH_SECRET="openssl-generated-32-character-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

---

## Production Environment Setup

### Vercel Deployment

1. Push to GitHub
2. Go to vercel.com
3. Import GitHub repository
4. Add environment variables:
   - Go to Settings → Environment Variables
   - Add each variable from `.env.production`
5. Deploy
6. Go to Project Settings
7. Update Domains

### Environment Variables in Vercel

Click "Add New" for each:

1. **DATABASE_URL**
   - Type: Sensitive
   - Value: `postgresql://user:pass@neon.tech/db?sslmode=require`

2. **NEXTAUTH_SECRET**
   - Type: Sensitive
   - Value: `your-production-secret`

3. **NEXTAUTH_URL**
   - Type: Plain Text
   - Value: `https://yourdomain.vercel.app`

4. **GOOGLE_CLIENT_ID**
   - Type: Plain Text
   - Value: `google-client-id`

5. **GOOGLE_CLIENT_SECRET**
   - Type: Sensitive
   - Value: `google-secret`

6. **SMTP_HOST**, **SMTP_PORT**, **SMTP_USER**, **SMTP_PASSWORD**
   - Type: Sensitive for passwords

### Google OAuth for Production

1. Go to Google Cloud Console
2. Update authorized redirect URIs:
   ```
   https://yourdomain.vercel.app/api/auth/callback/google
   ```
3. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel

### Database for Production

Use Neon PostgreSQL:
1. Create production project in Neon
2. Set compute size to professional
3. Enable backups
4. Get production connection string
5. Add to Vercel as DATABASE_URL

---

## Environment Variables Explanation

| Variable | Required | Purpose |
|----------|----------|---------|
| DATABASE_URL | ✅ | PostgreSQL connection string |
| NEXTAUTH_SECRET | ✅ | JWT signing key (must be 32+ chars) |
| NEXTAUTH_URL | ✅ | Your application URL (used for OAuth redirects) |
| GOOGLE_CLIENT_ID | ❌ | Google OAuth credential |
| GOOGLE_CLIENT_SECRET | ❌ | Google OAuth credential |
| SMTP_HOST | ❌ | Email server host (for OTP emails) |
| SMTP_PORT | ❌ | Email server port |
| SMTP_USER | ❌ | Email server username |
| SMTP_PASSWORD | ❌ | Email server password |

---

## Troubleshooting Environment Setup

### "DATABASE_URL not set"
```bash
# Check if .env.local exists
ls -la .env.local

# Check if it has DATABASE_URL
grep DATABASE_URL .env.local

# Restart dev server after changing .env.local
```

### "Invalid DATABASE_URL"
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# For Neon: ensure ?sslmode=require is included
# For local: ensure PostgreSQL is running
```

### "NEXTAUTH_SECRET not provided"
```bash
# Generate and add to .env.local
openssl rand -base64 32 >> .env.local
```

### "Google OAuth not working"
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
- Verify callback URL matches Google Console:
  - Dev: `http://localhost:3000/api/auth/callback/google`
  - Prod: `https://yourdomain.com/api/auth/callback/google`
- Check cookies enabled in browser

### "OTP emails not sending"
- Verify SMTP_USER and SMTP_PASSWORD are correct
- Check Gmail has 2FA enabled
- Verify using "App Password" not main password
- Check spam folder
- Test with: `npm run prisma:studio` and manually verify OTP

---

## Best Practices

1. **Never commit `.env.local`**
   - Already in `.gitignore`
   - Use `.env.local.example` for template

2. **Keep secrets secure**
   - Don't share NEXTAUTH_SECRET
   - Don't share SMTP_PASSWORD
   - Use Vercel's Sensitive type

3. **Use environment-specific values**
   - Development: localhost URLs
   - Production: domain URLs

4. **Rotate secrets regularly**
   - NEXTAUTH_SECRET yearly
   - OAuth credentials if compromised
   - SMTP passwords periodically

5. **Document your setup**
   - Keep notes on which services are used
   - Document OAuth scopes
   - Track backup locations

---

## Quick Reference

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Test PostgreSQL
psql $DATABASE_URL -c "SELECT 1;"

# Setup Prisma
npm run prisma:generate
npm run prisma:migrate

# View database
npm run prisma:studio

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

Done! Your environment is ready for development or production deployment.
