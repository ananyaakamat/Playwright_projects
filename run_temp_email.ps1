# Temp Email PowerShell Script
# Run this with: powershell -ExecutionPolicy Bypass -File run_temp_email.ps1

Write-Host "Temp Email Playwright Script Setup" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Change to script directory
Set-Location -Path "d:\Anant\Playwright_projects"

try {
    Write-Host "Installing npm packages..." -ForegroundColor Yellow
    & npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "npm install completed successfully" -ForegroundColor Green
        
        Write-Host "Installing Playwright browsers..." -ForegroundColor Yellow
        & npx playwright install chromium
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Playwright installation completed successfully" -ForegroundColor Green
            
            Write-Host "Running temp email script..." -ForegroundColor Yellow
            & node temp_email.js
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Script completed successfully!" -ForegroundColor Green
                Write-Host "Check temp_email.txt for the generated email address" -ForegroundColor Cyan
            }
            else {
                Write-Host "Script execution failed" -ForegroundColor Red
            }
        }
        else {
            Write-Host "Playwright installation failed" -ForegroundColor Red
        }
    }
    else {
        Write-Host "npm install failed" -ForegroundColor Red
    }
}
catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
