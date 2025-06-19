# Playwright Automation Scripts

This project contains Playwright automation scripts for register-login-recovery flows, organized for better maintainability.

## Project Structure

```
📦 Playwright_projects/
├── 📁 register-login-recovery-script/  # User registration flow
│   ├── Register_login_Recovery.js  # Main script
│   ├── Register_Login_Recovery_README.md  # Detailed documentation
│   ├── run_register_login_recovery.ps1    # PowerShell script
│   ├── registration_data.csv       # Generated test data
│   ├── screenshots/                # Generated screenshots
│   └── test-reports/               # HTML test reports
├── 📁 docs/                        # Documentation and guides
│   └── EXECUTION_GUIDE.md          # General execution guide
├── package.json                    # Project dependencies
├── playwright.config.js            # Playwright configuration
└── README.md                       # This file
```

## Scripts Overview

### Register-Login-Recovery Script (`register-login-recovery-script/`)

-   **Purpose**: Complete user registration, login, and password recovery flow
-   **Features**:
    -   User registration with form filling
    -   Data export to CSV
    -   Login verification
    -   Password recovery testing
    -   Screenshot capture at each step
    -   HTML test reports with embedded screenshots
-   **Run**: `cd register-login-recovery-script && .\run_register_login_recovery.ps1`

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

The register-login-recovery script can be run using:

-   **PowerShell**: `.\run_register_login_recovery.ps1`
-   **Direct Node.js**: `node Register_login_Recovery.js`

### Output Files

-   Screenshots are automatically saved in the `screenshots/` folder for verification
-   HTML test reports are generated in the `test-reports/` folder with embedded screenshots
-   Registration data is exported to `registration_data.csv`
-   Only the last 3 files of each type are kept to maintain a clean workspace

## Troubleshooting

-   Check individual script README files for specific guidance
-   Ensure Chrome browser is installed
-   Run commands as Administrator if needed
-   Check `docs/EXECUTION_GUIDE.md` for detailed setup instructions
