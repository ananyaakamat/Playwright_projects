# Register-Login-Recovery Playwright Script

## Overview

This Playwright script automates a complete user registration, login, and password recovery flow for the QA Practice website. It demonstrates end-to-end testing of user authentication workflows.

## Features

- **Registration**: Creates a new user account with comprehensive form filling
- **Data Storage**: Saves all registration data to a CSV file for reference
- **Login**: Authenticates using the registered credentials
- **Screenshots**: Captures screenshots at each major step for verification
- **Password Recovery**: Tests the password recovery functionality
- **Error Handling**: Robust error handling with fallback selectors

## Test Flow

### Step 1: User Registration

- Navigates to: `https://qa-practice.netlify.app/register`
- Fills all required fields with test data:
  - First Name: John
  - Last Name: Doe
  - Email: john.doe.test@gmail.com
  - Phone: 1234567890
  - Address: 123 Test Street
  - City: Test City
  - State: Test State
  - Zip Code: 12345
  - Country: United States
  - Password: TestPassword123!
- Checks the agreement checkbox
- Saves all data to `registration_data.csv`
- Clicks Register button
- Verifies success message: "The account has been successfully created!"
- Takes screenshot: `registration_success.png`

### Step 2: User Login

- Navigates to: `https://qa-practice.netlify.app/auth_ecommerce`
- Enters login credentials from Step 1
- Clicks Login button
- Verifies page title contains "SHOPPING CART"
- Takes screenshot: `login_success.png`
- Attempts to logout

### Step 3: Password Recovery

- Navigates to: `https://qa-practice.netlify.app/recover-password`
- Enters the registered email address
- Clicks "Recover Password" button
- Verifies success message: "An email with the new password has been sent to xyz@gmail.com. Please verify your inbox!"
- Takes screenshot: `password_recovery.png`
- Closes browser

## Files Generated

1. **`registration_data.csv`** - CSV file containing all registration data
2. **`registration_success.png`** - Screenshot of successful registration
3. **`login_success.png`** - Screenshot of successful login
4. **`password_recovery.png`** - Screenshot of password recovery confirmation

## How to Run

### Method 1: Batch File (Windows)

```cmd
run_register_login_recovery.bat
```

### Method 2: PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File run_register_login_recovery.ps1
```

### Method 3: Direct Node.js

```cmd
node Register_login_Recovery.js
```

## Script Features

### Robust Element Detection

- Uses multiple fallback selectors for each form field
- Handles different website layouts and element naming conventions
- Continues execution even if some optional elements are not found

### Error Handling

- Comprehensive try-catch blocks
- Automatic error screenshots for debugging
- Graceful degradation when elements are not found

### Data Management

- Structured test data object for easy modification
- CSV export functionality for data persistence
- Timestamp recording for audit trails

## Configuration

### Test Data

You can modify the test data by editing the `testData` object in the script:

```javascript
const testData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe.test@gmail.com",
  // ... other fields
};
```

### Browser Settings

- Runs in visible mode (headless: false) for monitoring
- Uses Chrome browser specifically
- Includes sandbox bypass arguments for compatibility

## Troubleshooting

### Common Issues

1. **Element not found**: The script uses multiple selector fallbacks
2. **Timeout errors**: Increase timeout values in the script if needed
3. **Browser not opening**: Ensure Chrome is installed and Playwright browsers are set up

### Debug Files

- Error screenshots are automatically saved when issues occur
- Check console output for detailed step-by-step progress
- CSV file creation confirms data handling is working

## Requirements

- Node.js installed
- Playwright package installed
- Chrome browser installed
- Internet connection for accessing test websites

## Success Criteria

- All three steps complete without errors
- Four files are generated (1 CSV + 3 screenshots)
- Console shows "Script completed successfully!" message
- Screenshots show expected content at each step
