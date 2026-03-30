$base_url = "http://localhost:3001"
$endpoints = @("/api", "/api/players", "/api/clubs", "/api/leagues")

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$base_url$endpoint" -UseBasicParsing -ErrorAction Stop
        Write-Host "[OK] $endpoint"
    }
    catch {
        Write-Host "[ERROR] $endpoint - $($_.Exception.Message)"
    }
}
