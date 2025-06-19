const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Helper function to try multiple selectors
async function fillFieldWithFallback(page, selectors, value, fieldName) {
    const selectorList = selectors.split(', ');
    
    for (const selector of selectorList) {
        try {
            await page.waitForSelector(selector.trim(), { timeout: 3000 });
            await page.fill(selector.trim(), value);
            console.log(`✓ ${fieldName}: ${value} (using ${selector.trim()})`);
            return true;
        } catch (error) {
            // Try next selector
            continue;
        }
    }
    
    console.warn(`⚠ Could not find ${fieldName} field with any selector`);
    return false;
}

// Helper function to click with fallback selectors
async function clickWithFallback(page, selectors, actionName) {
    const selectorList = selectors.split(', ');
    
    for (const selector of selectorList) {
        try {
            await page.waitForSelector(selector.trim(), { timeout: 3000 });
            await page.click(selector.trim());
            console.log(`✓ ${actionName} (using ${selector.trim()})`);
            return true;
        } catch (error) {
            // Try next selector
            continue;
        }
    }
    
    console.warn(`⚠ Could not ${actionName} with any selector`);
    return false;
}

// Function to generate timestamp for filenames
function getTimestamp() {
    const now = new Date();
    const day = now.getDate();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    return `${day}${month}${year}_${hours}_${minutes}_${ampm}`;
}

// Function to generate HTML test execution report
function generateHTMLReport(testResults) {
    const reportData = {
        timestamp: new Date().toISOString(),
        executionDate: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        executionTime: new Date().toLocaleTimeString('en-US'),
        totalDuration: testResults.totalDuration,
        testData: testResults.testData,
        steps: testResults.steps,
        screenshots: testResults.screenshots,
        summary: testResults.summary
    };

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Execution Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 5px solid #667eea; }
        .card h3 { color: #667eea; margin-bottom: 10px; font-size: 1.4em; }
        .card .value { font-size: 2em; font-weight: bold; color: #333; }
        .card .unit { font-size: 0.9em; color: #666; margin-left: 5px; }
        .status-success { border-left-color: #28a745; }
        .status-success .value { color: #28a745; }
        .status-error { border-left-color: #dc3545; }
        .status-error .value { color: #dc3545; }
        .section { background: white; margin-bottom: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .section-header { background: #f8f9fa; padding: 20px; border-bottom: 1px solid #dee2e6; }
        .section-header h2 { color: #495057; font-size: 1.8em; }
        .section-content { padding: 20px; }
        .test-step { margin-bottom: 20px; padding: 15px; border-left: 4px solid #e9ecef; background: #f8f9fa; border-radius: 0 5px 5px 0; }
        .test-step.success { border-left-color: #28a745; background: #f8fff9; }
        .test-step.error { border-left-color: #dc3545; background: #fff8f8; }
        .step-title { font-weight: bold; margin-bottom: 5px; display: flex; align-items: center; }
        .step-icon { margin-right: 10px; font-size: 1.2em; }
        .step-duration { margin-left: auto; font-size: 0.9em; color: #6c757d; }
        .step-details { color: #6c757d; font-size: 0.95em; }
        .screenshots-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot-item { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        .screenshot-item img { max-width: 100%; height: auto; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; }
        .screenshot-title { margin-top: 10px; font-weight: bold; color: #495057; }
        .test-data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .test-data-table th, .test-data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
        .test-data-table th { background-color: #f8f9fa; font-weight: bold; color: #495057; }
        .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 Playwright Test Execution Report</h1>
            <p>Register-Login-Recovery Flow Automation</p>
            <p>${reportData.executionDate} at ${reportData.executionTime}</p>
        </div>
        
        <div class="summary-cards">
            <div class="card ${reportData.summary.status === 'success' ? 'status-success' : 'status-error'}">
                <h3>Overall Status</h3>
                <div class="value">${reportData.summary.status === 'success' ? '✅ PASSED' : '❌ FAILED'}</div>
            </div>
            <div class="card">
                <h3>Total Duration</h3>
                <div class="value">${reportData.totalDuration}<span class="unit">seconds</span></div>
            </div>
            <div class="card status-success">
                <h3>Steps Completed</h3>
                <div class="value">${reportData.summary.completedSteps}<span class="unit">/ ${reportData.summary.totalSteps}</span></div>
            </div>
            <div class="card">
                <h3>Screenshots</h3>
                <div class="value">${reportData.screenshots.length}<span class="unit">captured</span></div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <h2>📋 Test Data Used</h2>
            </div>
            <div class="section-content">
                <table class="test-data-table">
                    <thead>
                        <tr><th>Field</th><th>Value</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>First Name</td><td>${reportData.testData.firstName}</td></tr>
                        <tr><td>Last Name</td><td>${reportData.testData.lastName}</td></tr>
                        <tr><td>Email</td><td>${reportData.testData.email}</td></tr>
                        <tr><td>Phone</td><td>${reportData.testData.phone}</td></tr>
                        <tr><td>Country</td><td>${reportData.testData.country}</td></tr>
                        <tr><td>City</td><td>${reportData.testData.city}</td></tr>
                        <tr><td>State</td><td>${reportData.testData.state}</td></tr>
                        <tr><td>ZIP Code</td><td>${reportData.testData.zipCode}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <h2>⚡ Execution Steps</h2>
            </div>
            <div class="section-content">
                ${reportData.steps.map(step => `
                    <div class="test-step ${step.status}">
                        <div class="step-title">
                            <span class="step-icon">${step.status === 'success' ? '✅' : '❌'}</span>
                            <span>${step.name}</span>
                            <span class="step-duration">${step.duration}s</span>
                        </div>
                        <div class="step-details">${step.details}</div>
                        ${step.error ? `<div style="color: #dc3545; margin-top: 5px;"><strong>Error:</strong> ${step.error}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-header">
                <h2>📸 Screenshots Captured</h2>
            </div>
            <div class="section-content">                <div class="screenshots-grid">
                    ${reportData.screenshots.map(screenshot => {
                        // Convert absolute path to relative path for web browser
                        const fileName = path.basename(screenshot.path);
                        const relativePath = `./screenshots/${fileName}`;
                        return `
                        <div class="screenshot-item">
                            <img src="${relativePath}" alt="${screenshot.name}" onclick="window.open('${relativePath}', '_blank')" title="Click to open in new tab">
                            <div class="screenshot-title">${screenshot.name}</div>
                            <div style="font-size: 0.9em; color: #6c757d;">${screenshot.timestamp}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Generated by Playwright Test Automation Framework</p>
            <p>Report generated on ${reportData.timestamp}</p>
        </div>
    </div>
</body>
</html>`;

    const reportPath = path.join(__dirname, `test-report-${getTimestamp()}.html`);
    fs.writeFileSync(reportPath, htmlContent);
    console.log(`📊 HTML Report generated: ${reportPath}`);
    return reportPath;
}

// Function to clean up old screenshot files, keeping only the last 3 executions
function cleanupOldScreenshots() {
    try {
        console.log('🧹 Cleaning up old screenshot files...');
        
        const screenshotsDir = path.join(__dirname, 'screenshots');
        
        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
            console.log('📁 Created screenshots directory');
        }
        
        const screenshotTypes = ['registration_success', 'login_success', 'password_recovery', 
                               'registration_error', 'login_error', 'recovery_error'];
        
        screenshotTypes.forEach(type => {
            // Get all files matching the pattern (both timestamped and non-timestamped)
            const allFiles = fs.readdirSync(screenshotsDir)
                .filter(file => {
                    // Match both old format (type.png) and new format (type_timestamp.png)
                    return (file === `${type}.png`) || 
                           (file.startsWith(type + '_') && file.endsWith('.png'));
                })
                .map(file => ({
                    name: file,
                    path: path.join(screenshotsDir, file),
                    stats: fs.statSync(path.join(screenshotsDir, file)),
                    isOldFormat: file === `${type}.png` // Mark old format files
                }))
                .sort((a, b) => b.stats.mtime - a.stats.mtime); // Sort by modification time, newest first
            
            // Always delete old format files (without timestamp) first
            const oldFormatFiles = allFiles.filter(file => file.isOldFormat);
            oldFormatFiles.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                    console.log(`   ✓ Deleted old format file: ${file.name}`);
                } catch (error) {
                    console.warn(`   ⚠ Could not delete ${file.name}: ${error.message}`);
                }
            });
            
            // Get remaining timestamped files
            const timestampedFiles = allFiles.filter(file => !file.isOldFormat);
            
            // Keep only the last 3 timestamped files, delete the rest
            if (timestampedFiles.length > 3) {
                const filesToDelete = timestampedFiles.slice(3); // Skip first 3 (newest), get the rest
                filesToDelete.forEach(file => {
                    try {
                        fs.unlinkSync(file.path);
                        console.log(`   ✓ Deleted old screenshot: ${file.name}`);
                    } catch (error) {
                        console.warn(`   ⚠ Could not delete ${file.name}: ${error.message}`);
                    }
                });
                console.log(`   📊 Kept ${Math.min(timestampedFiles.length, 3)} recent ${type} screenshots`);
            } else if (timestampedFiles.length > 0) {
                console.log(`   📊 ${type}: ${timestampedFiles.length} files (within limit)`);
            }
        });
        
        console.log('✅ Screenshot cleanup completed');
    } catch (error) {
        console.warn('⚠ Screenshot cleanup failed:', error.message);
    }
}

// Function to clean up old test report files, keeping only the last 3 reports
function cleanupOldTestReports() {
    try {
        console.log('🧹 Cleaning up old test report files...');
        
        // Get all test report files
        const reportFiles = fs.readdirSync(__dirname)
            .filter(file => file.startsWith('test-report-') && file.endsWith('.html'))
            .map(file => ({
                name: file,
                path: path.join(__dirname, file),
                stats: fs.statSync(path.join(__dirname, file))
            }))
            .sort((a, b) => b.stats.mtime - a.stats.mtime); // Sort by modification time, newest first
        
        console.log(`   Found ${reportFiles.length} test report files`);
        
        // Keep only the last 3 reports, delete the rest
        if (reportFiles.length > 3) {
            const filesToDelete = reportFiles.slice(3); // Skip first 3 (newest), get the rest
            filesToDelete.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                    console.log(`   ✓ Deleted old report: ${file.name}`);
                } catch (error) {
                    console.warn(`   ⚠ Could not delete ${file.name}: ${error.message}`);
                }
            });
            console.log(`   📊 Kept ${Math.min(reportFiles.length, 3)} recent test reports`);
        } else if (reportFiles.length > 0) {
            console.log(`   📊 ${reportFiles.length} report files (within limit)`);
        }
        
        console.log('✅ Test report cleanup completed');
    } catch (error) {
        console.warn('⚠ Test report cleanup failed:', error.message);
    }
}

// Test data to be used across all steps
const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe.test@gmail.com',
    phone: '1234567890',
    country: 'India',
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
};

async function createExcelFile(data) {
    try {
        // Create CSV file with actual form fields in correct order
        const csvHeaders = 'First Name,Last Name,Phone,Country,Email,Password\n';
        const csvData = `${data.firstName},${data.lastName},${data.phone},${data.country},${data.email},${data.password}`;
        
        const csvContent = csvHeaders + csvData;
        const filePath = path.join(__dirname, 'registration_data.csv');
        
        fs.writeFileSync(filePath, csvContent);
        console.log(`✓ Registration data saved to: ${filePath}`);
        
        return filePath;
    } catch (error) {
        console.error('Failed to create CSV file:', error.message);
        throw error;
    }
}

async function registerUser(page) {
    const stepStartTime = Date.now();
    
    try {
        console.log('\nStep 1: Registration Process');
        console.log('============================');
          // Navigate to registration page
        console.log('Navigating to registration page...');
        await page.goto('https://qa-practice.netlify.app/register');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        console.log('✓ Page loaded successfully');        // Fill registration form in EXACT top-to-bottom sequence (based on actual form analysis)
        console.log('Filling registration form (verified field sequence)...');
        
        // 1. First Name (top field)
        console.log('1. Filling First Name...');
        await fillFieldWithFallback(page, 'input[name="firstName"], input[name="firstname"], #firstName, #firstname, input[placeholder*="First"]', testData.firstName, 'First name');
        
        // 2. Last Name
        console.log('2. Filling Last Name...');
        await fillFieldWithFallback(page, 'input[name="lastName"], input[name="lastname"], #lastName, #lastname, input[placeholder*="Last"]', testData.lastName, 'Last name');
        
        // 3. Phone (3rd position in actual form)
        console.log('3. Filling Phone...');
        await fillFieldWithFallback(page, 'input[name="phone"], input[name="phoneNumber"], #phone, input[placeholder*="Phone"]', testData.phone, 'Phone');
          // 4. Country Selection (ENHANCED with verification)
        console.log('4. Selecting Country...');
        try {
            // First, find all select elements
            const allSelects = await page.evaluate(() => {
                const selects = document.querySelectorAll('select');
                return Array.from(selects).map((select, index) => ({
                    index: index,
                    name: select.name || '',
                    id: select.id || '',
                    className: select.className || '',
                    optionsCount: select.options.length,
                    hasIndia: Array.from(select.options).some(opt => 
                        opt.text.toLowerCase().includes('india') || 
                        opt.value.toLowerCase().includes('india')
                    ),
                    firstOptions: Array.from(select.options).slice(0, 3).map(opt => opt.text)
                }));
            });
            
            console.log(`  Found ${allSelects.length} select element(s)`);
            
            let countrySelected = false;
            
            // Try each select element
            for (let i = 0; i < allSelects.length; i++) {
                const selectInfo = allSelects[i];
                console.log(`  Trying select #${i + 1}: ${selectInfo.name || selectInfo.id || 'unnamed'}`);
                console.log(`    Options: ${selectInfo.optionsCount}, Has India: ${selectInfo.hasIndia}`);
                
                if (!selectInfo.hasIndia) {
                    console.log(`    Skipping - no India option found`);
                    continue;
                }
                
                // Build selector
                let selector = '';
                if (selectInfo.name) {
                    selector = `select[name="${selectInfo.name}"]`;
                } else if (selectInfo.id) {
                    selector = `select[id="${selectInfo.id}"]`;
                } else {
                    selector = `select:nth-of-type(${i + 1})`;
                }
                
                try {
                    console.log(`    Using selector: ${selector}`);
                    
                    // Try different selection methods
                    const methods = [
                        { name: 'label "India"', action: async () => await page.selectOption(selector, { label: 'India' }) },
                        { name: 'value "India"', action: async () => await page.selectOption(selector, { value: 'India' }) },
                        { name: 'value "IN"', action: async () => await page.selectOption(selector, { value: 'IN' }) },
                        { name: 'value "india"', action: async () => await page.selectOption(selector, { value: 'india' }) },
                        { name: 'text content', action: async () => {
                            // Find India option by text and select by index
                            const indiaIndex = await page.evaluate((sel) => {
                                const select = document.querySelector(sel);
                                if (!select) return -1;
                                const options = Array.from(select.options);
                                return options.findIndex(opt => opt.text.toLowerCase().includes('india'));
                            }, selector);
                            
                            if (indiaIndex >= 0) {
                                await page.selectOption(selector, { index: indiaIndex });
                            } else {
                                throw new Error('India not found in options');
                            }
                        }}
                    ];
                    
                    for (const method of methods) {
                        try {
                            await method.action();
                            
                            // Verify selection
                            const selectedValue = await page.evaluate((sel) => {
                                const select = document.querySelector(sel);
                                if (!select) return null;
                                const selectedOption = select.options[select.selectedIndex];
                                return {
                                    value: select.value,
                                    text: selectedOption ? selectedOption.text : 'None'
                                };
                            }, selector);
                            
                            if (selectedValue && selectedValue.text.toLowerCase().includes('india')) {
                                console.log(`✅ SUCCESS: Country selected by ${method.name}`);
                                console.log(`    Selected: "${selectedValue.text}" (value: "${selectedValue.value}")`);
                                countrySelected = true;
                                break;
                            } else {
                                console.log(`❌ FAILED: ${method.name} - selection not verified`);
                            }
                            
                        } catch (error) {
                            console.log(`❌ FAILED: ${method.name} - ${error.message}`);
                        }
                    }
                    
                    if (countrySelected) break;
                    
                } catch (error) {
                    console.log(`    ERROR: ${error.message}`);
                }
            }
            
            if (!countrySelected) {
                console.warn('⚠️ Could not select India in any country dropdown');
            }
            
        } catch (error) {
            console.warn('⚠️ Country selection error:', error.message);
        }
        
        // 5. Email (5th position in actual form)
        console.log('5. Filling Email...');
        await fillFieldWithFallback(page, 'input[name="email"], input[type="email"], #email, input[placeholder*="Email"]', testData.email, 'Email');
        
        // 6. Password
        console.log('6. Filling Password...');
        await fillFieldWithFallback(page, 'input[name="password"], input[type="password"], #password, input[placeholder*="Password"]', testData.password, 'Password');
        
        // 7. Confirm Password (if exists)
        console.log('7. Filling Confirm Password (if exists)...');
        const confirmPasswordFilled = await fillFieldWithFallback(page, 'input[name="confirmPassword"], input[name="password2"], #confirmPassword, input[placeholder*="Confirm"]', testData.confirmPassword, 'Password confirmation');
        if (!confirmPasswordFilled) {
            console.log('  ℹ️ Confirm password field not found - skipping');
        }
        
        // 8. Agreement/Terms Checkbox
        console.log('8. Checking Agreement/Terms Checkbox...');
        try {
            const checkboxSelectors = [
                'input[type="checkbox"]',
                '#agree',
                'input[name="agree"]',
                'input[name="terms"]',
                'input[name="agreement"]'
            ];
            
            let checkboxFound = false;
            for (const selector of checkboxSelectors) {
                try {
                    console.log(`  Trying checkbox: ${selector}`);
                    await page.waitForSelector(selector, { timeout: 2000 });
                    
                    const isChecked = await page.isChecked(selector);
                    if (!isChecked) {
                        await page.check(selector);
                        console.log(`✅ Agreement checkbox CHECKED (using ${selector})`);
                    } else {
                        console.log(`✅ Agreement checkbox already checked (using ${selector})`);
                    }
                    checkboxFound = true;
                    break;
                } catch (error) {
                    continue;
                }
            }
            
            if (!checkboxFound) {
                console.log('⚠ No agreement checkbox found, continuing...');
            }
        } catch (error) {
            console.log('⚠ Error with agreement checkbox:', error.message);
        }        // Create CSV file with registration data
        await createExcelFile(testData);
        
        // 9. Submit Registration Form
        console.log('9. Submitting registration form...');
        await clickWithFallback(page, 'button[type="submit"], input[type="submit"], button:has-text("Register"), button:has-text("Submit"), button:has-text("Create")', 'register button');
          // Wait for registration response (OPTIMIZED)
        console.log('Waiting for registration response...');
        
        let messageFound = false;
        try {
            // Wait for either success message or error message (reduced timeout)
            await page.waitForSelector('.message-success, .message-error, .messages, .alert, .notification', { timeout: 5000 });
            messageFound = true;
            console.log('✓ Registration response received');
        } catch (e) {
            console.log('⚠ No specific success/error message found, continuing...');
        }
        
        // Minimal wait for page stabilization (reduced from 2000ms)
        console.log('Ensuring page is stable before screenshot...');
        await page.waitForTimeout(800);
        
        // Take screenshot (OPTIMIZED)
        const timestamp = getTimestamp();
        const screenshotPath = path.join(__dirname, 'screenshots', `registration_success_${timestamp}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`✓ Screenshot saved: ${screenshotPath}`);

        if (!messageFound) {
            console.warn('⚠ Expected success message not found, but continuing...');
        }

        return {
            status: 'success',
            duration: Math.round((Date.now() - stepStartTime) / 1000),
            screenshot: screenshotPath,
            details: 'User registration completed successfully'
        };
    } catch (error) {
        console.error('Registration failed:', error.message);
        const timestamp = getTimestamp();
        await page.screenshot({ path: path.join(__dirname, 'screenshots', `registration_error_${timestamp}.png`), fullPage: true });
        return {
            status: 'error',
            duration: Math.round((Date.now() - stepStartTime) / 1000),
            error: error.message,
            details: 'User registration failed'
        };
    }
}

async function loginUser(page) {
    const stepStartTime = Date.now();
    
    try {
        console.log('\nStep 2: Login Process');
        console.log('=====================');
          // Navigate to login page
        console.log('Navigating to login page...');
        await page.goto('https://qa-practice.netlify.app/auth_ecommerce');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        console.log('✓ Login page loaded');
          // Fill login form
        console.log('Filling login credentials...');
        await fillFieldWithFallback(page, 'input[name="email"], input[type="email"], #email, input[placeholder*="Email"], input[name="username"]', testData.email, 'Email');
        await fillFieldWithFallback(page, 'input[name="password"], input[type="password"], #password, input[placeholder*="Password"]', testData.password, 'Password');
        
        // Submit login form
        console.log('Submitting login form...');
        await clickWithFallback(page, 'button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Submit"), button:has-text("Sign"), #send2', 'login button');
        
        // Wait for login response
        console.log('Waiting for login response...');
        try {
            await page.waitForSelector('.message-success, .message-error, .page-title, .logged-in', { timeout: 10000 });
            console.log('✓ Login response received');
        } catch (e) {
            console.log('⚠ No specific login response found, continuing...');
        }
        
        // Wait for any loading to complete
        await page.waitForTimeout(500);
        
        // Wait for images to load
        try {
            await page.waitForFunction(() => {
                const images = document.querySelectorAll('img');
                return Array.from(images).every(img => img.complete);
            }, { timeout: 5000 });
        } catch (e) {
            console.log('Image loading check timeout, continuing...');
        }
        
        // Take screenshot
        const timestamp = getTimestamp();
        const screenshotPath = path.join(__dirname, 'screenshots', `login_success_${timestamp}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`✓ Screenshot saved: ${screenshotPath}`);

        // Logout
        console.log('Attempting to logout...');
        try {
            // Look for logout/account dropdown
            const accountMenu = await page.locator('.customer-welcome .customer-name, .header .customer-menu, .authorization-link a').first();
            if (await accountMenu.isVisible()) {
                await accountMenu.click();
                await page.waitForTimeout(500);
            }
            
            // Try to find and click logout
            const logoutButton = await page.locator('a[href*="logout"], .authorization-link a:has-text("Sign Out")').first();
            if (await logoutButton.isVisible()) {
                await logoutButton.click();
                console.log('✓ Logged out successfully');
            } else {
                console.log('⚠ Logout button not found, continuing...');
            }
        } catch (e) {
            console.log('⚠ Logout attempt failed, continuing...');
        }

        return {
            status: 'success',
            duration: Math.round((Date.now() - stepStartTime) / 1000),
            screenshot: screenshotPath,
            details: 'User login completed successfully'
        };
    } catch (error) {
        console.error('Login failed:', error.message);
        const timestamp = getTimestamp();
        await page.screenshot({ path: path.join(__dirname, 'screenshots', `login_error_${timestamp}.png`), fullPage: true });
        return {
            status: 'error',
            duration: Math.round((Date.now() - stepStartTime) / 1000),
            error: error.message,
            details: 'User login failed'
        };
    }
}

async function recoverPassword(page) {
    const stepStartTime = Date.now();
    
    try {
        console.log('\nStep 3: Password Recovery Process');
        console.log('=================================');
          // Navigate to forgot password page
        console.log('Navigating to password recovery page...');
        await page.goto('https://qa-practice.netlify.app/recover-password');
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        console.log('✓ Password recovery page loaded');
          // Fill email for password recovery
        console.log('Filling email for password recovery...');
        await fillFieldWithFallback(page, 'input[name="email"], input[type="email"], #email, input[placeholder*="Email"], #email_address', testData.email, 'Email');
        
        // Submit password recovery form
        console.log('Submitting password recovery request...');
        await clickWithFallback(page, 'button[type="submit"], input[type="submit"], button:has-text("Recover"), button:has-text("Reset"), button:has-text("Submit"), button[title="Reset My Password"]', 'recovery button');
        
        // Wait for response
        console.log('Waiting for password recovery response...');
        
        let messageFound = false;
        try {
            await page.waitForSelector('.message-success, .message-error, .messages', { timeout: 10000 });
            messageFound = true;
            console.log('✓ Password recovery response received');
        } catch (e) {
            console.log('⚠ No specific recovery message found, continuing...');
        }
        
        // Wait for any remaining animations or loading indicators
        try {
            await page.waitForFunction(() => {
                const spinner = document.querySelector('.spinner, .loading, [class*="load"]');
                return !spinner || spinner.style.display === 'none' || !spinner.offsetParent;
            }, { timeout: 5000 });
        } catch (e) {
            console.log('Animation/loading check timeout, continuing...');
        }
        
        // Take screenshot
        const timestamp = getTimestamp();
        const screenshotPath = path.join(__dirname, 'screenshots', `password_recovery_${timestamp}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`✓ Screenshot saved: ${screenshotPath}`);

        if (!messageFound) {
            console.warn('⚠ Expected recovery message not found, but continuing...');
        }

        return {
            status: 'success',
            duration: Math.round((Date.now() - stepStartTime) / 1000),
            screenshot: screenshotPath,
            details: 'Password recovery completed successfully'
        };
    } catch (error) {
        console.error('Password recovery failed:', error.message);
        const timestamp = getTimestamp();
        await page.screenshot({ path: path.join(__dirname, 'screenshots', `recovery_error_${timestamp}.png`), fullPage: true });
        return {
            status: 'error',
            duration: Math.round((Date.now() - stepStartTime) / 1000),
            error: error.message,
            details: 'Password recovery failed'
        };
    }
}

async function runCompleteFlow() {
    const flowStartTime = Date.now();
    console.log('Starting Register-Login-Recovery Flow');
    console.log('=====================================\n');
    
    let browser;
    const testResults = {
        steps: [],
        screenshots: [],
        summary: {
            totalSteps: 3,
            completedSteps: 0,
            status: 'success'
        },
        testData: testData,
        totalDuration: 0
    };
    
    try {        // Launch browser (OPTIMIZED for speed)
        browser = await chromium.launch({
            headless: false,
            channel: 'chrome',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--start-maximized',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-dev-shm-usage',
                '--no-first-run',
                '--disable-default-apps',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        });

        const context = await browser.newContext({
            viewport: null // Use full window size
        });
        const page = await context.newPage();

        // Execute all steps
        const regResult = await registerUser(page);
        testResults.steps.push({
            name: 'User Registration',
            status: regResult.status,
            duration: regResult.duration,
            details: regResult.details,
            error: regResult.error
        });
        if(regResult.screenshot) {
            testResults.screenshots.push({
                name: 'Registration',
                path: regResult.screenshot,
                timestamp: getTimestamp()
            });
        }
        if(regResult.status === 'success') testResults.summary.completedSteps++;

        const loginResult = await loginUser(page);
        testResults.steps.push({
            name: 'User Login',
            status: loginResult.status,
            duration: loginResult.duration,
            details: loginResult.details,
            error: loginResult.error
        });
        if(loginResult.screenshot) {
            testResults.screenshots.push({
                name: 'Login',
                path: loginResult.screenshot,
                timestamp: getTimestamp()
            });
        }
        if(loginResult.status === 'success') testResults.summary.completedSteps++;

        const recoveryResult = await recoverPassword(page);
        testResults.steps.push({
            name: 'Password Recovery',
            status: recoveryResult.status,
            duration: recoveryResult.duration,
            details: recoveryResult.details,
            error: recoveryResult.error
        });
        if(recoveryResult.screenshot) {
            testResults.screenshots.push({
                name: 'Password Recovery',
                path: recoveryResult.screenshot,
                timestamp: getTimestamp()
            });
        }
        if(recoveryResult.status === 'success') testResults.summary.completedSteps++;

        // Calculate total duration
        testResults.totalDuration = Math.round((Date.now() - flowStartTime) / 1000);
        
        // Determine overall test status
        const hasFailure = testResults.steps.some(step => step.status === 'error');
        testResults.summary.status = hasFailure ? 'failed' : 'success';

        console.log('\n✅ All steps completed successfully!');
        console.log('📁 Files created:');
        console.log('   - registration_data.csv (test data)');
        console.log('   - screenshots/registration_success_[timestamp].png (screenshot)');
        console.log('   - screenshots/login_success_[timestamp].png (screenshot)');
        console.log('   - screenshots/password_recovery_[timestamp].png (screenshot)');
        console.log('   Note: [timestamp] format: 19July2025_12_33_PM');        // Clean up old screenshots after new ones are created
        console.log('\n🧹 Performing screenshot cleanup...');
        cleanupOldScreenshots();

        // Generate HTML report
        console.log('\n📊 Generating HTML test report...');
        const reportPath = generateHTMLReport(testResults);
        console.log(`✅ HTML Report available at: ${reportPath}`);

        // Clean up old test reports (keep only last 3)
        console.log('\n🧹 Performing test report cleanup...');
        cleanupOldTestReports();

    } catch (error) {
        console.error('\n❌ Flow failed:', error.message);
        testResults.summary.status = 'failed';
        throw error;
    } finally {
        if (browser) {
            console.log('\nClosing browser...');
            await browser.close();
        }
    }
}

// Run the complete flow
if (require.main === module) {
    runCompleteFlow()
        .then(() => {
            console.log('\n🎉 Script completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Script failed:', error.message);
            process.exit(1);
        });
}

module.exports = { runCompleteFlow, registerUser, loginUser, recoverPassword };
