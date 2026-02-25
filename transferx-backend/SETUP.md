# TransferX Backend - Quick Setup Guide

## Overview
This backend API is adapted from a Study Abroad Application system to fit the TransferX Football Transfer Management platform.

## What Changed from the Original Prompt?

### Adapted Features

| Original (Study Abroad) | TransferX (Football) |
|------------------------|----------------------|
| Students | Players |
| Universities | Clubs |
| Countries | Leagues |
| Programs | Transfer Opportunities |
| CGPA/GPA-based tiers | Rating/Market Value tiers |
| Study applications | Transfer requests |
| Visa outcomes | Transfer outcomes |
| University ratings | Club ratings |
| Scholarships | Transfer opportunities with budget |

### Core Features Implemented

✅ **Authentication**
- POST `/api/auth/signup` - Email unique, bcrypt hash
- POST `/api/auth/login` - Verify hash, return JWT + role
- JWT middleware for protected routes

✅ **User Roles**
- PLAYER (equivalent to Student)
- AGENT (new role for the football context)
- CLUB_MANAGER (equivalent to University Admin)
- ADMIN (system administrator)

✅ **User Profile Management**
- GET `/api/user/me` - Get profile
- PUT `/api/user/me` - Update profile
  - Players: position, nationality, stats, rating, marketValue
  - Agents: agency, license, experience
  - Clubs: managed club info

✅ **Tier-Based Recommendations**
- GET `/api/recommendations/leagues`
  - **Tier 1** (Elite): rating > 8.0 OR marketValue > €50M
  - **Tier 2** (Established): rating > 6.5 OR marketValue > €20M
  - **Tier 3** (Developing): Others
- GET `/api/recommendations/opportunities` - Match players with opportunities

✅ **Entities (Leagues/Clubs/Players)**
- GET `/api/leagues` - List leagues
- GET `/api/leagues/[id]/clubs` - Clubs in league
- GET `/api/clubs` - List clubs
- GET `/api/clubs/[id]` - Club details
- GET `/api/clubs/[id]/players` - Players in club
- GET `/api/players` - List players with filters

✅ **Transfer Opportunities** (Scholarships equivalent)
- GET `/api/opportunities` - List all opportunities
- GET `/api/opportunities/club/[id]` - Opportunities by club
- Includes: position required, min rating, max budget, benefits

✅ **Documents**
- POST `/api/documents/upload` - Upload documents (multipart)
- GET `/api/documents/list` - User's documents
- Documents stored in `./uploads` directory

✅ **Applications** (Transfer Requests)
- POST `/api/applications` - Submit transfer request
  - Fields: clubId, proposedFee, proposedSalary, contractLength, transferWindow
  - Status: PENDING → UNDER_REVIEW → NEGOTIATING → ACCEPTED/REJECTED → COMPLETED
- GET `/api/applications` - User's applications
- GET `/api/applications/[id]` - Application details

✅ **Transfer Outcomes** (Visa Outcome equivalent)
- GET `/api/applications/[id]/outcome` - Get outcome
- Unique constraint: one outcome per application

✅ **Ratings** (Post-completion only)
- POST `/api/ratings/club/[id]` - Rate club
  - Validates: user has completed transfer with club
  - Prevents duplicate ratings
- GET `/api/clubs/[id]/ratings` - Club ratings summary and reviews

✅ **Admin Features**

*Leagues Management*
- POST `/api/admin/leagues` - Create league
- PUT `/api/admin/leagues/[id]` - Update league
- DELETE `/api/admin/leagues/[id]` - Soft delete (isActive = false)

*Clubs Management*
- POST `/api/admin/clubs` - Create club
- PUT `/api/admin/clubs/[id]` - Update club
- DELETE `/api/admin/clubs/[id]` - Soft delete

*Opportunities Management*
- POST `/api/admin/opportunities` - Create opportunity

*Documents Verification*
- GET `/api/admin/documents` - List pending documents
- PUT `/api/admin/documents/[id]/verify` - Verify/Reject with note

*Applications Management*
- GET `/api/admin/applications` - All applications
- PUT `/api/admin/applications/[id]/status` - Update status
- POST `/api/admin/applications/[id]/outcome` - Add outcome

*Ratings Moderation*
- GET `/api/admin/ratings` - All ratings
- PUT `/api/admin/ratings/[id]` - Approve/reject rating

## Database Schema

### Main Tables

1. **User** - Base authentication and profile
2. **PlayerProfile** - Player stats (rating, marketValue, goals, assists, etc.)
3. **AgentProfile** - Agent credentials and track record
4. **League** - Football leagues with tier (1-3)
5. **Club** - Football clubs within leagues
6. **PlayerDocument** - Uploaded files with verification status
7. **TransferOpportunity** - Open positions at clubs
8. **ApplicationStatus** - Status reference data
9. **TransferRequest** - Player applications to clubs
10. **TransferOutcome** - Final transfer decision (unique per application)
11. **ClubRating** - Player reviews of clubs
12. **AgentRating** - Player reviews of agents

### Seeded Data

Default application statuses:
- PENDING
- UNDER_REVIEW
- NEGOTIATING
- ACCEPTED
- REJECTED
- COMPLETED

Sample data:
- Admin user
- 4 Leagues (Premier League, La Liga, Bundesliga, Championship)
- 4 Clubs (Man United, Real Madrid, Bayern Munich, Leeds United)
- Sample player
- Sample agent
- 2 Transfer opportunities

## Setup Instructions

### 1. Install Dependencies
```bash
cd transferx-backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
# MySQL
DATABASE_URL="mysql://root:password@localhost:3306/transferx"

# SQL Server (alternative)
# DATABASE_URL="sqlserver://localhost:1433;database=transferx;user=sa;password=YourPassword;encrypt=true"

JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NODE_ENV="development"
```

### 3. Database Setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Create database and tables
npm run prisma:push

# Seed initial data
npm run prisma:seed
```

### 4. Start Server
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Server runs on: `http://localhost:3001`

## Testing the API

### Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@transferx.com | admin123 |
| Player | player@example.com | player123 |
| Agent | agent@example.com | agent123 |

### Example Workflow

1. **Login as Player**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"player@example.com","password":"player123"}'
   ```

2. **Get Profile**
   ```bash
   curl http://localhost:3001/api/user/me \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Get Recommended Leagues**
   ```bash
   curl http://localhost:3001/api/recommendations/leagues \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Browse Opportunities**
   ```bash
   curl http://localhost:3001/api/opportunities
   ```

5. **Submit Transfer Request**
   ```bash
   curl -X POST http://localhost:3001/api/applications \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "clubId": 1,
       "proposedFee": 15.5,
       "proposedSalary": 3.5,
       "contractLength": 3,
       "transferWindow": "SUMMER"
     }'
   ```

6. **Login as Admin & Manage**
   ```bash
   # Login as admin
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@transferx.com","password":"admin123"}'
   
   # Update application status
   curl -X PUT http://localhost:3001/api/admin/applications/1/status \
     -H "Authorization: Bearer ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"status":"UNDER_REVIEW","adminNotes":"Reviewing application"}'
   ```

## Key Implementation Details

### Security
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Role-based access control
- ✅ Input validation with Zod
- ✅ Email stored as lowercase

### File Upload
- Files stored in `./uploads` directory
- Path saved in database
- Multipart form data support

### Soft Deletes
- Leagues and clubs use `isActive` flag
- No hard deletes to preserve data integrity

### Response Format
```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

## Database Management

```bash
# Open Prisma Studio (GUI)
npm run prisma:studio

# Create migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset

# View data
npm run prisma:studio
```

## Integration with Frontend

Update frontend API client:

```javascript
// transferx-frontend/src/api/axiosClient.js
const API_BASE_URL = 'http://localhost:3001/api';
```

## Troubleshooting

### Database Connection
- Ensure MySQL/SQL Server is running
- Check DATABASE_URL in `.env`
- Verify database exists

### Prisma Errors
```bash
# Regenerate client
npm run prisma:generate

# Reset and reseed
npx prisma migrate reset
npm run prisma:seed
```

### File Upload Issues
- Ensure `uploads/` directory exists
- Check file permissions
- Verify multipart form data headers

## Production Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use production database
- [ ] Configure CORS for frontend domain
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure file upload limits
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Add rate limiting
- [ ] Review security headers

## Next Steps

1. **Frontend Integration**: Update React frontend to use these endpoints
2. **Additional Features**: 
   - Email notifications
   - Real-time updates (WebSockets)
   - Advanced search filters
   - Analytics dashboard
3. **Testing**: Add unit and integration tests
4. **Documentation**: Add OpenAPI/Swagger docs

## Support

For issues or questions, refer to:
- Main README: `./README.md`
- Prisma docs: https://www.prisma.io/docs
- Next.js docs: https://nextjs.org/docs

---

**TransferX Backend v1.0.0** - Football Transfer Management System
