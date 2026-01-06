# 📂 Complete Project Structure

## File Organization

```
product-dashboard/
│
├── 📄 00_START_HERE.md              ← Read this first!
├── 📄 QUICKSTART.md                 ← 5-minute setup guide
├── 📄 INDEX.md                      ← Project overview
├── 📄 README.md                     ← Full documentation
├── 📄 API.md                        ← API endpoints reference
├── 📄 DEPLOYMENT.md                 ← Production deployment
├── 📄 ENVIRONMENT_SETUP.md          ← Database & env setup
├── 📄 DELIVERABLES.md               ← Completeness checklist
│
├── 🔧 Configuration Files
│   ├── package.json                 ← Dependencies
│   ├── tsconfig.json                ← TypeScript config
│   ├── next.config.js               ← Next.js config
│   ├── tailwind.config.ts           ← Tailwind config
│   ├── postcss.config.js            ← PostCSS config
│   └── .env.local.example           ← Environment template
│
├── 🛡️ Middleware & Auth
│   └── middleware.ts                ← Route protection middleware
│
├── 📁 app/                          ← Next.js App Router
│   │
│   ├── 🔐 auth/                     ← Authentication pages
│   │   ├── layout.tsx               ← Auth layout wrapper
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx             ← Login page
│   │   │
│   │   ├── signup/
│   │   │   └── page.tsx             ← Signup page
│   │   │
│   │   ├── forgot-password/
│   │   │   └── page.tsx             ← Password reset page
│   │   │
│   │   └── error/
│   │       └── page.tsx             ← Auth error page
│   │
│   ├── 📊 dashboard/                ← Main dashboard
│   │   └── page.tsx                 ← Dashboard (products + analytics)
│   │
│   ├── 🔌 api/                      ← API endpoints
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts         ← NextAuth handler
│   │       ├── signup/
│   │       │   └── route.ts         ← Registration API
│   │       ├── forgot-password/
│   │       │   └── route.ts         ← OTP request API
│   │       └── verify-otp/
│   │           └── route.ts         ← Password reset API
│   │
│   ├── ⚡ actions/                  ← Server actions
│   │   └── products.ts              ← Product CRUD operations
│   │
│   ├── layout.tsx                   ← Root layout
│   ├── page.tsx                     ← Root redirect page
│   └── globals.css                  ← Global styles
│
├── 🧩 components/                   ← Reusable components
│   ├── ProductForm.tsx              ← Add/edit product form
│   ├── ProductTable.tsx             ← Products table display
│   └── Charts.tsx                   ← Analytics charts
│
├── 📚 lib/                          ← Utilities & libraries
│   ├── auth.ts                      ← NextAuth configuration
│   ├── prisma.ts                    ← Prisma client singleton
│   ├── password.ts                  ← Password hashing utilities
│   ├── otp.ts                       ← OTP generation & verification
│   ├── email.ts                     ← Email sending service
│   └── validation.ts                ← Zod validation schemas
│
├── 🗄️ prisma/                       ← Database
│   └── schema.prisma                ← Database models
│
└── .gitignore                       ← Git ignore rules
```

---

## Component Hierarchy

```
Root (app/layout.tsx)
├── Auth Routes (middleware protected)
│   └── auth/layout.tsx
│       ├── login/page.tsx
│       ├── signup/page.tsx
│       ├── forgot-password/page.tsx
│       └── error/page.tsx
│
├── Dashboard Routes (session required)
│   └── dashboard/page.tsx
│       ├── ProductForm.tsx
│       │   └── Form inputs & validation
│       ├── ProductTable.tsx
│       │   ├── Table display
│       │   └── Edit/Delete buttons
│       └── DashboardCharts.tsx
│           ├── CategoryChart (Bar)
│           ├── StockChart (Pie)
│           ├── PriceDistributionChart (Bar)
│           └── TimelineChart (Line)
│
└── API Routes
    └── /api/auth
        ├── [...nextauth]
        ├── /signup
        ├── /forgot-password
        └── /verify-otp
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  Components (ProductForm, ProductTable, Charts)         │
│  + State Management (useState, useEffect)               │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVER LAYER                          │
│  ✓ Next.js Server Components                           │
│  ✓ Server Actions (app/actions/products.ts)            │
│  ✓ API Routes (app/api/auth/*)                         │
│  ✓ NextAuth Configuration                              │
│  ✓ Middleware (route protection)                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   ORM LAYER                             │
│  Prisma Client → Database Queries                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                        │
│  PostgreSQL                                             │
│  ├── User (authentication)                              │
│  ├── Product (inventory)                                │
│  └── OTPToken (password reset)                          │
└─────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Paths

```
/auth/login
    ↓
[User enters email/password]
    ↓
POST /api/auth/signin (NextAuth)
    ↓
getServerSession validates → Dashboard ✓
                           → Error page ✗

/auth/signup
    ↓
[User fills form]
    ↓
POST /api/auth/signup (registration)
    ↓
User created → Auto-login → Dashboard ✓
                                       
/auth/forgot-password
    ↓
[User enters email]
    ↓
POST /api/auth/forgot-password
    ↓
[OTP sent to email]
    ↓
[User enters OTP + password]
    ↓
POST /api/auth/verify-otp
    ↓
Password updated → Redirect to login ✓
```

---

## Database Schema Relationships

```
User (1) ──── (M) Product
│
└──── (M) OTPToken


User
├── id: String (PK)
├── name: String
├── email: String (UNIQUE)
├── password: String (nullable)
├── role: String
├── createdAt: DateTime
├── updatedAt: DateTime
├── products: Product[] (relation)
└── otpTokens: OTPToken[] (relation)

Product
├── id: String (PK)
├── name: String
├── category: String
├── price: Float
├── stock: Int
├── status: String
├── userId: String (FK)
├── user: User (relation)
├── createdAt: DateTime
└── updatedAt: DateTime

OTPToken
├── id: String (PK)
├── email: String
├── otp: String
├── expiresAt: DateTime
├── userId: String (FK, nullable)
├── user: User (relation)
└── createdAt: DateTime
```

---

## Server Actions Call Flow

```
Client Component (e.g., dashboard/page.tsx)
    ↓
imports { getProducts, createProduct, ... } from '@/app/actions/products'
    ↓
const result = await getProducts(page, limit, search, category)
    ↓
Server-side execution (lib/prisma.ts)
    ↓
getServerSession(authOptions) → userId validation
    ↓
prisma.product.findMany({where: {userId: session.user.id}})
    ↓
PostgreSQL query returns results
    ↓
Result sent back to client
    ↓
Component state updated → UI re-renders
```

---

## API Endpoint Routes

```
Authentication Endpoints:
├── POST /api/auth/signin              [NextAuth Credentials]
├── POST /api/auth/signout             [Logout]
├── GET  /api/auth/session             [Get session]
├── POST /api/auth/callback/google     [OAuth callback]
├── POST /api/auth/signup              [Registration]
├── POST /api/auth/forgot-password     [OTP request]
└── POST /api/auth/verify-otp          [Password reset]

Product Operations (Server Actions):
├── getProducts()                      [List with filters]
├── createProduct()                    [Add product]
├── updateProduct()                    [Edit product]
├── deleteProduct()                    [Remove product]
└── getProductStats()                  [Analytics data]

Dashboard Pages:
├── GET /                              [Root → redirect]
├── GET /auth/login                    [Login page]
├── GET /auth/signup                   [Signup page]
├── GET /auth/forgot-password          [Password reset]
└── GET /dashboard                     [Main app]
```

---

## Key Technology Connections

```
Next.js App Router
├── React 19 Components
├── Server Components (auth pages)
├── Client Components (dashboard)
└── Server Actions

NextAuth v4
├── Credentials Provider
├── Google OAuth Provider
├── JWT Sessions
└── Middleware

Prisma ORM
├── PostgreSQL Connection
├── Schema Models
├── Type-safe Queries
└── Client Generation

Tailwind CSS
├── Responsive Design
├── Component Styling
├── Custom Config
└── CSS Optimization

Recharts
├── Bar Charts
├── Pie Charts
└── Line Charts
```

---

## File Responsibilities

### Authentication Files
| File | Responsibility |
|------|---|
| `middleware.ts` | Protect routes, redirect auth flows |
| `lib/auth.ts` | NextAuth config, providers |
| `app/auth/login/page.tsx` | User login form |
| `app/auth/signup/page.tsx` | User registration |
| `app/auth/forgot-password/page.tsx` | Password reset flow |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth endpoints |
| `app/api/auth/signup/route.ts` | Registration API |
| `app/api/auth/forgot-password/route.ts` | OTP request |
| `app/api/auth/verify-otp/route.ts` | OTP verification |

### Product Management Files
| File | Responsibility |
|------|---|
| `app/actions/products.ts` | Server actions for CRUD |
| `app/dashboard/page.tsx` | Dashboard UI |
| `components/ProductForm.tsx` | Product form component |
| `components/ProductTable.tsx` | Product table display |
| `lib/validation.ts` | Input validation schemas |

### Database Files
| File | Responsibility |
|------|---|
| `prisma/schema.prisma` | Database schema definition |
| `lib/prisma.ts` | Prisma client instance |

### Utility Files
| File | Responsibility |
|------|---|
| `lib/password.ts` | Password hashing |
| `lib/otp.ts` | OTP generation/verification |
| `lib/email.ts` | Email sending |
| `lib/validation.ts` | Input validation |

### Configuration Files
| File | Responsibility |
|------|---|
| `package.json` | Dependencies |
| `tsconfig.json` | TypeScript config |
| `next.config.js` | Next.js config |
| `tailwind.config.ts` | Tailwind setup |
| `postcss.config.js` | PostCSS setup |

---

## Recommended File Reading Order

### For Understanding Auth
1. `middleware.ts` → Route protection
2. `lib/auth.ts` → Auth configuration
3. `app/auth/login/page.tsx` → Login flow
4. `app/api/auth/[...nextauth]/route.ts` → NextAuth handler

### For Understanding Products
1. `app/actions/products.ts` → Business logic
2. `app/dashboard/page.tsx` → UI & state
3. `components/ProductForm.tsx` → Form handling
4. `components/ProductTable.tsx` → Display

### For Understanding Database
1. `prisma/schema.prisma` → Data structure
2. `lib/prisma.ts` → Client setup
3. `lib/validation.ts` → Input rules

---

## Development Workflow

```
1. Create/edit files in /app or /components
2. TypeScript compiler checks syntax
3. Tailwind CSS compiles styles
4. Next.js hot-reloads changes
5. Browser auto-refreshes
6. See changes immediately
```

---

## Production Build Structure

```
Build Process:
1. npm run build
2. TypeScript compilation
3. Tailwind CSS purging
4. Next.js optimization
5. Static export where possible

Output:
.next/
├── static/          [CSS, JS bundles]
├── server/          [Server components]
└── cache/           [Build cache]

Deployment:
npm run start
→ Runs optimized server
→ Serves on port 3000
```

---

This structure is **production-ready** and follows Next.js best practices!
