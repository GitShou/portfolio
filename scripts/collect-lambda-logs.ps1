param(
    [string]$LogGroupNameContains = "portfolio5352-vwrw",
    [int]$LookbackMinutes = 5
)

$regions = @(
    "ap-east-1",
    "ap-south-1",
    "ap-south-2",
    "ap-southeast-1",
    "ap-southeast-2",
    "ap-southeast-3",
    "ap-southeast-4",
    "ap-northeast-1",
    "ap-northeast-2",
    "ap-northeast-3",
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2"
)

$startTime = [DateTimeOffset]::UtcNow.AddMinutes(-$LookbackMinutes).ToUnixTimeMilliseconds()
$outputDirectory = Join-Path -Path $PSScriptRoot -ChildPath "log"

if (-not (Test-Path -Path $outputDirectory)) {
    New-Item -Path $outputDirectory -ItemType Directory | Out-Null
}

foreach ($region in $regions) {
    Write-Host "=== $region ==="
    $outputFile = Join-Path -Path $outputDirectory -ChildPath "$region.log"

    $logGroupNamesText = aws logs describe-log-groups `
        --region $region `
        --log-group-name-prefix "/aws/lambda/" `
        --query "logGroups[?contains(logGroupName, '$LogGroupNameContains')].logGroupName" `
        --output text 2>$null

    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($logGroupNamesText) -or $logGroupNamesText.Trim() -eq "None") {
        Write-Host "  Log group not found."
        if (Test-Path -Path $outputFile) {
            Remove-Item -Path $outputFile
        }
        continue
    }

    $logGroupNames = $logGroupNamesText -split "`n" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) -and $_ -ne "None" }

    $allEvents = @()

    foreach ($logGroupName in $logGroupNames) {
        $eventsJson = aws logs filter-log-events `
            --region $region `
            --log-group-name $logGroupName `
            --start-time $startTime `
            --max-items 200 `
            --query "events[].{timestamp:timestamp,message:message}" `
            --output json 2>$null

        if ($LASTEXITCODE -ne 0) {
            Write-Host "  Failed to retrieve log events from $logGroupName."
            continue
        }

        if ([string]::IsNullOrWhiteSpace($eventsJson) -or $eventsJson.Trim() -eq "[]") {
            continue
        }

        $events = $eventsJson | ConvertFrom-Json
        if ($events -isnot [System.Collections.IEnumerable]) {
            $events = @($events)
        }

        foreach ($logEvent in $events) {
            $logEvent | Add-Member -NotePropertyName logGroupName -NotePropertyValue $logGroupName
        }
        $allEvents += $events
    }

    if ($allEvents.Count -eq 0) {
        Write-Host "  No events in the last $LookbackMinutes minute(s)."
        if (Test-Path -Path $outputFile) {
            Remove-Item -Path $outputFile
        }
        continue
    }

    $formatted = $allEvents | Sort-Object timestamp | ForEach-Object {
        $timestamp = [DateTimeOffset]::FromUnixTimeMilliseconds([long]$_.timestamp).UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        "$timestamp`t[$($_.logGroupName)] $($_.message)"
    }

    $formatted | Set-Content -Path $outputFile -Encoding UTF8
    Write-Host "  Saved $($allEvents.Count) event(s) to $outputFile"
}
