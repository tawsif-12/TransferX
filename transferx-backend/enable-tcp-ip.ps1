# Enable TCP/IP protocol for SQL Server SQLEXPRESS
# This requires running SQL Server Configuration Manager as Administrator

$instanceName = "SQLEXPRESS"
$regPath = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp"

# Check if the registry path exists
if (Test-Path $regPath) {
    # Enable TCP/IP
    Set-ItemProperty -Path $regPath -Name "Enabled" -Value 1
    Write-Host "TCP/IP has been enabled for SQL Server $instanceName"
    Write-Host "Restarting SQL Server service..."
    
    # Restart the SQL Server service
    Restart-Service -Name "MSSQL`$$instanceName" -Force
    Start-Sleep -Seconds 5
    Write-Host "SQL Server service has been restarted"
}
else {
    Write-Host "SQL Server $instanceName not found or not installed"
}
