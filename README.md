# Temp Email Playwright Script

This project contains a Playwright script that automates the process of getting a temporary email from temp-mail.org.

## Features

- Opens temp-mail.org in Chrome browser
- Clicks the delete button to generate a new email
- Waits for the new email to be created
- Copies the email address to a text file named `temp_email.txt`

## Setup

1. Make sure you have Node.js installed on your system
2. Run the batch file to install dependencies and execute the script:
   ```
   run_temp_email.bat
   ```

## Manual Setup (if batch file doesn't work)

1. Install dependencies:

   ```
   npm install
   ```

2. Install Playwright browsers:

   ```
   npx playwright install chromium
   ```

3. Run the script:
   ```
   node temp_email.js
   ```

## Output

The script will create a file called `temp_email.txt` containing the temporary email address.

## Troubleshooting

- If the script fails, check the error messages in the console
- Screenshots are taken automatically for debugging purposes when errors occur
- The script uses multiple fallback selectors to find elements on the page
- If PowerShell execution policies prevent running npm commands, use the provided batch file

## Configuration

- Change `headless: false` to `headless: true` in the script to run without opening the browser window
- Adjust timeout values if the website is slow to load
- Modify selectors in the script if the website structure changes
