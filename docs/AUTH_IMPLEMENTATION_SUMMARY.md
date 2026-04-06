# TransferX Authentication Implementation Summary

## 📋 Overview
TransferX has a complete JWT-based authentication system with support for multiple user roles. The system is implemented with secure password hashing, token-based authorization, and comprehensive input validation.

---

## 1. BACKEND AUTHENTICATION LOGIC

### 📁 Location: `transferx-backend/lib/auth.js`

**Current Implementation:**
- ✅ `generateToken(userId, role, email, expiresIn = '7d')` - Creates JWT tokens with user claims
- ✅ `verifyToken(token)` - Validates and decodes JWT tokens
- ✅ `extractToken(authHeader)` - Extracts Bearer token from Authorization header

**Configuration:**
```javascript
JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
Default Expiry: 7 days
Admin Expiry: 8 hours (shorter for security)
```

**Status:** ✅ Complete and functional
**Security Notes:**
- Uses bcryptjs for password hashing
- JWT secret should be set in environment variables (currently has fallback)
- Token payload includes: userId, role, email

---

## 2. BACKEND API ENDPOINTS

### Authentication Endpoints

#### 📍 POST `/api/auth/signup`
**File:** `transferx-backend/app/api/auth/signup/route.js`

**Features:**
- ✅ User registration with email, password, fullName
- ✅ Supports role selection (PLAYER, AGENT, CLUB_MANAGER)
- ✅ Auto-creates associated profile based on role:
  - **PLAYER**: Creates PlayerProfile with default position
  - **AGENT**: Creates AgentProfile with auto-generated license number
  - **CLUB_MANAGER**: Account created (no auto-profile)
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Prevents duplicate email registration
- ✅ Returns JWT token on success (status 201)

**Input Validation:**
```javascript
signupSchema validates:
- email: Must be valid email without HTML/script chars
- password: Minimum 6 characters
- fullName: Minimum 2 characters, no HTML/script chars
- role: Optional, one of PLAYER, AGENT, CLUB_MANAGER
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "role": "PLAYER",
    "user": {
      "id": 1,
      "email": "player@example.com",
      "fullName": "John Doe",
      "name": "John Doe",
      "role": "PLAYER",
      "created_at": "2024-03-30T..."
    }
  }
}
```

---

#### 📍 POST `/api/auth/login`
**File:** `transferx-backend/app/api/auth/login/route.js`

**Features:**
- ✅ User login with email and password
- ✅ Case-insensitive email lookup
- ✅ Bcrypt password comparison
- ✅ Includes related profiles (playerProfile, agentProfile)
- ✅ Returns JWT token on success (status 200)
- ✅ Generic error messages (prevents email enumeration)

**Input Validation:**
```javascript
loginSchema validates:
- email: Valid email format, no HTML/script chars
- password: Required, minimum 1 character
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "role": "PLAYER",
    "user": {
      "name": "John Doe",
      "email": "player@example.com",
      "id": 1,
      "playerProfile": {...},
      "agentProfile": null
    }
  }
}
```

---

#### 📍 POST `/api/auth/admin-login`
**File:** `transferx-backend/app/api/auth/admin-login/route.js`

**Features:**
- ✅ Admin-only authentication endpoint
- ✅ Role verification (must have role: "ADMIN")
- ✅ Returns token with 8-hour expiry (shorter for security)
- ✅ Same validation as regular login

**Status:** ✅ Fully implemented
**Security:** Denies access if user exists but is not ADMIN role

---

#### 📍 GET `/api/user/me`
**File:** `transferx-backend/app/api/user/me/route.js`

**Features:**
- ✅ Requires authentication (Bearer token)
- ✅ Returns current user profile with all relationships
- ✅ Includes nested data:
  - playerProfile with currentClub and league info
  - agentProfile
  - managedClub (for club managers)
- ✅ Password excluded from response

**Example Request:**
```bash
curl http://localhost:3001/api/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 📍 PUT `/api/user/me`
**File:** `transferx-backend/app/api/user/me/route.js`

**Features:**
- ✅ Requires authentication
- ✅ Update fullName
- ✅ Update player profile if user is PLAYER role
- ✅ Upsert pattern (creates if doesn't exist)
- ✅ Converts dateOfBirth string to Date object

**Updatable Fields:**
```javascript
// User level
{ fullName: "New Name" }

// Player Profile (if PLAYER role)
{
  playerProfile: {
    position: "MIDFIELDER",
    nationality: "Nigeria",
    dateOfBirth: "2000-01-15",
    height: 1.85,
    weight: 75,
    preferredFoot: "right",
    currentClubId: 1,
    marketValue: 1000000,
    rating: 8.5,
    bio: "Professional footballer"
  }
}
```

---

## 3. DATABASE MODELS

### User Model
**File:** `transferx-backend/prisma/schema.prisma`

```javascript
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  password      String    // bcrypt hashed
  fullName      String?
  role          String    @default("PLAYER")  // PLAYER, AGENT, CLUB_MANAGER, ADMIN
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  playerProfile PlayerProfile?
  agentProfile  AgentProfile?
  
  // Indexes for performance
  @@index([email])
  @@index([role])
  @@map("User")
}
```

**Supported Roles:**
- `PLAYER` - Sports player
- `AGENT` - Player agent/representative
- `CLUB_MANAGER` - Club management personnel
- `ADMIN` - System administrator

---

### PlayerProfile Model
```javascript
model PlayerProfile {
  id              Int
  userId          Int       @unique
  position        String    // GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD
  nationality     String?
  dateOfBirth     DateTime?
  height          Float?
  weight          Float?
  preferredFoot   String?
  currentClubId   Int?
  marketValue     Float
  goalsScored     Int
  assists         Int
  appearances     Int
  rating          Float     // 0-10 scale
  bio             String?
  
  user            User
  currentClub     Club?
  @@map("PlayerProfile")
}
```

---

### AgentProfile Model
```javascript
model AgentProfile {
  id              Int
  userId          Int       @unique
  agency          String?
  licenseNumber   String?   // Auto-generated format: LIC-{timestamp}
  yearsExperience Int
  
  user            User
  @@map("AgentProfile")
}
```

---

## 4. FRONTEND AUTHENTICATION

### 📁 AuthContext (`transferx-frontend/src/context/AuthContext.jsx`)

**State Management:**
```javascript
{
  user: { name: string, email: string, ...other }
  role: "PLAYER" | "AGENT" | "CLUB_MANAGER" | "ADMIN" | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
}
```

**Functions:**
- ✅ `login(token, role, user)` - Sets auth state and persists to localStorage
- ✅ `logout()` - Clears auth state and localStorage
- ✅ `useAuth()` - Hook to access auth context

**LocalStorage Keys:**
- `transferx_token` - JWT token
- `transferx_role` - User role
- `transferx_user` - User object (JSON stringified)

**Session Persistence:**
- ✅ Auto-rehydrates on page reload
- ✅ Checks localStorage on component mount

---

### 📁 Axios Client Configuration
**File:** `transferx-frontend/src/api/axiosClient.js`

**Features:**
- ✅ Auto-attaches JWT token to all API requests
- ✅ Interceptor adds Bearer token to Authorization header
- ✅ Auto-logout on 401 responses
- ✅ Configurable base URL via .env (fallback to http://localhost:3001/api)

**Request Interceptor:**
```javascript
// Automatically adds token to every request
Authorization: Bearer {token}
```

**Response Interceptor:**
```javascript
// On 401: clears localStorage and redirects to /login
if (error.response?.status === 401) {
  // Clear auth data
  // Redirect to login page
}
```

---

## 5. FRONTEND PAGES

### 📍 Login/Register Page
**File:** `transferx-frontend/src/pages/auth/AuthPage.jsx`

**Features:**
- ✅ Tabbed interface for Sign In / Create Account
- ✅ Email and password fields with validation
- ✅ Password strength indicator
- ✅ Form validation before submission
- ✅ Error message display
- ✅ Success message and redirect after login/signup
- ✅ Auto-redirect based on role:
  - ADMIN → `/admin/dashboard`
  - PLAYER/AGENT → `/` (home)

**Validation:**
- Email format validation
- Password minimum 6 characters
- Name is required for signup
- Password confirmation for signup
- HTML/script sanitization

**User Feedback:**
- Toast notifications for errors
- Loading spinner during submission
- Success message before redirect
- Validation error messages

---

### 📍 Admin Login Page
**File:** `transferx-frontend/src/pages/auth/AdminLogin.jsx`

**Features:**
- ✅ Dedicated admin login interface
- ✅ Email and password fields
- ✅ "Authorized personnel only" warning banner
- ✅ Shield icon for security theme
- ✅ Redirects to `/admin/dashboard` on success

---

### 📍 Protected Route Component
**File:** `transferx-frontend/src/components/ProtectedRoute.jsx`

**Features:**
- ✅ Wraps routes requiring authentication
- ✅ Optional role checking (requiredRole parameter)
- ✅ Shows loading spinner while checking auth state
- ✅ Redirects unauthenticated users to `/login`
- ✅ Redirects unauthorized users to `/unauthorized`

**Usage Pattern:**
```jsx
<Route element={<ProtectedRoute requiredRole="ADMIN" />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Route>
```

---

## 6. MIDDLEWARE & SECURITY

### 📁 Authentication Middleware
**File:** `transferx-backend/lib/middleware.js`

**Functions:**

#### `requireAuth(request, requiredRole = null)`
- Verifies JWT token
- Optionally checks for specific role
- Returns 401 if no token or invalid token
- Returns 403 if role doesn't match
- Returns decoded user data on success

#### `requireAnyRole(request, allowedRoles = [])`
- Verifies JWT token
- Checks if user has one of multiple allowed roles
- Allows empty array (just requires authentication)

#### `getAuthUser(request)` - Optional Auth
- Returns user data if authenticated, null otherwise
- Never throws error

---

## 7. VALIDATION & SANITIZATION

### 📁 Backend Validation (`lib/validation.js`)

**Zod Schemas:**

```javascript
signupSchema: {
  email: Valid email, no HTML/script chars
  password: Min 6 characters
  fullName: Min 2 characters, no HTML/script chars
  role: Optional, one of PLAYER|AGENT|CLUB_MANAGER
}

loginSchema: {
  email: Valid email, no HTML/script chars
  password: Required
}

userUpdateSchema: {
  fullName: Optional
  playerProfile: Optional player data
}
```

**Security Rules:**
- Reject `<>` characters
- Reject encoded entities `&lt;` `&gt;`
- Email format validation
- Password length enforcement

---

### 📁 Frontend Validation (`src/utils/validators.js`)

**Functions:**
- ✅ `validateEmail(email)` - Format check
- ✅ `validateRequired(value, fieldName)` - Non-empty check
- ✅ `validatePassword(password)` - Min 6 chars
- ✅ `validateLoginForm(data)` - Login validation
- ✅ `validateSignupForm(data)` - Signup with password confirmation

---

### 📁 Frontend Sanitization (`src/utils/sanitize.js`)

**Functions:**
- ✅ `sanitizeHTML(html)` - Uses DOMPurify
- ✅ `sanitizeInput(input)` - Removes HTML tags
- ✅ `sanitizeEmail(email)` - Removes special chars, lowercases
- ✅ `sanitizeName(name)` - Removes special chars, normalizes spaces
- ✅ `sanitizePassword(password)` - Just trims (no char removal)
- ✅ `sanitizeURL(url)` - Validates HTTP(S) protocol only

---

## 8. CURRENT IMPLEMENTATION STATUS

### ✅ COMPLETED FEATURES
1. **JWT-based authentication** - Full token generation and verification
2. **Role-based access control** - PLAYER, AGENT, CLUB_MANAGER, ADMIN
3. **User registration** - With auto-profile creation
4. **User login** - Email/password authentication
5. **Admin login** - Separate endpoint with role verification
6. **Profile retrieval** - GET /api/user/me with full relations
7. **Profile updates** - PUT /api/user/me for user and player data
8. **Input validation** - Zod schemas on backend
9. **Input sanitization** - Both frontend and backend
10. **Protected routes** - Frontend ProtectedRoute component
11. **Auth middleware** - Backend access control
12. **Session persistence** - localStorage-based rehydration
13. **Auto-logout on 401** - Axios interceptor
14. **Password hashing** - bcryptjs with 10 rounds
15. **Token injection** - Axios automatically adds Bearer token

---

## 9. SECURITY ANALYSIS

### ✅ STRENGTHS
- JWT tokens with expiration
- Bcrypt password hashing
- XSS prevention through sanitization
- CORS headers (OPTIONS endpoints)
- Role-based access control
- Generic error messages (prevents enumeration)
- Shorter admin token expiry
- Password excluded from API responses

### ⚠️ POTENTIAL IMPROVEMENTS
1. **Environment Variables**: JWT_SECRET should always be in .env (not hardcoded fallback)
2. **HTTP Only Cookies**: Consider using HttpOnly cookies instead of localStorage for tokens
3. **CSRF Protection**: Add CSRF tokens for state-changing operations
4. **Rate Limiting**: Implement rate limiting on login/signup endpoints
5. **Email Verification**: Add email confirmation during signup
6. **Password Reset**: No password reset functionality yet
7. **Refresh Tokens**: No refresh token mechanism (tokens just expire)
8. **Login Audit Log**: No logging of login attempts
9. **Two-Factor Auth**: Not implemented
10. **Session Management**: No session revocation or multiple device management

---

## 10. CONFIG & ENVIRONMENT

### Required Environment Variables
```bash
JWT_SECRET=your-very-secret-key-change-this
DATABASE_URL=mssql://connection-string
VITE_API_BASE_URL=http://localhost:3001/api  # Frontend
```

### Default Values
- **JWT Expiry**: 7 days (users)
- **Admin Token Expiry**: 8 hours
- **Password Min Length**: 6 characters
- **API Base URL**: http://localhost:3001/api (fallback)

---

## 11. COMMON WORKFLOWS

### Signup Flow
```
1. User fills registration form
2. Frontend validates form
3. Frontend sanitizes input
4. POST /api/auth/signup with email, password, fullName
5. Backend validates input (Zod)
6. Backend checks for duplicate email
7. Backend hashes password
8. Backend creates User + Profile
9. Backend returns JWT token
10. Frontend stores token, role, user in localStorage
11. Frontend redirects to dashboard
```

### Login Flow
```
1. User enters email and password
2. Frontend validates form
3. Frontend sanitizes input
4. POST /api/auth/login with email, password
5. Backend validates input (Zod)
6. Backend finds user by email
7. Backend verifies password with bcrypt
8. Backend returns JWT token
9. Frontend stores token and redirects
10. All future requests include Authorization: Bearer {token}
```

### Protected Route Access
```
1. User navigates to /admin/dashboard
2. ProtectedRoute component checks auth state
3. If not authenticated → redirect to /login
4. If authenticated but wrong role → redirect to /unauthorized
5. If authenticated with correct role → render component
```

### API Request with Auth
```
1. Frontend makes API request via axiosClient
2. Axios interceptor adds: Authorization: Bearer {token}
3. Backend middleware extracts and verifies token
4. Backend includes decoded user in request
5. Route checks JWT and role as needed
6. Response returned or 401/403 error
7. If 401 → Axios interceptor clears localStorage and redirects
```

---

## 12. TESTING THE AUTHENTICATION

### Create a Test User
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testplayer@example.com",
    "password": "test123456",
    "fullName": "Test Player",
    "role": "PLAYER"
  }'
```

### Login and Get Token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testplayer@example.com",
    "password": "test123456"
  }'
```

### Access Protected Endpoint
```bash
curl http://localhost:3001/api/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:3001/api/user/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fullName": "Updated Name",
    "playerProfile": {
      "position": "MIDFIELDER",
      "nationality": "England"
    }
  }'
```

---

## 13. FILES REFERENCE

| Purpose | Location | Status |
|---------|----------|--------|
| JWT Utilities | `lib/auth.js` | ✅ Complete |
| Auth Middleware | `lib/middleware.js` | ✅ Complete |
| Input Validation | `lib/validation.js` | ✅ Complete |
| Login Endpoint | `app/api/auth/login/route.js` | ✅ Complete |
| Signup Endpoint | `app/api/auth/signup/route.js` | ✅ Complete |
| Admin Login | `app/api/auth/admin-login/route.js` | ✅ Complete |
| User Profile | `app/api/user/me/route.js` | ✅ Complete |
| Auth Context | `src/context/AuthContext.jsx` | ✅ Complete |
| Login/Signup Page | `src/pages/auth/AuthPage.jsx` | ✅ Complete |
| Admin Login Page | `src/pages/auth/AdminLogin.jsx` | ✅ Complete |
| Protected Routes | `src/components/ProtectedRoute.jsx` | ✅ Complete |
| Axios Client | `src/api/axiosClient.js` | ✅ Complete |
| Validators | `src/utils/validators.js` | ✅ Complete |
| Sanitizers | `src/utils/sanitize.js` | ✅ Complete |
| Database Schema | `prisma/schema.prisma` | ✅ Complete |

---

## SUMMARY

The TransferX authentication system is **fully implemented** with:
- ✅ Secure JWT-based authentication
- ✅ Multiple user roles (PLAYER, AGENT, CLUB_MANAGER, ADMIN)
- ✅ Password hashing and verification
- ✅ Frontend and backend validation
- ✅ Input sanitization against XSS
- ✅ Protected API endpoints with middleware
- ✅ Automatic session rehydration
- ✅ Auto-logout on token expiry
- ✅ Role-based route protection

**No additional auth features need to be implemented**, but optional enhancements include password reset, email verification, refresh tokens, and two-factor authentication.

