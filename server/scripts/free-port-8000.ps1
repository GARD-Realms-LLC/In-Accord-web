// Windows PowerShell script to free port 8000
// Usage: Run this before starting the backend if you get EADDRINUSE errors

$port = 8000
$connections = netstat -ano | Select-String ":$port"
if ($connections) {
    $pids = $connections | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Sort-Object -Unique
    foreach ($pid in $pids) {
        if ($pid -match '^\d+$' -and $pid -ne $PID) {
            Write-Host "Killing process on port $port with PID $pid"
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host "No process found using port $port."
}
