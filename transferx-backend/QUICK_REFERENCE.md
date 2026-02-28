# TransferX MSSQL Quick Reference Card

## 🚀 Initial Setup (One-Time)

```powershell
# 1. Create database
sqlcmd -S localhost\SQLEXPRESS -E -Q "CREATE DATABASE transferx"

# 2. Navigate to backend folder
cd d:\TransferX\TransferX\transferx-backend

# 3. Create .env file (copy from .env.example and configure)
Copy-Item .env.example .env

# 4. Install dependencies
npm install

# 5. Generate Prisma Client
npx prisma generate

# 6. Create all database tables
npx prisma db push

# 7. Load sample data
node prisma/seed.js

# 8. Start backend server
npm run dev
```

---

## ⚡ Common Commands

### Database Management

```powershell
# Create database
sqlcmd -S localhost\SQLEXPRESS -E -Q "CREATE DATABASE transferx"

# Verify database exists
sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT name FROM sys.databases WHERE name = 'transferx'"

# List all tables
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"

# Backup database
sqlcmd -S localhost\SQLEXPRESS -E -Q "BACKUP DATABASE transferx TO DISK='C:\Backup\transferx.bak'"
```

### SQL Server Service

```powershell
# Check service status
Get-Service MSSQL$SQLEXPRESS

# Start service
Start-Service MSSQL$SQLEXPRESS

# Restart service
Restart-Service MSSQL$SQLEXPRESS

# Stop service
Stop-Service MSSQL$SQLEXPRESS
```

### Prisma Commands

```powershell
# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema to database (create/update tables)
npx prisma db push

# Create migration (for version control)
npx prisma migrate dev --name migration_name

# Open Prisma Studio (visual database browser)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Pull schema from existing database
npx prisma db pull

# Reset database (⚠️ DELETES ALL DATA!)
npx prisma migrate reset
```

### Application Commands

```powershell
# Install dependencies
npm install

# Start development server (port 3001)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database with sample data
npm run prisma:seed
# OR
node prisma/seed.js
```

### Verification

```powershell
# Run setup verification script
.\verify-mssql-setup.ps1

# Test API health
curl http://localhost:3001/api

# Test login
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@transferx.com\",\"password\":\"admin123\"}'
```

---

## 📊 Database Tables (9 Total)

| # | Table | Purpose |
|---|-------|---------|
| 1 | User | User accounts & authentication |
| 2 | League | Football leagues |
| 3 | Club | Football clubs |
| 4 | Player | Player profiles |
| 5 | Agent | Football agents |
| 6 | PlayerAgent | Player-Agent relationships |
| 7 | Transfer | Transfer records |
| 8 | TransferHistory | Historical transfers |
| 9 | Contract | Player contracts |

---

## 🔗 Connection Strings (.env file)

```env
# Windows Authentication (Recommended)
DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;integratedSecurity=true;trustServerCertificate=true;encrypt=true"

# SQL Authentication
DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;user=sa;password=YourPassword;trustServerCertificate=true;encrypt=true"

# Default Instance (not Express)
DATABASE_URL="sqlserver://localhost:1433;database=transferx;integratedSecurity=true;trustServerCertificate=true;encrypt=true"
```

---

## 👤 Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@transferx.com | admin123 |
| Player | player@example.com | player123 |
| Agent | agent@example.com | agent123 |
| Club Manager | manager@example.com | manager123 |
| Fan | fan@example.com | fan123 |

---

## 🛠️ Troubleshooting Quick Fixes

### Cannot connect to SQL Server
```powershell
# Enable TCP/IP
# 1. Open SQL Server Configuration Manager
# 2. Enable TCP/IP for SQLEXPRESS
# 3. Restart service
Restart-Service MSSQL$SQLEXPRESS
```

### Database doesn't exist
```powershell
sqlcmd -S localhost\SQLEXPRESS -E -Q "CREATE DATABASE transferx"
```

### Prisma Client errors
```powershell
npx prisma generate
```

### Tables not created
```powershell
npx prisma db push
```

### No data in tables
```powershell
node prisma/seed.js
```

### Port 3001 already in use
```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 3001 | Select-Object -Property OwningProcess

# Kill process (replace PID)
taskkill /F /PID <ProcessID>
```

---

## 📁 Important Files

| File | Location | Purpose |
|------|----------|---------|
| **schema.prisma** | `transferx-backend/prisma/` | Database schema |
| **.env** | `transferx-backend/` | Environment config |
| **seed.js** | `transferx-backend/prisma/` | Sample data |
| **MSSQL_SETUP_GUIDE.md** | `transferx-backend/` | Complete setup guide |
| **DATABASE_TABLES_REFERENCE.md** | `transferx-backend/` | Table documentation |

---

## 🌐 URLs

- **Backend API**: http://localhost:3001/api
- **Prisma Studio**: http://localhost:5555 (after `npx prisma studio`)
- **Frontend**: http://localhost:3000 (if running)

---

## 📚 Documentation Links

- **Complete Setup Guide**: [MSSQL_SETUP_GUIDE.md](TransferX/transferx-backend/MSSQL_SETUP_GUIDE.md)
- **Database Reference**: [DATABASE_TABLES_REFERENCE.md](TransferX/transferx-backend/DATABASE_TABLES_REFERENCE.md)
- **API Reference**: [API_REFERENCE.md](TransferX/transferx-backend/API_REFERENCE.md)
- **Setup Instructions**: [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

---

## 🔍 Useful SQL Queries

```sql
-- View all users
SELECT user_id, email, role FROM [User];

-- View all players with clubs
SELECT p.first_name + ' ' + p.last_name AS Player, c.name AS Club
FROM Player p
LEFT JOIN Club c ON p.current_club_id = c.club_id;

-- View recent transfers
SELECT 
    p.first_name + ' ' + p.last_name AS Player,
    fc.name AS FromClub,
    tc.name AS ToClub,
    t.transfer_fee AS Fee,
    t.transfer_date AS Date
FROM Transfer t
JOIN Player p ON t.player_id = p.player_id
JOIN Club fc ON t.from_club_id = fc.club_id
JOIN Club tc ON t.to_club_id = tc.club_id
ORDER BY t.transfer_date DESC;

-- Count records per table
SELECT 'User' as [Table], COUNT(*) as Records FROM [User] UNION ALL
SELECT 'League', COUNT(*) FROM League UNION ALL
SELECT 'Club', COUNT(*) FROM Club UNION ALL
SELECT 'Player', COUNT(*) FROM Player;
```

---

**Quick Help**: For detailed troubleshooting, run `.\verify-mssql-setup.ps1` in the `transferx-backend` folder.

**Last Updated**: February 2026
