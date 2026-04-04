# Database Migration Guide - TransferX

## Overview

This guide will help you migrate the TransferX database from your collaborator's PC (DESKTOP-3HO2U54\SQLEXPRESS) to your own PC (DESKTOP-TDMF88Q\SQLEXPRESS).

## Prerequisites

- ✅ **MSSQL Server Express** installed and running on your PC
- ✅ **Windows Authentication** enabled on both servers
- ✅ Network access to your collaborator's server (if servers aren't accessible, they'll need to provide a backup file)
- ✅ **SQL Server Management Studio** installed (optional, for manual verification)

## Step-by-Step Setup

### Step 1: Prepare Your Local MSSQL Server

Make sure your MSSQL Server instance is running:

```powershell
# Check SQL Server service status
Get-Service MSSQLSERVER | Select-Object Status
# If stopped, start it:
Start-Service MSSQLSERVER
```

### Step 2: Run the Migration Script

Open PowerShell as **Administrator** and navigate to the backend directory:

```powershell
cd "c:\Users\Abrar\OneDrive\Desktop\db\TransferX\transferx-backend"

# Run the migration script (this will back up from collaborator and restore on your PC)
.\migrate-database.ps1 -Action migrate
```

**What this script does:**

1. Tests connection to both servers (collaborator's and yours)
2. Creates a backup directory at `C:\SQLBackups`
3. **Backs up** the database from `DESKTOP-3HO2U54\SQLEXPRESS`
4. **Creates** the `transferx` database on your local `DESKTOP-TDMF88Q\SQLEXPRESS`
5. **Restores** the backup file to your local database
6. **Verifies** the migration was successful

### Step 3: Verify the Database Connection

```powershell
# Test connection to your local server
sqlcmd -S "DESKTOP-TDMF88Q\SQLEXPRESS" -E -Q "SELECT @@VERSION"

# List all databases to confirm 'transferx' exists
sqlcmd -S "DESKTOP-TDMF88Q\SQLEXPRESS" -E -Q "SELECT name FROM sys.databases WHERE name = 'transferx'"
```

### Step 4: Start the Backend Server

```powershell
npm install
npm run dev
```

The backend should now connect to your local database!

## File Changes Made

### 1. **`.env`** - Created with your local server configuration

```env
DATABASE_URL="sqlserver://DESKTOP-TDMF88Q\SQLEXPRESS;database=transferx;integratedSecurity=true;trustServerCertificate=true;encrypt=true"
```

### 2. **`lib/dbConfig.js`** - New helper file

- Exports `SERVER` and `DATABASE` configuration
- Dynamically reads from `DATABASE_URL` environment variable
- Defaults to your local server if env var not set

### 3. **Updated DB Files** - Now use local server config

- `lib/database.js` - Updated to use `dbConfig.js`
- `lib/authDB.js` - Updated to use `dbConfig.js`
- `lib/directDB.js` - Updated to use `dbConfig.js`
- `lib/dataQueries.js` - Updated to use `dbConfig.js`
- `lib/dbHealth.js` - Updated to use `dbConfig.js`

## Troubleshooting

### Error: "Login failed for user"

**Solution:** Check that you have Windows Authentication enabled on your MSSQL Server instance.

### Error: "Cannot connect to DESKTOP-3HO2U54"

**Options:**

1. Check if your collaborator's network is accessible
2. Ask your collaborator to provide a `.bak` backup file instead
3. Run migrations manually from the backup file:

   ```powershell
   .\migrate-database.ps1 -Action restore
   ```

### Error: "Database already exists"

The script will ask if you want to drop and recreate it. Choose `y` to replace with migrated data.

### Database tables seem empty

Make sure the backup/restore completed successfully. Check:

```powershell
sqlcmd -S "DESKTOP-TDMF88Q\SQLEXPRESS" -E -d transferx -Q "SELECT COUNT(*) as TableCount FROM INFORMATION_SCHEMA.TABLES"
```

## Additional Commands

### Backup only (without restore)

```powershell
.\migrate-database.ps1 -Action backup
```

Backup file will be saved to: `C:\SQLBackups\transferx_YYYYMMDD_HHMMSS.bak`

### Restore from existing backup

```powershell
.\migrate-database.ps1 -Action restore
```

This will prompt you to confirm if you want to drop the existing database first.

## Frontend Setup

Once the backend is running, start the frontend in a new terminal:

```powershell
cd "c:\Users\Abrar\OneDrive\Desktop\db\TransferX\transferx-frontend"
npm install
npm run dev
```

Frontend will open at: `http://localhost:5173`
Backend API: `http://localhost:3001`

## Quick Start (After Initial Setup)

Future sessions:

```powershell
# Terminal 1 - Backend
cd transferx-backend
npm run dev

# Terminal 2 - Frontend
cd transferx-frontend
npm run dev
```

## Next Steps

1. ✅ Run the migration script
2. ✅ Verify database connection
3. ✅ Start backend (`npm run dev`)
4. ✅ Start frontend in new terminal (`npm run dev`)
5. ✅ Test the application at <http://localhost:5173>

## Questions?

- Check `migrate-database.ps1` comments for script details
- Review `.env` file to verify database URL
- Check `lib/dbConfig.js` to see how server name is resolved
