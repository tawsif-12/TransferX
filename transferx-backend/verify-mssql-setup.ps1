# TransferX MSSQL Setup Verification Script
# This script checks if your MSSQL environment is properly configured

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TransferX MSSQL Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if SQL Server service is running
Write-Host "[1/6] Checking SQL Server Service..." -ForegroundColor Yellow
$sqlService = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue

if ($sqlService) {
    if ($sqlService.Status -eq "Running") {
        Write-Host "✓ SQL Server Express is running" -ForegroundColor Green
    } else {
        Write-Host "✗ SQL Server Express is installed but not running" -ForegroundColor Red
        Write-Host "  Run: Start-Service 'MSSQL`$SQLEXPRESS'" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✗ SQL Server Express not found" -ForegroundColor Red
    Write-Host "  Install from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Check if sqlcmd is available
Write-Host "[2/6] Checking SQL Command Line Tools..." -ForegroundColor Yellow
if (Get-Command sqlcmd -ErrorAction SilentlyContinue) {
    Write-Host "✓ sqlcmd is available" -ForegroundColor Green
} else {
    Write-Host "✗ sqlcmd not found" -ForegroundColor Red
    Write-Host "  Install SQL Server Command Line Utilities" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 3: Check database connection
Write-Host "[3/6] Testing Database Connection..." -ForegroundColor Yellow
$testConnection = sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT @@VERSION" -h -1 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Can connect to SQL Server" -ForegroundColor Green
} else {
    Write-Host "✗ Cannot connect to SQL Server" -ForegroundColor Red
    Write-Host "  Error: $testConnection" -ForegroundColor Red
    Write-Host "  Check if TCP/IP is enabled in SQL Server Configuration Manager" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 4: Check if TransferX database exists
Write-Host "[4/6] Checking TransferX Database..." -ForegroundColor Yellow
$dbCheck = sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT name FROM sys.databases WHERE name = 'transferx'" -h -1 2>&1
if ($dbCheck -match "transferx") {
    Write-Host "✓ Database 'transferx' exists" -ForegroundColor Green
    
    # Count tables
    $tableCount = sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'" -h -1 2>&1
    if ($tableCount -match "\d+") {
        $count = [int]($tableCount -replace '\D+', '')
        if ($count -gt 0) {
            Write-Host "  Found $count table(s)" -ForegroundColor Cyan
        } else {
            Write-Host "  ⚠ Database exists but no tables found" -ForegroundColor Yellow
            Write-Host "  Run: npx prisma db push" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✗ Database 'transferx' not found" -ForegroundColor Red
    Write-Host "  Create it with: sqlcmd -S localhost\SQLEXPRESS -E -Q `"CREATE DATABASE transferx`"" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Check .env file
Write-Host "[5/6] Checking .env Configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "  DATABASE_URL is configured" -ForegroundColor Cyan
        
        # Extract and display the connection string (masked)
        if ($envContent -match 'DATABASE_URL="([^"]+)"') {
            $connStr = $matches[1]
            if ($connStr -match "password=([^;]+)") {
                $connStr = $connStr -replace "password=[^;]+", "password=****"
            }
            Write-Host "  Connection: $connStr" -ForegroundColor Cyan
        }
    } else {
        Write-Host "  ⚠ DATABASE_URL not found in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ .env file not found" -ForegroundColor Red
    Write-Host "  Copy from: .env.example" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: Check Node.js and packages
Write-Host "[6/6] Checking Node.js Environment..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    exit 1
}

if (Test-Path "node_modules") {
    Write-Host "✓ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "⚠ node_modules not found" -ForegroundColor Yellow
    Write-Host "  Run: npm install" -ForegroundColor Yellow
}

if (Test-Path "node_modules\@prisma\client") {
    Write-Host "✓ Prisma Client installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Prisma Client not found" -ForegroundColor Yellow
    Write-Host "  Run: npx prisma generate" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$dbCheckExists = sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT name FROM sys.databases WHERE name = 'transferx'" -h -1 2>&1
if ($dbCheckExists -match "transferx") {
    $tableCountCheck = sqlcmd -S localhost\SQLEXPRESS -d transferx -E -Q "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'" -h -1 2>&1
    $tablesExist = $tableCountCheck -match "\d+" -and ([int]($tableCountCheck -replace '\D+', '')) -gt 0
    
    if (-not $tablesExist) {
        Write-Host "1. Create tables:      npx prisma db push" -ForegroundColor Cyan
        Write-Host "2. Seed database:      node prisma/seed.js" -ForegroundColor Cyan
        Write-Host "3. Start backend:      npm run dev" -ForegroundColor Cyan
    } else {
        Write-Host "✓ Database is ready!" -ForegroundColor Green
        Write-Host "  Start backend:       npm run dev" -ForegroundColor Cyan
    }
} else {
    Write-Host "1. Create database:    sqlcmd -S localhost\SQLEXPRESS -E -Q `"CREATE DATABASE transferx`"" -ForegroundColor Cyan
    Write-Host "2. Create .env file:   Copy .env.example to .env and configure" -ForegroundColor Cyan
    Write-Host "3. Install packages:   npm install" -ForegroundColor Cyan
    Write-Host "4. Generate Prisma:    npx prisma generate" -ForegroundColor Cyan
    Write-Host "5. Create tables:      npx prisma db push" -ForegroundColor Cyan
    Write-Host "6. Seed database:      node prisma/seed.js" -ForegroundColor Cyan
    Write-Host "7. Start backend:      npm run dev" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "For detailed guidance, see: MSSQL_SETUP_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
