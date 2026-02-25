# ⚡ IMPORTANT: Backend Database Setup Required

## Current Status

✅ **Frontend**: Running on http://localhost:3000/  
⚠️ **Backend**: Needs database configuration

## Quick Setup Options

### Option 1: MySQL (Recommended)

1. **Install MySQL** (if not already installed):
   - Download: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP: https://www.apachefriends.org/

2. **Create Database**:
   ```sql
   CREATE DATABASE transferx;
   ```

3. **Update `.env` file** in `transferx-backend`:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/transferx"
   ```

4. **Run Setup Commands**:
   ```bash
   cd d:\TransferX\transferx-backend
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   npm run dev
   ```

### Option 2: PostgreSQL (Alternative)

1. **Install PostgreSQL**:
   - Download: https://www.postgresql.org/download/windows/

2. **Create Database**:
   ```sql
   CREATE DATABASE transferx;
   ```

3. **Update Schema** (`prisma/schema.prisma`):
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
   cd d:\TransferX\transferx-backend
   npx prisma generate
   npx prisma db push
   node prisma/seed.js
   npm run dev
   ```

### Option 3: Docker MySQL (Quick Setup)

```bash
# Start MySQL in Docker
docker run --name transferx-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=transferx -p 3306:3306 -d mysql:8

# Update .env
DATABASE_URL="mysql://root:password@localhost:3306/transferx"

# Then run setup commands
cd d:\TransferX\transferx-backend
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

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
- `transferx-backend/README.md` - Complete guide
- `transferx-backend/SETUP.md` - Detailed setup
- `transferx-backend/API_REFERENCE.md` - API endpoints
