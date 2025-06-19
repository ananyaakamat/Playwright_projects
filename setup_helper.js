// Simple temp email script without external dependencies
const fs = require('fs');
const path = require('path');

console.log('Temp Email Script');
console.log('==================');
console.log('');
console.log('Due to PowerShell execution policy restrictions, please follow these steps:');
console.log('');
console.log('1. Open Command Prompt (cmd) as Administrator');
console.log('2. Navigate to this directory:');
console.log('   cd "d:\\Anant\\Playwright_projects"');
console.log('');
console.log('3. Install npm packages:');
console.log('   npm install');
console.log('');
console.log('4. Install Playwright browsers:');
console.log('   npx playwright install chromium');
console.log('');
console.log('5. Run the main script:');
console.log('   node temp_email.js');
console.log('');
console.log('Alternatively, you can:');
console.log('- Run the batch file: run_temp_email.bat');
console.log('- Or set PowerShell execution policy: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser');
console.log('');

// Create a sample temp_email.txt file to show the expected output format
const sampleEmail = 'example@temp-mail.org';
const filePath = path.join(__dirname, 'temp_email_sample.txt');
fs.writeFileSync(filePath, sampleEmail, 'utf8');
console.log(`Sample output file created: ${filePath}`);
console.log(`Sample email: ${sampleEmail}`);
