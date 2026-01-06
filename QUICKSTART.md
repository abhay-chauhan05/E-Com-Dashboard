# Quick Start Guide

Get your Product Dashboard up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or Neon)
- npm package manager

## Setup Steps

### Step 1: Install Dependencies

```bash
cd product-dashboard
npm install
```

This installs all required packages:
- Next.js 15
- React 19
- NextAuth v4
- Prisma ORM
- Tailwind CSS
- Recharts for charts
- Bcrypt for password hashing
- And more...

### Step 2: Configure Environment Variables

```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local with your values
```

**Required variables**:

```env
# Database (Get from Neon or local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/product_dashboard"

# NextAuth (Generate secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Optional: Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Optional: Email OTP (use Gmail + App Password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Step 3: Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database and tables
npm run prisma:migrate

# (Optional) View data with Prisma Studio
npm run prisma:studio
```

### Step 4: Run Development Server

```bash
npm run dev

# Open http://localhost:3000 in browser
```

You'll be redirected to login page.

## First Login

### Option A: Create Account
1. Click "Sign up"
2. Fill form:
   - Name: Your Name
   - Email: your-email@example.com
   - Password: Any 8+ character password
3. Click "Sign up"
4. Auto-login and redirected to dashboard

### Option B: Google OAuth
1. Click "Continue with Google" button
2. Sign in with Google account
3. Grant permissions
4. Auto-login and redirected to dashboard

## First Product

1. Click "Add Product" button
2. Fill form:
   - Name: "Wireless Mouse"
   - Category: "Electronics"
   - Price: "29.99"
   - Stock: "50"
3. Click "Add Product"
4. Product appears in table

## Explore Features

### Search & Filter
- Use search bar to find products by name
- Filter by category dropdown
- Change page with navigation buttons

### Edit Product
- Click "Edit" button on any product
- Update details in form
- Stock auto-updates status (in stock / out of stock)

### Delete Product
- Click "Delete" button
- Confirm deletion
- Product removed instantly

### View Analytics
- Click "Analytics" tab
- See 4 charts:
  - **Products by Category**: Bar chart
  - **Stock Availability**: Pie chart (in stock vs out)
  - **Price Distribution**: Bar chart (price ranges)
  - **Timeline**: Line chart (added over 30 days)

## Project Structure

```
product-dashboard/
├── app/                    # Next.js App Router
│   ├── auth/              # Login, Signup, Password reset
│   ├── dashboard/         # Main dashboard
│   └── api/               # API endpoints
├── components/            # Reusable React components
├── lib/                   # Utilities (auth, database, etc)
├── prisma/               # Database schema
└── public/               # Static files
```

## Common Tasks

### Reset Database
```bash
npm run prisma:migrate reset

# This:
# 1. Deletes all data
# 2. Recreates tables
# 3. Runs migrations

# You'll need to:
# - Create a new account
# - Add products
```

### View Database
```bash
npm run prisma:studio

# Opens http://localhost:5555
# View and edit data directly
```

### Clear Browser Cache
```
Ctrl+Shift+Del (Windows)
Cmd+Shift+Del (Mac)
# Clear cookies and cache
# Restart browser
```

### Fix Build Errors

**Error**: "Cannot find module"
```bash
npm install
npm run prisma:generate
```

**Error**: Database connection failed
```bash
# Check DATABASE_URL in .env.local
# Verify PostgreSQL is running
# Test connection: psql $DATABASE_URL
```

**Error**: Port 3000 already in use
```bash
npm run dev -- -p 3001
# Runs on port 3001 instead
```

## What's Included

✅ **Authentication**
- Email/password login & signup
- Google OAuth integration
- Password reset with OTP
- Secure session management

✅ **Product Management**
- Create, read, update, delete products
- Search & filter products
- Pagination
- Stock status tracking

✅ **Analytics**
- 4 interactive charts
- Real-time data updates
- Product statistics
- Visual insights

✅ **User Experience**
- Responsive design
- Loading states
- Error messages
- Confirmation dialogs

✅ **Security**
- Password hashing (Bcrypt)
- CSRF protection
- SQL injection prevention
- Server-side validation

## Next Steps

### Development
1. Add more chart types
2. Implement product images
3. Add bulk operations
4. Create admin features
5. Build mobile app

### Deployment
1. Deploy to Vercel
2. Set up custom domain
3. Add SSL certificate
4. Configure monitoring
5. Setup backups

### Learning
- Read [README.md](README.md) for full documentation
- Read [API.md](API.md) for API details
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Explore code in `/app` and `/components`

## Troubleshooting

### "Invalid email or password"
- Check email/password are correct
- Try creating new account
- Check database has users

### Redirect loop
- Clear browser cookies
- Close and reopen browser
- Check NEXTAUTH_SECRET in .env.local

### Charts not showing
- Go to Analytics tab
- Add at least one product
- Charts appear automatically

### Can't send OTP emails
- Check SMTP credentials
- Verify Gmail app password (not main password)
- Check spam folder

## Getting Help

1. **Check logs**:
   ```
   Terminal showing "npm run dev" output
   Browser console (F12 → Console tab)
   Network tab (F12 → Network tab)
   ```

2. **Read documentation**:
   - [README.md](README.md) - Full guide
   - [API.md](API.md) - API documentation
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

3. **Verify setup**:
   ```bash
   # Check Node version
   node --version  # Should be 18+
   
   # Check npm packages
   npm list next react prisma
   
   # Test database
   psql $DATABASE_URL -c "SELECT 1"
   ```

4. **Common fixes**:
   - Delete `node_modules` and `.next` folders
   - Run `npm install` again
   - Restart dev server
   - Clear browser cache

## Performance Tips

- Products load 10 per page (for speed)
- Search is case-insensitive
- Charts update after each product change
- Database indexes optimize queries
- Tailwind CSS tree-shakes unused styles

## Security Checklist

Before deploying to production:

- [ ] Change NEXTAUTH_SECRET to strong random string
- [ ] Set DATABASE_URL to production database
- [ ] Configure NEXTAUTH_URL to your domain
- [ ] Add Google OAuth credentials
- [ ] Setup email (Gmail + App Password)
- [ ] Enable HTTPS in production
- [ ] Setup database backups
- [ ] Monitor error logs
- [ ] Test all auth flows
- [ ] Verify password reset works

## Files You'll Edit Most

- `app/dashboard/page.tsx` - Main dashboard
- `app/auth/*` - Login/signup pages
- `components/*` - UI components
- `lib/validation.ts` - Input validation rules
- `prisma/schema.prisma` - Database schema

Enjoy building! 🚀
