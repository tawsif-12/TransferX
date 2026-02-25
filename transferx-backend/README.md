# TransferX Backend API

Next.js (App Router) backend API for a Football Transfer Management System using Prisma ORM.

## 🎯 Overview

TransferX is a comprehensive football transfer management platform that connects players, agents, clubs, and administrators. The system facilitates:

- Player profiles with statistics and career data
- Club and league management
- Transfer opportunity listings
- Transfer request submissions and tracking
- Document verification
- Club and agent ratings
- Tier-based recommendations

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **ORM**: Prisma
- **Database**: MySQL (portable to SQL Server/PostgreSQL)
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **File Upload**: Native Next.js (multipart/form-data)

## 📁 Project Structure

```
transferx-backend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.js
│   │   │   └── login/route.js
│   │   ├── user/
│   │   │   └── me/route.js
│   │   ├── recommendations/
│   │   │   ├── leagues/route.js
│   │   │   └── opportunities/route.js
│   │   ├── leagues/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       ├── route.js
│   │   │       └── clubs/route.js
│   │   ├── clubs/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       ├── route.js
│   │   │       ├── players/route.js
│   │   │       └── ratings/route.js
│   │   ├── players/
│   │   │   └── route.js
│   │   ├── opportunities/
│   │   │   ├── route.js
│   │   │   └── club/[id]/route.js
│   │   ├── documents/
│   │   │   ├── list/route.js
│   │   │   └── upload/route.js
│   │   ├── applications/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       ├── route.js
│   │   │       └── outcome/route.js
│   │   ├── ratings/
│   │   │   └── club/[id]/route.js
│   │   └── admin/
│   │       ├── leagues/
│   │       ├── clubs/
│   │       ├── opportunities/
│   │       ├── documents/
│   │       ├── applications/
│   │       └── ratings/
│   ├── layout.js
│   └── page.js
├── lib/
│   ├── prisma.js          # Prisma client
│   ├── auth.js            # JWT utilities
│   ├── middleware.js      # Auth middleware
│   ├── response.js        # Response helpers
│   └── validation.js      # Zod schemas
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Seed data
├── uploads/               # File storage
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL or SQL Server database

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd transferx-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/transferx"
   JWT_SECRET="your-super-secret-jwt-key"
   NODE_ENV="development"
   ```

4. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

5. **Push database schema**
   ```bash
   npm run prisma:push
   ```

6. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3001`

## 📊 Database Schema

### Core Models

- **User**: Base user model with role (PLAYER, AGENT, CLUB_MANAGER, ADMIN)
- **PlayerProfile**: Extended player information and statistics
- **AgentProfile**: Agent credentials and experience
- **League**: Football leagues with tier system
- **Club**: Football clubs within leagues
- **TransferOpportunity**: Open positions at clubs
- **PlayerDocument**: Uploaded documents with verification status
- **TransferRequest**: Player applications to clubs
- **TransferOutcome**: Final decision on transfer requests
- **ClubRating**: Player reviews of clubs
- **AgentRating**: Player reviews of agents

### Tier System

Players are automatically categorized into tiers based on stats:
- **Tier 1**: Elite (rating > 8.0 OR market value > €50M)
- **Tier 2**: Established (rating > 6.5 OR market value > €20M)
- **Tier 3**: Developing (others)

## 🔐 Authentication

All protected endpoints require JWT token:

```
Authorization: Bearer <token>
```

### User Roles

- **PLAYER**: Can view opportunities, submit applications, rate clubs
- **AGENT**: Can manage player representation
- **CLUB_MANAGER**: Can manage their club
- **ADMIN**: Full system access, moderation capabilities

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get current user profile |
| PUT | `/api/user/me` | Update profile |

### Recommendations (Players Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommendations/leagues` | Get recommended leagues based on tier |
| GET | `/api/recommendations/opportunities` | Get matching transfer opportunities |

### Leagues

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leagues` | List all leagues |
| GET | `/api/leagues/[id]` | Get league details |
| GET | `/api/leagues/[id]/clubs` | Get clubs in league |

### Clubs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clubs` | List all clubs |
| GET | `/api/clubs/[id]` | Get club details |
| GET | `/api/clubs/[id]/players` | Get club's players |
| GET | `/api/clubs/[id]/ratings` | Get club ratings |

### Players

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players` | List players (with filters) |

### Transfer Opportunities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/opportunities` | List all opportunities |
| GET | `/api/opportunities/club/[id]` | Get club's opportunities |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents/list` | Get user's documents |
| POST | `/api/documents/upload` | Upload document (multipart) |

### Applications (Transfer Requests)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get user's applications |
| POST | `/api/applications` | Submit new application |
| GET | `/api/applications/[id]` | Get application details |
| GET | `/api/applications/[id]/outcome` | Get transfer outcome |

### Ratings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings/club/[id]` | Rate a club (requires completed transfer) |

### Admin Endpoints

#### Leagues Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/leagues` | List all leagues |
| POST | `/api/admin/leagues` | Create league |
| PUT | `/api/admin/leagues/[id]` | Update league |
| DELETE | `/api/admin/leagues/[id]` | Soft delete league |

#### Clubs Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/clubs` | List all clubs |
| POST | `/api/admin/clubs` | Create club |
| PUT | `/api/admin/clubs/[id]` | Update club |
| DELETE | `/api/admin/clubs/[id]` | Soft delete club |

#### Opportunities Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/opportunities` | List all opportunities |
| POST | `/api/admin/opportunities` | Create opportunity |

#### Documents Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/documents` | List documents for verification |
| PUT | `/api/admin/documents/[id]/verify` | Verify/reject document |

#### Applications Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/applications` | List all applications |
| PUT | `/api/admin/applications/[id]/status` | Update application status |
| POST | `/api/admin/applications/[id]/outcome` | Create transfer outcome |

#### Ratings Moderation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/ratings` | List all ratings |
| PUT | `/api/admin/ratings/[id]` | Approve/reject rating |

## 📝 Response Format

All endpoints return JSON in this format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 Test Accounts

After seeding, use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@transferx.com | admin123 |
| Player | player@example.com | player123 |
| Agent | agent@example.com | agent123 |

## 🔍 Example Requests

### Register a Player
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newplayer@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "role": "PLAYER"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player@example.com",
    "password": "player123"
  }'
```

### Get Profile (Authenticated)
```bash
curl http://localhost:3001/api/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Submit Transfer Application
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clubId": 1,
    "proposedFee": 15.5,
    "proposedSalary": 3.5,
    "contractLength": 3,
    "transferWindow": "SUMMER",
    "coverLetter": "I am very interested in joining your club..."
  }'
```

## 🛠️ Development

### Database Management

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create a migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset

# Re-seed database
npm run prisma:seed
```

### Production Build

```bash
npm run build
npm start
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT authentication with 7-day expiration
- Role-based access control
- Input validation with Zod
- SQL injection protection (Prisma)
- Email stored as lowercase for consistency
- Soft deletes for data integrity

## 🌐 CORS Configuration

For production, configure CORS in `next.config.js` or add middleware:

```javascript
// middleware.js
export function middleware(request) {
  // Add CORS headers
}
```

## 📦 Deployment

### Database Setup

1. Create production database
2. Update `DATABASE_URL` in production environment
3. Run migrations: `npx prisma migrate deploy`
4. Run seed (optional): `npm run prisma:seed`

### Environment Variables

Set these in your hosting platform:
- `DATABASE_URL`
- `JWT_SECRET` (use strong random string)
- `NODE_ENV=production`

## 🤝 Integration with Frontend

Update your React frontend (`transferx-frontend`) to point to this API:

```javascript
// axiosClient.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
```

## 📄 License

MIT

## 👥 Contributors

TransferX Development Team

---

**Need help?** Check `/api` endpoint for full API documentation.
