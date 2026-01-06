# Product Dashboard - Full-Stack Application

A production-ready full-stack Product Dashboard built with Next.js, React, Prisma ORM, and PostgreSQL.

## Features

### 🔐 Authentication System
- **Credentials Authentication**: Email/password login and signup
- **Google OAuth Integration**: One-click login with Google (auto-create accounts)
- **Forgot Password Flow**: OTP-based password reset with email verification
- **Secure Session Management**: NextAuth v4 with JWT tokens
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Password Security**: Bcrypt hashing with 12 salt rounds

### 📦 Product Management
- **CRUD Operations**: Create, read, update, delete products
- **Stock Management**: Track inventory levels and status
- **Categorization**: Organize products by category
- **Price Management**: Set and modify product pricing
- **Search & Filtering**: Find products by name, category, price range
- **Pagination**: Handle large product lists efficiently

### 📊 Analytics & Visualization
- **Category Distribution**: Bar chart showing products per category
- **Stock Availability**: Pie chart for in-stock vs out-of-stock
- **Price Distribution**: Bar chart for price range analysis
- **Timeline Analytics**: Line chart for products added over 30 days
- **Real-time Updates**: Charts refresh when products change

### 🎨 User Interface
- **Responsive Design**: Mobile-first Tailwind CSS styling
- **Clean Dashboard**: Intuitive product management interface
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Confirmation Dialogs**: Safety for destructive actions
- **Empty States**: Helpful messages for new users

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth v4
- **Database**: PostgreSQL (Prisma ORM)
- **Charts**: Recharts
- **Validation**: Zod
- **Security**: Bcrypt for password hashing
- **Email**: Nodemailer (for OTP delivery)

## Project Structure

```
product-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts      # NextAuth configuration
│   │   │   ├── signup/route.ts             # User registration API
│   │   │   ├── forgot-password/route.ts    # Password reset initiation
│   │   │   └── verify-otp/route.ts         # OTP verification
│   ├── auth/
│   │   ├── layout.tsx                      # Auth pages layout
│   │   ├── login/page.tsx                  # Login page
│   │   ├── signup/page.tsx                 # Signup page
│   │   ├── forgot-password/page.tsx        # Password reset page
│   │   └── error/page.tsx                  # Auth error page
│   ├── dashboard/
│   │   └── page.tsx                        # Main dashboard
│   ├── actions/
│   │   └── products.ts                     # Server actions for products
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Root redirect
│   └── globals.css                         # Global styles
├── components/
│   ├── ProductForm.tsx                     # Product form component
│   ├── ProductTable.tsx                    # Products table with actions
│   └── Charts.tsx                          # Chart components
├── lib/
│   ├── auth.ts                             # NextAuth configuration
│   ├── prisma.ts                           # Prisma client singleton
│   ├── password.ts                         # Password hashing utilities
│   ├── otp.ts                              # OTP generation & verification
│   ├── email.ts                            # Email sending service
│   └── validation.ts                       # Input validation schemas
├── prisma/
│   └── schema.prisma                       # Database schema
├── middleware.ts                           # Auth middleware
├── next.config.js                          # Next.js configuration
├── tailwind.config.ts                      # Tailwind configuration
├── postcss.config.js                       # PostCSS configuration
├── tsconfig.json                           # TypeScript configuration
└── package.json                            # Dependencies

```

## Authentication Flow

### Login Flow
1. User enters credentials on `/auth/login`
2. Credentials sent to NextAuth Credentials Provider
3. Bcrypt verifies password against database
4. Session created with JWT token
5. User redirected to `/dashboard`

### Signup Flow
1. User fills form on `/auth/signup`
2. Data validated with Zod schema
3. Password hashed with Bcrypt
4. User created in database
5. Auto-login with credentials
6. Redirect to `/dashboard`

### Password Reset Flow
1. User clicks "Forgot Password" on `/auth/login`
2. Enters email on `/auth/forgot-password`
3. OTP generated and sent via email
4. User enters OTP and new password
5. Password updated in database
6. Redirected to login

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google OAuth screen
3. User grants permissions
4. If user exists → Login
5. If user doesn't exist → Auto-create account
6. Session created and redirected to `/dashboard`

## Database Schema

### User Model
```prisma
model User {
  id        String      @id @default(cuid())
  name      String
  email     String      @unique
  password  String?     // Nullable for Google OAuth users
  role      String      @default("user")
  products  Product[]   // One-to-many relation
  otpTokens OTPToken[]  // One-to-many relation
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}
```

### Product Model
```prisma
model Product {
  id        String   @id @default(cuid())
  name      String
  category  String
  price     Float
  stock     Int
  status    String   @default("in_stock")
  userId    String   // Foreign key
  user      User     @relation(fields: [userId])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### OTPToken Model
```prisma
model OTPToken {
  id        String   @id @default(cuid())
  email     String
  otp       String
  expiresAt DateTime // 10 minute expiry
  userId    String?  // Optional reference to user
  user      User?    @relation(fields: [userId])
  createdAt DateTime @default(now())
}
```

## Installation & Setup

### 1. Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or Neon)
- Google OAuth credentials (for social login)
- Gmail app password (for OTP emails)

### 2. Environment Setup

```bash
# Clone or extract project
cd product-dashboard

# Install dependencies
npm install

# Create .env.local from example
cp .env.local.example .env.local

# Edit .env.local with your values
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000 for development)
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
# - SMTP credentials for email
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Create database and tables
npm run prisma:migrate

# Optional: Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Run Application

```bash
# Development server
npm run dev

# Open http://localhost:3000 in browser
# You'll be redirected to login
```

## Usage Examples

### Creating a New Product
1. Login to dashboard
2. Click "Add Product" button
3. Fill in product details:
   - Name: "Wireless Headphones"
   - Category: "Electronics"
   - Price: 79.99
   - Stock: 15
4. Click "Add Product"
5. Product appears in table

### Searching Products
1. In dashboard, use search bar at top
2. Type product name (case-insensitive)
3. Results filter automatically
4. Or select category filter

### Viewing Analytics
1. Click "Analytics" tab
2. See four charts:
   - Products by category (bar)
   - Stock availability (pie)
   - Price distribution (bar)
   - Products added timeline (line)
3. Charts update automatically when products change

### Resetting Password
1. Click "Forgot Password" on login page
2. Enter registered email
3. Check email for OTP
4. Enter OTP and new password
5. Password updated and can login with new password

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/verify-otp` - Reset password with OTP

### Product Operations (via Server Actions)
- `getProducts()` - Fetch user's products with pagination/filters
- `createProduct()` - Add new product
- `updateProduct()` - Modify existing product
- `deleteProduct()` - Remove product
- `getProductStats()` - Get analytics data

## Security Considerations

✅ **Implemented Security Measures**:
- Password hashing with Bcrypt (12 rounds)
- NextAuth v4 JWT session tokens
- Server-side session validation
- Protected API routes with `getServerSession`
- CSRF protection via NextAuth
- SQL injection prevention (Prisma parameterized queries)
- Input validation with Zod schemas
- OTP expiration (10 minutes)
- Secure password reset flow
- Google OAuth only accepts users with valid tokens

⚠️ **Production Checklist**:
- [ ] Set `NEXTAUTH_SECRET` to long random string
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Set up database backups
- [ ] Monitor failed login attempts
- [ ] Configure CORS if APIs are called externally
- [ ] Use Neon or managed PostgreSQL service
- [ ] Add rate limiting to auth endpoints
- [ ] Enable database connection pooling

## Error Handling

### Auth Errors
- Invalid email/password → "Invalid email or password"
- Email already exists → "Email already in use"
- Expired OTP → "Invalid or expired OTP"
- Passwords don't match → "Passwords don't match"

### Product Errors
- Unauthorized access → 401 Unauthorized
- Product not found → 404 Not Found
- Validation failed → 400 Bad Request
- Server error → 500 Internal Server Error

### Network Errors
- All forms show loading states
- API failures display error messages
- Retry functionality available

## Performance Optimizations

- **Server Components**: Auth pages and dashboard use server-side rendering
- **Server Actions**: Direct database mutations without API layer
- **Pagination**: Products loaded 10 at a time
- **Database Indexes**: userId and category fields indexed
- **Image Optimization**: Uses Next.js Image component
- **CSS Optimization**: Tailwind purges unused styles
- **Code Splitting**: Dynamic imports for charts

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Deploy on Vercel dashboard
# 1. Connect GitHub repo
# 2. Add environment variables
# 3. Deploy

# Automatic deployments on push
```

### Deploy to Other Platforms

**Ensure**:
1. Node.js 18+ runtime
2. Environment variables set
3. PostgreSQL accessible
4. Build completes: `npm run build`
5. Start command: `npm run start`

## Troubleshooting

### Login fails with "Invalid email or password"
- Check email exists and is correct
- Verify password (case-sensitive)
- Check database connection

### Google OAuth not working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check redirect URI matches Google Console settings
- Ensure cookies enabled in browser

### OTP not received
- Check email credentials in `.env.local`
- Verify Gmail app password (not main password)
- Check spam folder

### Products not loading
- Verify database connection
- Run `npm run prisma:migrate`
- Check user ID in session

### Charts not displaying
- Ensure Recharts is installed: `npm install recharts`
- Check browser console for errors
- Verify product data exists

## Future Enhancements

- [ ] Batch product operations
- [ ] Product images/gallery
- [ ] Inventory alerts
- [ ] User roles & permissions
- [ ] Bulk import/export (CSV)
- [ ] Advanced filtering and sorting
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] Audit logs
- [ ] Dark mode
- [ ] Mobile app

## License

Private project

## Support

For issues or questions, contact development team.
