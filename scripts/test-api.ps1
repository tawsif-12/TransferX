$base_url = "http://localhost:3001"

# Test endpoints
$endpoints = @(
    "/api",
    "/api/players",
    "/api/clubs",
    "/api/leagues"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$base_url$endpoint" -UseBasicParsing -ErrorAction Stop
        $json = $response.Content | ConvertFrom-Json
        Write-Host "✓ GET $endpoint - Status: $($response.StatusCode)"
        Write-Host "  Data count: $(if ($json.data) { $json.data.Count } else { 'N/A' })"
        Write-Host "  Success: $($json.success)"
        Write-Host ""
    }
    catch {
        Write-Host "✗ GET $endpoint - Error: $($_.Exception.Message)"
        Write-Host ""
    }
}
