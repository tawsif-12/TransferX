$connectionString = "Server=localhost\SQLEXPRESS;Database=transferx;Integrated Security=true;Encrypt=true;TrustServerCertificate=true;"
$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)

try {
    $connection.Open()
    
    $command = $connection.CreateCommand()
    $command.CommandText = @"
UPDATE [User] 
SET password = @password
WHERE email = 'admin@transferx.com';

SELECT TOP 1 id, email, password, role FROM [User] WHERE email = 'admin@transferx.com';
"@
    
    $command.Parameters.AddWithValue("@password", '$2a$10$HaSKFp0RlCDYcL7JKK1/oOXT3n1N1Js4J9N2kRnbUM/ar3Txb1u3m') | Out-Null
    
    $reader = $command.ExecuteReader()
    
    Write-Host "✅ Password updated successfully!"
    Write-Host ""
    Write-Host "Updated Admin User:"
    Write-Host "===================="
    
    while ($reader.Read()) {
        $id = $reader['id']
        $email = $reader['email']
        $password = $reader['password']
        $role = $reader['role']
        
        Write-Host "ID: $id"
        Write-Host "Email: $email"
        Write-Host "Password Hash: $password"
        Write-Host "Role: $role"
    }
    
    $reader.Close()
}
finally {
    $connection.Close()
}
