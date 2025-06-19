# Temp Email Script

## Overview

This script automates the process of getting a temporary email from temp-mail.org using Playwright.

## Features

- Opens temp-mail.org in Chrome browser
- Clicks the delete button to generate a new email
- Waits for the new email to be created
- Copies the email address to a text file named `temp_email.txt`

## Files in this folder

- `temp_email.js` - Main Playwright script
- `run_temp_email.bat` - Windows batch file for easy execution
- `run_temp_email.ps1` - PowerShell script with execution policy bypass

## How to Run

### Method 1: Batch File (Recommended)

```cmd
run_temp_email.bat
```

### Method 2: PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File run_temp_email.ps1
```

### Method 3: Direct Node.js

```cmd
node temp_email.js
```

## Output

The script creates a file called `temp_email.txt` containing the temporary email address.

## Configuration

- Change `headless: false` to `headless: true` in the script to run without opening the browser window
- Adjust timeout values if the website is slow to load
- Modify selectors in the script if the website structure changes

## Prerequisites

- Node.js and npm installed
- Playwright package installed in the parent directory
- Chrome browser installed
