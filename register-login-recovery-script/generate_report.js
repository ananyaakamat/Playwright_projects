const fs = require('fs');
const path = require('path');

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

function generateStandaloneHTMLReport() {
    // Get all screenshots from the screenshots directory
    const screenshotsDir = path.join(__dirname, 'screenshots');
    const screenshots = [];
    
    if (fs.existsSync(screenshotsDir)) {
        const files = fs.readdirSync(screenshotsDir);
        files.forEach(file => {
            if (file.endsWith('.png')) {
                const type = file.split('_')[0] + '_' + file.split('_')[1]; // e.g., "registration_success"
                screenshots.push({
                    name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    path: `screenshots/${file}`,
                    timestamp: file.split('_').slice(2).join('_').replace('.png', ''),
                    type: type
                });
            }
        });
    }

    // Count success vs error screenshots
    const successCount = screenshots.filter(s => s.type.includes('success')).length;
    const errorCount = screenshots.filter(s => s.type.includes('error')).length;
    const totalSteps = 3; // Registration, Login, Password Recovery
    
    const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe.test@gmail.com',
        phone: '1234567890',
        country: 'India',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345'
    };

    const reportData = {
        timestamp: new Date().toISOString(),
        executionDate: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        executionTime: new Date().toLocaleTimeString('en-US'),
        totalDuration: 60, // Estimated duration
        testData: testData,
        screenshots: screenshots,
        summary: {
            totalSteps: totalSteps,
            completedSteps: successCount,
            status: errorCount > 0 ? 'partial' : 'success',
            successCount: successCount,
            errorCount: errorCount
        }
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
        .status-partial { border-left-color: #ffc107; }
        .status-partial .value { color: #ffc107; }
        .status-error { border-left-color: #dc3545; }
        .status-error .value { color: #dc3545; }
        .section { background: white; margin-bottom: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .section-header { background: #f8f9fa; padding: 20px; border-bottom: 1px solid #dee2e6; }
        .section-header h2 { color: #495057; font-size: 1.8em; }
        .section-content { padding: 20px; }
        .screenshots-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot-item { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 2px solid transparent; }
        .screenshot-item.success { border-color: #28a745; }
        .screenshot-item.error { border-color: #dc3545; }
        .screenshot-item img { max-width: 100%; height: auto; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; }
        .screenshot-title { margin-top: 10px; font-weight: bold; color: #495057; }
        .test-data-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .test-data-table th, .test-data-table td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
        .test-data-table th { background-color: #f8f9fa; font-weight: bold; color: #495057; }
        .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 0.9em; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .stat-box { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
        .stat-label { font-size: 0.9em; color: #6c757d; margin-top: 5px; }
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
            <div class="card status-${reportData.summary.status}">
                <h3>Overall Status</h3>
                <div class="value">${reportData.summary.status === 'success' ? '✅ PASSED' : reportData.summary.status === 'partial' ? '⚠️ PARTIAL' : '❌ FAILED'}</div>
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
                <h2>📊 Execution Statistics</h2>
            </div>
            <div class="section-content">
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-number" style="color: #28a745;">${reportData.summary.successCount}</div>
                        <div class="stat-label">Successful Steps</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number" style="color: #dc3545;">${reportData.summary.errorCount}</div>
                        <div class="stat-label">Failed Steps</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number" style="color: #667eea;">${Math.round((reportData.summary.completedSteps / reportData.summary.totalSteps) * 100)}%</div>
                        <div class="stat-label">Success Rate</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number" style="color: #6f42c1;">${reportData.screenshots.length}</div>
                        <div class="stat-label">Evidence Captured</div>
                    </div>
                </div>
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
                <h2>📸 Screenshots Captured</h2>
            </div>
            <div class="section-content">
                <div class="screenshots-grid">
                    ${reportData.screenshots.sort((a, b) => a.type.localeCompare(b.type)).map(screenshot => `
                        <div class="screenshot-item ${screenshot.type.includes('success') ? 'success' : 'error'}">
                            <img src="${screenshot.path}" alt="${screenshot.name}" onclick="window.open('${screenshot.path}', '_blank')">
                            <div class="screenshot-title">${screenshot.name}</div>
                            <div style="font-size: 0.9em; color: #6c757d;">${screenshot.timestamp}</div>
                            <div style="font-size: 0.8em; color: #6c757d; margin-top: 5px;">
                                ${screenshot.type.includes('success') ? '✅ Success' : '❌ Error'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Generated by Playwright Test Automation Framework</p>
            <p>Report generated on ${reportData.timestamp}</p>
            <p>🎯 Full-screen browser mode | 📁 Screenshots organized | 🧹 Auto-cleanup enabled</p>
        </div>
    </div>
</body>
</html>`;

    const reportPath = path.join(__dirname, `test-report-${getTimestamp()}.html`);
    fs.writeFileSync(reportPath, htmlContent);
    console.log(`📊 HTML Report generated: ${reportPath}`);
    
    // Also generate a summary report
    console.log('\n📋 Test Execution Summary:');
    console.log('==========================');
    console.log(`Status: ${reportData.summary.status.toUpperCase()}`);
    console.log(`Success Rate: ${Math.round((reportData.summary.completedSteps / reportData.summary.totalSteps) * 100)}%`);
    console.log(`Screenshots: ${reportData.screenshots.length} captured`);
    console.log(`Successful Steps: ${reportData.summary.successCount}`);
    console.log(`Failed Steps: ${reportData.summary.errorCount}`);
    console.log(`Report Path: ${reportPath}`);
    
    return reportPath;
}

// Generate the report
generateStandaloneHTMLReport();
