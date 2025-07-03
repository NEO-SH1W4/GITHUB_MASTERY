# GitHub Contribution Automation Functions - Fixed Version

function Start-GitContribution {
    param(
        [string]$Type = "chore",
        [string]$Message = "quick update",
        [string]$ProjectPath = $null
    )
    
    if (-not $ProjectPath) {
        $ProjectPath = Get-Location
    }
    
    Push-Location $ProjectPath
    
    try {
        if (-not (Test-Path ".git")) {
            Write-Host "Not a Git repository" -ForegroundColor Red
            return
        }
        
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $fullMessage = "$Type`: $Message - $timestamp"
        
        Write-Host "Making quick contribution..." -ForegroundColor Yellow
        Write-Host "Message: $fullMessage" -ForegroundColor Cyan
        
        git add -A
        
        $status = git status --porcelain
        if (-not $status) {
            Write-Host "No changes detected. Creating empty commit..." -ForegroundColor Blue
            git commit --allow-empty -m $fullMessage
        } else {
            Write-Host "Changes detected:" -ForegroundColor Green
            git status --short
            git commit -m $fullMessage
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Commit successful!" -ForegroundColor Green
            
            $currentBranch = git branch --show-current
            git push origin $currentBranch
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Push successful to $currentBranch!" -ForegroundColor Green
                
                $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Quick: $fullMessage"
                $logPath = Join-Path $env:TEMP "contribution_log.txt"
                Add-Content -Path $logPath -Value $logEntry
                
                Write-Host "Contribution registered successfully!" -ForegroundColor Magenta
            } else {
                Write-Host "Push failed, but commit was made" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Commit failed" -ForegroundColor Red
        }
    } finally {
        Pop-Location
    }
}

function Start-DailyContribution {
    param(
        [string]$ProjectPath = $null
    )
    
    if (-not $ProjectPath) {
        $ProjectPath = Get-Location
    }
    
    Write-Host "Running daily contribution automation..." -ForegroundColor Yellow
    Start-GitContribution -Type "daily" -Message "daily maintenance and updates" -ProjectPath $ProjectPath
}

function Start-WeeklyAutomation {
    param(
        [string]$ProjectPath = $null
    )
    
    if (-not $ProjectPath) {
        $ProjectPath = Get-Location
    }
    
    Write-Host "Running weekly automation..." -ForegroundColor Yellow
    Start-GitContribution -Type "weekly" -Message "weekly review and maintenance" -ProjectPath $ProjectPath
}

function Get-ContributionStats {
    $logPath = Join-Path $env:TEMP "contribution_log.txt"
    
    if (Test-Path $logPath) {
        $logs = Get-Content $logPath
        $today = Get-Date -Format "yyyy-MM-dd"
        $thisWeek = Get-Date -UFormat "%Y-W%V"
        
        $todayContributions = $logs | Where-Object { $_ -like "*$today*" }
        $weekContributions = $logs | Where-Object { $_ -like "*$thisWeek*" }
        
        Write-Host "CONTRIBUTION STATISTICS" -ForegroundColor Cyan
        Write-Host "=======================" -ForegroundColor Cyan
        Write-Host "Today: $($todayContributions.Count) contributions" -ForegroundColor Green
        Write-Host "This week: $($weekContributions.Count) contributions" -ForegroundColor Blue
        Write-Host "Total logged: $($logs.Count) contributions" -ForegroundColor Magenta
        
        if ($todayContributions.Count -gt 0) {
            Write-Host "`nToday's contributions:" -ForegroundColor Yellow
            $todayContributions | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
        }
    } else {
        Write-Host "No statistics available yet" -ForegroundColor Yellow
        Write-Host "Make your first contribution with: gco 'message'" -ForegroundColor Cyan
    }
}

# Set aliases
Set-Alias gco Start-GitContribution
Set-Alias gcd Start-DailyContribution  
Set-Alias gcw Start-WeeklyAutomation
Set-Alias gcstats Get-ContributionStats

Write-Host "GitHub Contribution functions loaded (Fixed Version)!" -ForegroundColor Green
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  gco 'message'  - Quick contribution" -ForegroundColor White
Write-Host "  gcd            - Daily contribution" -ForegroundColor White  
Write-Host "  gcw            - Weekly automation" -ForegroundColor White
Write-Host "  gcstats        - View statistics" -ForegroundColor White

