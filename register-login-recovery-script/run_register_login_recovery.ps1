# Register-Login-Recovery PowerShell Script
# Run this with: powershell -ExecutionPolicy Bypass -File run_register_login_recovery.ps1

Write-Host "Register-Login-Recovery Playwright Script" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Change to script directory
Set-Location -Path "d:\Anant\Playwright_projects\register-login-recovery-script"

try {
    Write-Host "Installing npm packages from parent directory..." -ForegroundColor Yellow
    Set-Location -Path ".."
    & npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "npm install completed successfully" -ForegroundColor Green
        
        Write-Host "Installing Playwright browsers..." -ForegroundColor Yellow
        & npx playwright install chromium
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Playwright installation completed successfully" -ForegroundColor Green
            
            Set-Location -Path "register-login-recovery-script"
            Write-Host "Running Register-Login-Recovery script..." -ForegroundColor Yellow
            & node Register_login_Recovery.js
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Script completed successfully!" -ForegroundColor Green
                Write-Host "Check the following files for results:" -ForegroundColor Cyan
                Write-Host "- registration_data.csv (test data)" -ForegroundColor White
                Write-Host "- screenshots/ (registration_success.png, login_success.png, password_recovery.png)" -ForegroundColor White
                Write-Host "- test-reports/ (HTML test reports)" -ForegroundColor White
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
