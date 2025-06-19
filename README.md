# Playwright Automation Scripts

This project contains multiple Playwright automation scripts for different purposes, organized in separate folders for better maintainability.

## Project Structure

```
📦 Playwright_projects/
├── 📁 temp-email-script/           # Temporary email automation
│   ├── temp_email.js               # Main script
│   ├── run_temp_email.bat          # Windows batch file
│   ├── run_temp_email.ps1          # PowerShell script
│   └── README.md                   # Script documentation
├── 📁 register-login-recovery-script/  # User registration flow
│   ├── Register_login_Recovery.js  # Main script
│   ├── Register_Login_Recovery_README.md  # Detailed documentation
│   ├── run_register_login_recovery.bat    # Windows batch file
│   ├── run_register_login_recovery.ps1    # PowerShell script
│   ├── registration_data.csv       # Generated test data
│   └── *.png                       # Generated screenshots
├── 📁 docs/                        # Documentation and guides
│   ├── EXECUTION_GUIDE.md          # General execution guide
│   └── setup_helper.js             # Setup utilities
├── package.json                    # Project dependencies
├── playwright.config.js            # Playwright configuration
└── README.md                       # This file
```

## Scripts Overview

### 1. Temp Email Script (`temp-email-script/`)

- **Purpose**: Automates temporary email generation from temp-mail.org
- **Features**:
  - Opens temp-mail.org in Chrome
  - Generates new temporary email
  - Saves email to text file
- **Run**: `cd temp-email-script && node temp_email.js`

### 2. Register-Login-Recovery Script (`register-login-recovery-script/`)

- **Purpose**: Complete user registration, login, and password recovery flow
- **Features**:
  - User registration with form filling
  - Data export to CSV
  - Login verification
  - Password recovery testing
  - Screenshot capture at each step
- **Run**: `cd register-login-recovery-script && node Register_login_Recovery.js`

## Quick Setup

1. **Install Node.js** (if not already installed)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Install Playwright browsers**:
   ```bash
   npx playwright install chromium
   ```
4. **Run any script** by navigating to its folder and using the provided batch/PowerShell files

## Usage

### Running Scripts

Each script folder contains multiple ways to run the automation:

- **Batch File** (Windows): `run_scriptname.bat`
- **PowerShell**: `powershell -ExecutionPolicy Bypass -File run_scriptname.ps1`
- **Direct Node.js**: `node scriptname.js`

### Output Files

- Each script generates its own output files in its respective folder
- Screenshots are automatically saved for verification
- Data files (CSV) are created for registration flows

## Troubleshooting

- Check individual script README files for specific guidance
- Ensure Chrome browser is installed
- Run commands as Administrator if needed
- Check `docs/EXECUTION_GUIDE.md` for detailed setup instructions
