# 🗄️ MSSQL Database Setup Guide for TransferX

## Overview

This guide walks you through setting up Microsoft SQL Server for the TransferX backend, creating all necessary tables using Prisma ORM.

## Prerequisites

- ✅ Windows OS
- ✅ Node.js 18+ installed
- ✅ SQL Server or SQL Server Express installed

---

## Step 1: Verify/Install SQL Server

### Check if SQL Server is Already Installed

```powershell
# Check SQL Server services
Get-Service | Where-Object {$_.DisplayName -like "*SQL Server*"}
```

### If Not Installed - Install SQL Server Express (Free)

1. **Download SQL Server Express**:
   - Visit: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Click "Download now" under Express edition

2. **Run the Installer**:
   - Choose **"Basic"** installation for quick setup
   - Or **"Custom"** for more control
   - Note the instance name (usually `SQLEXPRESS`)

3. **Install SQL Server Management Studio (SSMS)** - Optional but Recommended:
   - Download from: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
   - Useful for database management and queries

---

## Step 2: Enable TCP/IP Protocol (Important!)

SQL Server Express disables TCP/IP by default. You must enable it:

### Method 1: Using SQL Server Configuration Manager

1. Open **SQL Server Configuration Manager**
   - Search for "SQL Server Configuration Manager" in Windows Start menu
   
2. Navigate to:
   - **SQL Server Network Configuration** → **Protocols for SQLEXPRESS**

3. Right-click **TCP/IP** → **Enable**

4. Right-click **TCP/IP** → **Properties**
   - Go to **IP Addresses** tab
   - Find **IPAll** section at bottom
   - Set **TCP Port** to `1433` (or note the port number)

5. **Restart SQL Server Service**:
   ```powershell
   Restart-Service 'MSSQL$SQLEXPRESS'
   ```

### Method 2: Using PowerShell

```powershell
# Enable TCP/IP for SQLEXPRESS
Import-Module "sqlps" -DisableNameChecking
$wmi = New-Object ('Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer')
$uri = "ManagedComputer[@Name='$env:COMPUTERNAME']/ServerInstance[@Name='SQLEXPRESS']/ServerProtocol[@Name='Tcp']"
$Tcp = $wmi.GetSmoObject($uri)
$Tcp.IsEnabled = $true
$Tcp.Alter()

# Restart service
Restart-Service 'MSSQL$SQLEXPRESS'
```

---

## Step 3: Create TransferX Database

### Option A: Using SQLCMD (Command Line)

```powershell
# Connect to SQL Server and create database
sqlcmd -S localhost\SQLEXPRESS -E -Q "CREATE DATABASE transferx"

# Verify database was created
sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT name FROM sys.databases WHERE name = 'transferx'"
```

### Option B: Using SQL Server Management Studio (SSMS)

1. Open SSMS
2. Connect to `localhost\SQLEXPRESS` (Use Windows Authentication)
3. Right-click **Databases** → **New Database**
4. Enter `transferx` as database name
5. Click **OK**

### Option C: Using PowerShell with SQL Authentication

```powershell
# If using SQL authentication (not Windows auth)
sqlcmd -S localhost\SQLEXPRESS -U sa -P YourPassword -Q "CREATE DATABASE transferx"
```

---

## Step 4: Configure Backend Environment

### 1. Navigate to Backend Directory

```powershell
cd d:\TransferX\TransferX\transferx-backend
```

### 2. Create `.env` File

Copy the example file:
```powershell
Copy-Item .env.example .env
```

### 3. Update `.env` File

Open `.env` and set the `DATABASE_URL` based on your SQL Server configuration:

#### For Windows Authentication (Recommended):
```env
DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;integratedSecurity=true;trustServerCertificate=true;encrypt=true"
```

#### For SQL Authentication (if using sa or specific user):
```env
DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;user=sa;password=YourPassword;trustServerCertificate=true;encrypt=true"
```

#### For Default SQL Server Instance (not Express):
```env
DATABASE_URL="sqlserver://localhost:1433;database=transferx;integratedSecurity=true;trustServerCertificate=true;encrypt=true"
```

**Complete `.env` Example:**
```env
# Database - Choose the appropriate connection string above
DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;integratedSecurity=true;trustServerCertificate=true;encrypt=true"

# JWT Secret (change this to a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Node Environment
NODE_ENV="development"

# API Base URL
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## Step 5: Install Dependencies

```powershell
npm install
```

---

## Step 6: Create Database Tables with Prisma

### 1. Generate Prisma Client

```powershell
npx prisma generate
# OR using npm script:
npm run prisma:generate
```

This generates the Prisma Client based on your schema, enabling type-safe database queries.

### 2. Push Schema to Database (Create All Tables)

```powershell
npx prisma db push
# OR using npm script:
npm run prisma:push
```

This command will:
- ✅ Connect to your MSSQL database
- ✅ Create all tables defined in `prisma/schema.prisma`
- ✅ Set up relationships, indexes, and constraints

**Tables Created:**
1. `User` - User accounts (Admin, Agent, Club Manager, Player, Fan)
2. `League` - Football leagues
3. `Club` - Football clubs
4. `Player` - Player profiles
5. `Transfer` - Transfer records
6. `TransferHistory` - Historical transfer data
7. `Contract` - Player contracts
8. `Agent` - Agent information
9. `PlayerAgent` - Many-to-many relationship between players and agents

### 3. (Optional) Use Migrations Instead

If you prefer migration files for version control:

```powershell
npx prisma migrate dev --name init
# OR using npm script:
npm run prisma:migrate
```

This creates a `migrations` folder with SQL migration files you can track in Git.

---

## Step 7: Seed the Database with Sample Data

```powershell
node prisma/seed.js
# OR using npm script:
npm run prisma:seed
```

This populates your database with:
- Test users (Admin, Player, Agent, Club Manager)
- Sample leagues (Premier League, La Liga, Bundesliga, etc.)
- Sample clubs
- Sample players
- Sample transfer opportunities

**Test Accounts Created:**

| Role          | Email                  | Password      |
|---------------|------------------------|---------------|
| Admin         | admin@transferx.com    | admin123      |
| Player        | player@example.com     | player123     |
| Agent         | agent@example.com      | agent123      |
| Club Manager  | manager@example.com    | manager123    |
| Fan           | fan@example.com        | fan123        |

---

## Step 8: Verify Database Setup

### Option 1: Using Prisma Studio (Visual Database Browser)

```powershell
npx prisma studio
# OR using npm script:
npm run prisma:studio
```

- Opens at http://localhost:5555
- Browse all tables and data visually
- Edit data directly in the browser interface

### Option 2: Using SQLCMD

```powershell
# List all tables
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"

# Count records in User table
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT COUNT(*) as UserCount FROM [User]"

# View test users
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT user_id, email, role FROM [User]"
```

### Option 3: Using SSMS

1. Open SQL Server Management Studio
2. Connect to `localhost\SQLEXPRESS`
3. Expand **Databases** → **transferx** → **Tables**
4. You should see all 9 tables
5. Right-click any table → **Select Top 1000 Rows** to view data

---

## Step 9: Start the Backend Server

```powershell
npm run dev
```

The backend will start on **http://localhost:3001**

### Test API Endpoints

```powershell
# Health check
curl http://localhost:3001/api

# Test login
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@transferx.com\",\"password\":\"admin123\"}'
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Login failed for user"

**Cause**: Incorrect authentication mode in connection string

**Solutions**:
- For Windows Auth: Use `integratedSecurity=true` (no user/password)
- For SQL Auth: Ensure user exists and password is correct
- Enable SQL Server authentication in SSMS → Server Properties → Security → SQL Server and Windows Authentication mode

### Issue 2: "Named Pipes Provider: Could not open a connection"

**Cause**: TCP/IP not enabled or SQL Server service not running

**Solutions**:
```powershell
# Check if SQL Server is running
Get-Service MSSQL$SQLEXPRESS

# Start SQL Server if stopped
Start-Service MSSQL$SQLEXPRESS

# Enable TCP/IP (see Step 2)
```

### Issue 3: "Invalid connection string"

**Cause**: Incorrect DATABASE_URL format

**Solution**: Verify your connection string format:
```env
# Correct format with instance name
DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;integratedSecurity=true;trustServerCertificate=true"

# Note: no semicolon before 'database='
```

### Issue 4: "Database 'transferx' does not exist"

**Solution**:
```powershell
# Create the database
sqlcmd -S localhost\SQLEXPRESS -E -Q "CREATE DATABASE transferx"
```

### Issue 5: Prisma Client errors

**Solution**:
```powershell
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue 6: Port 1433 already in use

**Solution**: Use named pipe or specify different port:
```env
# Use named pipe (no port needed)
DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;integratedSecurity=true;trustServerCertificate=true"
```

---

## 🔧 Database Management Commands

### Useful Prisma Commands

```powershell
# View current database schema
npx prisma db pull

# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# View Prisma Client methods
npx prisma generate --help
```

### Useful SQL Server Commands

```powershell
# Backup database
sqlcmd -S localhost\SQLEXPRESS -E -Q "BACKUP DATABASE transferx TO DISK='C:\Backup\transferx.bak'"

# List all databases
sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT name FROM sys.databases"

# Check database size
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "EXEC sp_spaceused"

# View table row counts
sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT t.name AS TableName, SUM(p.rows) AS RowCount FROM sys.tables t INNER JOIN sys.partitions p ON t.object_id = p.object_id WHERE p.index_id IN (0,1) GROUP BY t.name ORDER BY t.name"
```

---

## 📊 Database Schema Overview

Your TransferX database includes the following tables:

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Authentication & user profiles | user_id, email, password_hash, role |
| **League** | Football leagues | league_id, name, country |
| **Club** | Football clubs | club_id, name, league_id, country |
| **Player** | Player profiles | player_id, name, date_of_birth, position, current_club_id |
| **Agent** | Football agents | agent_id, agent_name |

### Relationship Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **Transfer** | Transfer records | transfer_id, player_id, from_club_id, to_club_id, transfer_fee |
| **TransferHistory** | Historical transfers | transfer_id, player_id, fee |
| **Contract** | Player contracts | contract_id, player_id, club_id, start_date, end_date |
| **PlayerAgent** | Player-Agent relationship | player_id, agent_id |

### Relationships

- Club → League (Many-to-One)
- Player → Club (Many-to-One)
- Transfer → Player, Club (Many-to-One)
- PlayerAgent → Player, Agent (Many-to-Many junction)
- Contract → Player, Club (Many-to-One)

---

## 🚀 Next Steps

1. ✅ Verify all tables are created in MSSQL
2. ✅ Test API endpoints with test accounts
3. ✅ Start the frontend application
4. ✅ Begin development!

## 📚 Additional Resources

- [Prisma SQL Server Documentation](https://www.prisma.io/docs/concepts/database-connectors/sql-server)
- [SQL Server Configuration Manager Guide](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-configuration-manager)
- [TransferX API Reference](./API_REFERENCE.md)
- [Backend Setup Guide](./SETUP.md)

---

## 🆘 Need Help?

If you encounter issues not covered here:

1. Check Prisma logs: `npx prisma db push --help`
2. View SQL Server error logs in Event Viewer
3. Test connection with: `sqlcmd -S localhost\SQLEXPRESS -E`
4. Verify service status: `Get-Service MSSQL$SQLEXPRESS`

---

**Last Updated**: February 2026  
**Compatible with**: Prisma 5.22+, SQL Server 2019+, SQL Server Express
