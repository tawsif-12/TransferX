# ⚡ IMPORTANT: Backend Database Setup Required

## Current Status

✅ **Frontend**: Running on http://localhost:3000/  
⚠️ **Backend**: Needs database configuration

## Quick Setup Options

### Option 1: Microsoft SQL Server (Current Configuration)

The project is currently configured for MSSQL/SQL Server.

1. **Install SQL Server Express** (if not already installed):
   - Download: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Choose "Express" edition (free)

2. **Enable TCP/IP** (Important!):
   - Open SQL Server Configuration Manager
   - Enable TCP/IP protocol for your instance
   - Restart SQL Server service

3. **Create Database**:
   ```powershell
   sqlcmd -S localhost\SQLEXPRESS -E -Q "CREATE DATABASE transferx"
   ```

4. **Update `.env` file** in `transferx-backend`:
   ```env
   # For Windows Authentication (Recommended)
   DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;integratedSecurity=true;trustServerCertificate=true;encrypt=true"
   
   # OR for SQL Authentication
   DATABASE_URL="sqlserver://localhost\SQLEXPRESS;database=transferx;user=sa;password=YourPassword;trustServerCertificate=true;encrypt=true"
   ```

5. **Run Setup Commands**:
   ```bash
   cd d:\TransferX\TransferX\transferx-backend
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   npm run dev
   ```

📖 **Detailed Guide**: See [transferx-backend/MSSQL_SETUP_GUIDE.md](TransferX/transferx-backend/MSSQL_SETUP_GUIDE.md) for complete instructions with troubleshooting.

---

### Option 2: MySQL (Alternative)

If you prefer MySQL, you'll need to update the schema:

1. **Install MySQL** (if not already installed):
   - Download: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP: https://www.apachefriends.org/

2. **Create Database**:
   ```sql
   CREATE DATABASE transferx;
   ```

3. **Update Schema** (`transferx-backend/prisma/schema.prisma`):
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Update `.env` file** in `transferx-backend`:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/transferx"
   ```

5. **Run Setup Commands**:
   ```bash
   cd d:\TransferX\TransferX\transferx-backend
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   npm run dev
   ```

### Option 3: PostgreSQL (Alternative)

1. **Install PostgreSQL**:
   - Download: https://www.postgresql.org/download/windows/

2. **Create Database**:
   ```sql
   CREATE DATABASE transferx;
   ```

3. **Update Schema** (`transferx-backend/prisma/schema.prisma`):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/transferx"
   ```

5. **Run Setup**:
   ```bash
   cd d:\TransferX\TransferX\transferx-backend
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   npm run dev
   ```

### Option 4: Docker MySQL (Quick Setup)

```bash
# Start MySQL in Docker
docker run --name transferx-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=transferx -p 3306:3306 -d mysql:8

# Update schema to use MySQL (see Option 2 step 3)
# Update .env
DATABASE_URL="mysql://root:password@localhost:3306/transferx"

# Then run setup commands
cd d:\TransferX\TransferX\transferx-backend
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

---

## Test Accounts (After Seeding)

| Role   | Email                    | Password  |
|--------|--------------------------|-----------|
| Admin  | admin@transferx.com      | admin123  |
| Player | player@example.com       | player123 |
| Agent  | agent@example.com        | agent123  |

## Backend Will Run On

Once database is configured:
- **Backend API**: http://localhost:3001/api
- **API Docs**: http://localhost:3001/api (lists all endpoints)

## Verify Setup

After starting backend, test:
```bash
curl http://localhost:3001/api
```

Should return JSON with available endpoints.

## Need Help?

Check the full documentation:
- `TransferX/transferx-backend/MSSQL_SETUP_GUIDE.md` - **Complete MSSQL setup with troubleshooting**
- `TransferX/transferx-backend/README.md` - Complete project guide
- `TransferX/transferx-backend/SETUP.md` - Detailed setup instructions
- `TransferX/transferx-backend/API_REFERENCE.md` - API endpoints reference
