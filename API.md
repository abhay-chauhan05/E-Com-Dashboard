# API Documentation

## Authentication Endpoints

### POST /api/auth/[...nextauth]

NextAuth endpoints for session management.

**Endpoints**:
- `POST /api/auth/signin` - Trigger login (redirect-based)
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/providers` - List available providers
- `POST /api/auth/callback/:provider` - OAuth callback

**Example Usage**:
```typescript
import { signIn, signOut } from 'next-auth/react'

// Login with credentials
await signIn('credentials', {
  email: 'user@example.com',
  password: 'password123',
})

// Login with Google
await signIn('google')

// Logout
await signOut()
```

---

### POST /api/auth/signup

Register a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Validation Rules**:
- `name`: Min 2 characters
- `email`: Valid email format, unique
- `password`: Min 8 characters
- `confirmPassword`: Must match password

**Response (201 Created)**:
```json
{
  "message": "User created successfully",
  "userId": "user_id_here"
}
```

**Error Responses**:
```json
// 400 Bad Request
{
  "error": "Email already in use"
}

// 400 Validation Error
{
  "error": [
    {
      "code": "too_small",
      "minimum": 8,
      "type": "string",
      "path": ["password"],
      "message": "String must contain at least 8 character(s)"
    }
  ]
}

// 500 Server Error
{
  "error": "Internal server error"
}
```

---

### POST /api/auth/forgot-password

Request password reset OTP.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK)**:
```json
{
  "message": "If an account with this email exists, an OTP has been sent"
}
```

**Details**:
- Returns success regardless of email existence (security best practice)
- OTP sent via email if account exists
- OTP valid for 10 minutes

---

### POST /api/auth/verify-otp

Verify OTP and reset password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Validation Rules**:
- `otp`: Exactly 6 digits
- `newPassword`: Min 8 characters

**Response (200 OK)**:
```json
{
  "message": "Password reset successful"
}
```

**Error Responses**:
```json
// 400 Invalid OTP
{
  "error": "Invalid or expired OTP"
}

// 400 Validation Error
{
  "error": "OTP must be 6 digits"
}
```

---

## Product Operations (Server Actions)

Server Actions are called directly from client components.

### getProducts()

Fetch paginated products with filtering.

**Parameters**:
```typescript
getProducts(
  page?: number          // Default: 1
  limit?: number         // Default: 10
  search?: string        // Filter by product name
  category?: string      // Filter by category
  minPrice?: number      // Minimum price filter
  maxPrice?: number      // Maximum price filter
  inStock?: boolean      // Filter by stock status
)
```

**Returns**:
```typescript
{
  products: Product[]    // Array of products
  total: number         // Total products matching filters
  pages: number         // Total pages
  currentPage: number   // Current page number
}
```

**Example**:
```typescript
// Get page 2, search for "laptop", filter by Electronics
const result = await getProducts(2, 10, 'laptop', 'Electronics')
```

**Error Handling**:
```typescript
try {
  const result = await getProducts()
} catch (error) {
  // Throws "Unauthorized" if not authenticated
  // Throws validation errors from Prisma
}
```

---

### createProduct(data)

Add a new product to the database.

**Parameters**:
```typescript
{
  name: string       // Product name (required)
  category: string   // Product category (required)
  price: number      // Product price in USD (required, positive)
  stock: number      // Inventory quantity (required, non-negative)
}
```

**Returns**:
```typescript
{
  id: string        // Unique product ID
  name: string
  category: string
  price: number
  stock: number
  status: string    // "in_stock" or "out_of_stock"
  userId: string    // Owner's user ID
  createdAt: Date
  updatedAt: Date
}
```

**Example**:
```typescript
const product = await createProduct({
  name: 'Wireless Mouse',
  category: 'Electronics',
  price: 29.99,
  stock: 100
})
```

**Auto-Status**:
- Stock > 0 → status: "in_stock"
- Stock = 0 → status: "out_of_stock"

---

### updateProduct(id, data)

Modify an existing product.

**Parameters**:
```typescript
id: string           // Product ID
data: {
  name?: string     // Partial update allowed
  category?: string
  price?: number
  stock?: number
}
```

**Returns**: Updated Product object

**Example**:
```typescript
// Update only stock
await updateProduct('product_id', { stock: 50 })

// Update multiple fields
await updateProduct('product_id', {
  name: 'Updated Name',
  price: 39.99
})
```

**Ownership Validation**:
- Only product owner can update
- Throws "Unauthorized" if not owner

**Auto-Status Update**:
- Stock updated → Status auto-updated

---

### deleteProduct(id)

Remove a product from the database.

**Parameters**:
```typescript
id: string  // Product ID
```

**Returns**:
```typescript
{
  success: boolean  // true if deleted
}
```

**Example**:
```typescript
await deleteProduct('product_id')
```

**Ownership Validation**:
- Only product owner can delete
- Throws "Unauthorized" if not owner

---

### getProductStats()

Get analytics data for all user's products.

**Parameters**: None

**Returns**:
```typescript
{
  // Products grouped by category
  categoryStats: [
    { category: string, count: number }
  ]
  
  // Stock summary
  stockAvailability: {
    inStock: number
    outOfStock: number
  }
  
  // Products in price ranges
  priceDistribution: {
    "0-100": number
    "100-500": number
    "500-1000": number
    "1000+": number
  }
  
  // Products added per day (last 30 days)
  productsOverTime: [
    { date: string, count: number }  // YYYY-MM-DD format
  ]
  
  totalProducts: number
}
```

**Example**:
```typescript
const stats = await getProductStats()
// Use for charts:
// - categoryStats → Bar chart
// - stockAvailability → Pie chart
// - priceDistribution → Bar chart
// - productsOverTime → Line chart
```

**Real-time Updates**:
- Call after creating/updating/deleting products
- Charts automatically re-render

---

## Authentication Flow Diagrams

### Credentials Login Flow
```
User → Login Page
  ↓
User enters email/password
  ↓
POST /api/auth/signin with credentials
  ↓
NextAuth Credentials Provider
  ↓
Query User from database
  ↓
Verify password with Bcrypt
  ↓
Generate JWT token
  ↓
Redirect to /dashboard
  ↓
getServerSession validates token
  ↓
Dashboard loads with user data
```

### Forgot Password Flow
```
User → Login Page
  ↓
Click "Forgot Password"
  ↓
→ /auth/forgot-password
  ↓
Enter email
  ↓
POST /api/auth/forgot-password
  ↓
Generate 6-digit OTP (10 min expiry)
  ↓
Send OTP via email
  ↓
User receives email with OTP
  ↓
Enter OTP + new password
  ↓
POST /api/auth/verify-otp
  ↓
Verify OTP and update password
  ↓
Redirect to /auth/login
  ↓
User can now login with new password
```

### Google OAuth Flow
```
User → Login Page
  ↓
Click "Continue with Google"
  ↓
Redirect to Google OAuth screen
  ↓
User authenticates with Google
  ↓
User grants permissions
  ↓
Google redirects to /api/auth/callback/google
  ↓
NextAuth processes Google response
  ↓
Check if user exists by email
  ↓
If exists: Login (no account created)
If not exists: Create new account + Login
  ↓
Generate JWT token
  ↓
Redirect to /dashboard
```

---

## Error Codes & Messages

### 401 Unauthorized
```
"Unauthorized" - User not logged in
- Missing session
- Invalid token
- Session expired
```

### 400 Bad Request
```
"Invalid email or password" - Wrong credentials
"Email already in use" - Email exists
"Invalid or expired OTP" - OTP verification failed
"Passwords don't match" - Password mismatch
```

### 404 Not Found
```
Product not found - Invalid product ID
```

### 500 Internal Server Error
```
Database connection error
Email sending failure
Unexpected server error
```

---

## Client-Side Usage Examples

### Using signIn (Credentials)
```typescript
'use client'

import { signIn } from 'next-auth/react'

export function LoginForm() {
  const handleLogin = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,  // Manual redirect handling
    })

    if (result?.ok) {
      // Navigate to dashboard
      window.location.href = '/dashboard'
    } else {
      // Show error
      alert(result?.error)
    }
  }
}
```

### Using Server Actions
```typescript
'use client'

import { createProduct } from '@/app/actions/products'

export function AddProductForm() {
  const handleSubmit = async (formData: ProductInput) => {
    try {
      const product = await createProduct(formData)
      // Refresh product list
      window.location.reload()
    } catch (error) {
      alert(error.message)
    }
  }
}
```

### Using API Routes (Direct)
```typescript
// Sign up via API
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  })
})

const data = await response.json()
if (response.ok) {
  // User created, redirect to login
} else {
  // Show error
}
```

---

## Rate Limits (Recommended for Production)

Add to `lib/rateLimit.ts`:

```typescript
// Max 10 login attempts per hour per IP
// Max 5 signup attempts per hour per email
// Max 100 product operations per hour per user
```

Implement before deploying to production.

---

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Never expose secrets in client code
3. ✅ Validate all inputs server-side
4. ✅ Use secure session handling (JWT + HTTP-only cookies)
5. ✅ Hash passwords with Bcrypt
6. ✅ Implement CSRF protection (NextAuth included)
7. ✅ Use parameterized queries (Prisma)
8. ✅ Check user authorization (server actions)
9. ✅ Log security events
10. ✅ Regular security updates

