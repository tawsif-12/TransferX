# Database Migration Script
# This script backs up the database from collaborator's server and restores it on your local server

param(
    [string]$Action = "migrate"
)

# Configuration
$CollaboratorServer = "DESKTOP-3HO2U54\SQLEXPRESS"
$LocalServer = "DESKTOP-TDMF88Q\SQLEXPRESS"
$DatabaseName = "transferx"
$BackupPath = "C:\SQLBackups"
$BackupFile = "$BackupPath\transferx_$(Get-Date -Format 'yyyyMMdd_HHmmss').bak"

function Test-SqlConnection {
    param([string]$ServerName)
    
    try {
        sqlcmd -S $ServerName -E -Q "SELECT @@VERSION" | Out-Null
        Write-Host "✓ Connected to $ServerName successfully" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Failed to connect to $ServerName" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

function Create-BackupDirectory {
    if (-not (Test-Path $BackupPath)) {
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
        Write-Host "✓ Created backup directory: $BackupPath" -ForegroundColor Green
    }
}

function Backup-Database {
    param([string]$ServerName)
    
    Write-Host "`nBacking up database from $ServerName..." -ForegroundColor Yellow
    
    $backupQuery = @"
BACKUP DATABASE [$DatabaseName]
TO DISK = N'$BackupFile'
WITH NOFORMAT, NOINIT, NAME = N'TransferX-Backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')',
SKIP, REWIND, NOUNLOAD, COMPRESSION, STATS = 10
"@

    try {
        sqlcmd -S $ServerName -E -Q $backupQuery -m 1
        Write-Host "✓ Database backed up to: $BackupFile" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Backup failed" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

function Create-LocalDatabase {
    Write-Host "`nCreating database on $LocalServer..." -ForegroundColor Yellow
    
    # First, check if database exists
    $checkQuery = "IF EXISTS(SELECT * FROM sys.databases WHERE name = '$DatabaseName') SELECT 1 ELSE SELECT 0"
    $exists = sqlcmd -S $LocalServer -E -Q $checkQuery -h -1 -W | Select-Object -First 1
    
    if ($exists -eq 1) {
        Write-Host "⚠ Database '$DatabaseName' already exists on local server" -ForegroundColor Yellow
        
        # Prompt user
        $response = Read-Host "Do you want to drop and recreate it? (y/n)"
        if ($response -ne 'y') {
            Write-Host "Skipping database creation" -ForegroundColor Yellow
            return $true
        }
        
        # Drop existing database
        $dropQuery = "ALTER DATABASE [$DatabaseName] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [$DatabaseName];"
        sqlcmd -S $LocalServer -E -Q $dropQuery
        Write-Host "✓ Dropped existing database" -ForegroundColor Green
    }
    
    # Create new database
    $createQuery = "CREATE DATABASE [$DatabaseName];"
    try {
        sqlcmd -S $LocalServer -E -Q $createQuery
        Write-Host "✓ Created database '$DatabaseName' on local server" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Failed to create database" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

function Restore-Database {
    Write-Host "`nRestoring database on $LocalServer..." -ForegroundColor Yellow
    
    $restoreQuery = @"
RESTORE DATABASE [$DatabaseName]
FROM DISK = N'$BackupFile'
WITH FILE = 1,
MOVE N'TransferX' TO N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\$DatabaseName.mdf',
MOVE N'TransferX_log' TO N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\${DatabaseName}_log.ldf',
NOUNLOAD, REPLACE, RECOVERY, STATS = 10
"@

    try {
        sqlcmd -S $LocalServer -E -Q $restoreQuery
        Write-Host "✓ Database restored successfully" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Restore failed" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

function Verify-Migration {
    Write-Host "`nVerifying migration..." -ForegroundColor Yellow
    
    $verifyQuery = "SELECT COUNT(*) as TableCount FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"
    
    try {
        $result = sqlcmd -S $LocalServer -E -d $DatabaseName -Q $verifyQuery -h -1 -W
        $tableCount = $result -split '\s+' | Where-Object {$_ -match '^\d+$'} | Select-Object -First 1
        
        Write-Host "✓ Local database contains $tableCount tables" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Verification failed" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TransferX Database Migration Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test connections
Write-Host "`nTesting connections..." -ForegroundColor Yellow
$collabConnected = Test-SqlConnection -ServerName $CollaboratorServer
$localConnected = Test-SqlConnection -ServerName $LocalServer

if (-not $collabConnected -or -not $localConnected) {
    Write-Host "`n✗ Connection test failed. Exiting." -ForegroundColor Red
    exit 1
}

# Create backup directory
Create-BackupDirectory

# Perform migration
if ($Action -eq "migrate") {
    if (Backup-Database -ServerName $CollaboratorServer) {
        if (Create-LocalDatabase) {
            if (Restore-Database) {
                Verify-Migration
            }
        }
    }
}
elseif ($Action -eq "backup") {
    Backup-Database -ServerName $CollaboratorServer
}
elseif ($Action -eq "restore") {
    if (Create-LocalDatabase) {
        Restore-Database
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Migration process completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nNext steps:"
Write-Host "1. Update .env file with: DATABASE_URL=sqlserver://DESKTOP-TDMF88Q\SQLEXPRESS;database=transferx;integratedSecurity=true;trustServerCertificate=true;encrypt=true"
Write-Host "2. Run: npm install && npm run dev"
Write-Host ""
