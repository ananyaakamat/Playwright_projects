# How to Run Playwright Scripts

This guide explains how to run the different Playwright automation scripts in this project.

## Project Structure

The project is organized into separate folders for each script:

- `temp-email-script/` - Temporary email automation
- `register-login-recovery-script/` - User registration workflow automation
- `docs/` - Documentation and guides

## Prerequisites

1. **Node.js** must be installed on your system
2. **Chrome browser** should be installed
3. **Internet connection** for accessing test websites

## Quick Start

### First Time Setup

1. Navigate to the main project directory: `d:\Anant\Playwright_projects`
2. Install dependencies: `npm install`
3. Install Playwright browsers: `npx playwright install chromium`

### Running Scripts

Each script folder contains multiple execution methods:

## Temp Email Script

**Navigate to**: `d:\Anant\Playwright_projects\temp-email-script\`

### Method 1: Command Prompt (Recommended)

```cmd
run_temp_email.bat
```

### Method 2: PowerShell with Bypass

```powershell
powershell -ExecutionPolicy Bypass -File run_temp_email.ps1
```

### Method 3: Direct Node.js

```cmd
node temp_email.js
```

## Register-Login-Recovery Script

**Navigate to**: `d:\Anant\Playwright_projects\register-login-recovery-script\`

### Method 1: Command Prompt (Recommended)

```cmd
run_register_login_recovery.bat
```

### Method 2: PowerShell with Bypass

```powershell
powershell -ExecutionPolicy Bypass -File run_register_login_recovery.ps1
```

### Method 3: Direct Node.js

```cmd
node Register_login_Recovery.js
```

## Alternative Setup Methods

### Method 1: Fix PowerShell Execution Policy (One-time setup)

1. Open PowerShell as Administrator
2. Set execution policy:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. After this, you can run npm and npx commands normally

### Method 2: Manual Steps

1. Open Command Prompt as Administrator
2. Navigate to the main project directory
3. Install packages: `npm install`
4. Install Playwright browsers: `npx playwright install chromium`
5. Navigate to the specific script folder
6. Run the script: `node scriptname.js`

## Expected Outputs

### Temp Email Script

- Creates `temp_email.txt` with the generated email address
- May create debug screenshots if errors occur

### Register-Login-Recovery Script

- `registration_data.csv` - Test data used for registration
- `registration_success.png` - Screenshot of successful registration
- `login_success.png` - Screenshot of successful login
- `password_recovery.png` - Screenshot of password recovery confirmation

## Troubleshooting

### Common Issues

1. **PowerShell execution policy errors**: Use the batch files or fix execution policy
2. **Module not found errors**: Run `npm install` from the main project directory
3. **Browser not found**: Run `npx playwright install chromium`
4. **Permission errors**: Run commands as Administrator

### Debug Information

- Error screenshots are automatically saved when issues occur
- Check console output for detailed step-by-step progress
- Each script has robust error handling with fallback selectors

### Getting Help

- Check individual script README files for specific guidance
- Ensure all prerequisites are met
- Try running scripts one at a time to isolate issues
