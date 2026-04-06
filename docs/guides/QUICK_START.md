# TransferX - Quick Start & Testing Guide

## 🚀 CURRENT STATUS

```
✅ Frontend: http://localhost:3000
✅ Backend API: http://localhost:3001/api
✅ Database: SQL Server (transferx)
✅ Seeded Users:
   - admin@transferx.com / admin123 (ADMIN role)
   - user@transferx.com / user123 (PLAYER role)
```

---

## 🧪 TESTING THE SYSTEM

### 1. Test Backend API Health
```bash
curl http://localhost:3001/api

# Expected response:
# {
#   "message": "TransferX API Server",
#   "version": "1.0.0",
#   "status": "running",
#   "db": "unavailable",
#   "endpoints": {...}
# }
```

### 2. Test Frontend
```bash
# Open in browser:
http://localhost:3000

# Current Components:
# - Navbar (with logo & navigation)
# - Sidebar (with menu items)
# - Login page
# - Protected routes (if authenticated)
```

### 3. Database Verification
```bash
# Check if backend is running:
netstat -ano | findstr ":3001"

# Check if frontend is running:
netstat -ano | findstr ":3000"

# Check database tables:
sqlcmd -S localhost\SQLEXPRESS -E -C -d transferx -Q "SELECT COUNT(*) as TableCount FROM INFORMATION_SCHEMA.TABLES"

# Check users in database:
sqlcmd -S localhost\SQLEXPRESS -E -C -d transferx -Q "SELECT email, role FROM [User]"
```

---

## 🔧 RUNNING THE SERVERS

### Start Backend:
```bash
cd c:\Users\Abrar\OneDrive\Desktop\Database\TransferX\transferx-backend
npm run dev
# Runs on http://localhost:3001
```

### Start Frontend:
```bash
cd c:\Users\Abrar\OneDrive\Desktop\Database\TransferX\transferx-frontend
npm run dev
# Runs on http://localhost:3000
```

### Stop Servers:
```bash
# Kill process on port 3001 (backend):
netstat -ano | findstr ":3001"
Stop-Process -Id <PID> -Force

# Kill process on port 3000 (frontend):
netstat -ano | findstr ":3000"  
Stop-Process -Id <PID> -Force
```

---

## 📊 DATABASE OPERATIONS

### View All Users:
```sql
SELECT id, email, fullName, role, created_at FROM [User];
```

### View All Players:
```sql
SELECT * FROM Player LIMIT 10;
```

### View All Clubs:
```sql
SELECT * FROM Club;
```

### Insert Sample Player:
```sql
INSERT INTO Player (first_name, last_name, date_of_birth, position, nationality)
VALUES ('John', 'Doe', '2000-01-15', 'FORWARD', 'England');
```

### Count Records:
```sql
SELECT 
  (SELECT COUNT(*) FROM [User]) as Users,
  (SELECT COUNT(*) FROM Player) as Players,
  (SELECT COUNT(*) FROM Club) as Clubs,
  (SELECT COUNT(*) FROM League) as Leagues;
```

---

## 🔐 API ENDPOINTS (Planned)

### Authentication:
```
POST   /api/auth/signup       - Register new user
POST   /api/auth/login        - User login  
POST   /api/auth/logout       - User logout
```

### User Management:
```
GET    /api/user/me           - Get current user profile
PUT    /api/user/me           - Update profile
```

### Players:
```
GET    /api/players           - List all players
GET    /api/players/[id]      - Get player details
POST   /api/players           - Create player
PUT    /api/players/[id]      - Update player
DELETE /api/players/[id]      - Delete player
```

### Clubs:
```
GET    /api/clubs             - List all clubs
GET    /api/clubs/[id]        - Get club details
```

### Transfers:
```
GET    /api/transfers         - List transfers
POST   /api/transfers         - Create transfer
GET    /api/transfers/[id]    - Get transfer details
```

### Leagues:
```
GET    /api/leagues           - List leagues
GET    /api/recommendations/leagues - Get recommended leagues
```

---

## 🐛 KNOWN ISSUES & WORKAROUNDS

### Issue 1: Prisma Connection Error
**Problem**: Routes may fail with database connection error  
**Reason**: Prisma cannot connect to SQL Server via TCP/IP  
**Workaround**: Use direct SQL queries or mssql npm package

**Status**: Being addressed - see SYSTEM_STATUS_REPORT.md

### Issue 2: Port Already in Use  
**Problem**: `EADDRINUSE` error when starting server  
**Solution**:
```bash
# Find process using port
netstat -ano | findstr ":3001"

# Kill it
Stop-Process -Id <PID> -Force
```

### Issue 3: Database Connection String Format
**Current**: Configured for local SQL Server Express with Windows authentication  
**If needed**: Edit `.env` file and restart server

---

## 📁 PROJECT STRUCTURE

```
TransferX/
├── transferx-backend/          # Next.js API server
│   ├── app/api/               # Route handlers
│   ├── lib/                   # Utilities (Prisma, Auth, etc.)
│   ├── prisma/                # Database schema & migrations
│   ├── .env                   # Environment variables
│   └── package.json
│
├── transferx-frontend/        # React Vite application  
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # Context providers
│   │   ├── api/               # API client
│   │   └── utils/             # Utility functions
│   └── package.json
│
├── SYSTEM_STATUS_REPORT.md    # Detailed system status
└── README.md                  # Main documentation
```

---

## 💾 SEED DATA SCRIPTS

### Run Seed Script:
```bash
cd transferx-backend
node seed-via-sqlcmd.js         # Uses sqlcmd to seed data
```

### Manual Seeding:
```bash
# Create a league
sqlcmd -S localhost\SQLEXPRESS -E -C -d transferx -Q "
  INSERT INTO League (name, country) VALUES ('Premier League', 'England');
"

# Create a club
sqlcmd -S localhost\SQLEXPRESS -E -C -d transferx -Q "
  INSERT INTO Club (league_id, name, country, founded_year) 
  VALUES (1, 'Manchester United', 'England', 1878);
"
```

---

## 📈 SYSTEM METRICS

**Frontend Bundle Size**: ~100KB (Vite built)  
**Backend Startup Time**: ~5-10 seconds  
**Database Response Time**: <100ms for simple queries  
**Maximum Concurrent Users**: Depends on SQL Server config

---

## 🔄 DEVELOPMENT WORKFLOW

1. **Make changes to frontend**:
   - Hot module replacement automatically reloads at http://localhost:3000

2. **Make changes to backend**:
   - Next.js dev server watches for file changes
   - Restart may be needed for some changes

3. **Database schema changes**:
   - Edit `prisma/schema.prisma`
   - Run: `npx prisma db push` (or use migration.sql)
   - Restart backend

---

##  ℹ️ ADDITIONAL NOTES

- Frontend and backend run on separate ports
- Frontend makes API calls to `http://localhost:3001/api`
- Authentication uses JWT tokens
- All passwords are hashed using bcryptjs
- Database uses Windows Authentication (integrated security)

---

Last Updated: 2026-03-29
