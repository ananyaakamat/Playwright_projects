const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function getTempEmail() {    // Launch browser
    const browser = await chromium.launch({ 
        headless: false,  // Set to true if you want headless mode
        channel: 'chrome', // Use Chrome browser
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {        console.log('Navigating to temp-mail.org...');
        
        // Navigate to temp-mail.org with simpler approach
        await page.goto('https://temp-mail.org/en/');
        
        console.log('Page loaded, waiting for content...');
        
        // Wait for page to be ready
        await page.waitForLoadState('domcontentloaded');
        
        // Wait for the page to load completely
        await page.waitForTimeout(3000);
        
        // Look for delete button - it might have different selectors
        const deleteButtonSelectors = [
            'button[title="Delete"]',
            'button:has-text("Delete")',
            '.delete-button',
            '[data-test="delete"]',
            'button.delete',
            'a[title="Delete"]'
        ];
        
        let deleteButton = null;
        for (const selector of deleteButtonSelectors) {
            try {
                deleteButton = await page.locator(selector).first();
                if (await deleteButton.isVisible({ timeout: 2000 })) {
                    console.log(`Found delete button with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!deleteButton || !(await deleteButton.isVisible())) {
            console.log('Delete button not found with common selectors. Taking screenshot for debugging...');
            await page.screenshot({ path: 'temp-mail-debug.png', fullPage: true });
            
            // Try to find any button that might be the delete button
            const allButtons = await page.locator('button, a[role="button"]').all();
            console.log(`Found ${allButtons.length} buttons on the page`);
            
            for (let i = 0; i < allButtons.length; i++) {
                const button = allButtons[i];
                const text = await button.textContent();
                const title = await button.getAttribute('title');
                console.log(`Button ${i}: text="${text}", title="${title}"`);
                
                if (text && (text.toLowerCase().includes('delete') || text.toLowerCase().includes('refresh'))) {
                    deleteButton = button;
                    console.log(`Using button with text: ${text}`);
                    break;
                }
                if (title && (title.toLowerCase().includes('delete') || title.toLowerCase().includes('refresh'))) {
                    deleteButton = button;
                    console.log(`Using button with title: ${title}`);
                    break;
                }
            }
        }
        
        if (deleteButton && await deleteButton.isVisible()) {
            console.log('Clicking delete button...');
            await deleteButton.click();
            
            // Wait for new email to be generated
            console.log('Waiting for new email to be created...');
            await page.waitForTimeout(5000);
        } else {
            console.log('Delete button not found, proceeding with current email...');
        }
        
        // Try to find the email address with various selectors
        const emailSelectors = [
            '#mail',
            '.mail',
            '[data-test="email"]',
            '.email-address',
            'input[type="text"]',
            'input[readonly]',
            '.form-control',
            '#click-to-copy'
        ];
        
        let emailElement = null;
        let emailText = '';
          for (const selector of emailSelectors) {
            try {
                emailElement = page.locator(selector).first();
                if (await emailElement.isVisible({ timeout: 2000 })) {
                    emailText = await emailElement.inputValue() || await emailElement.textContent();
                    if (emailText && emailText.includes('@')) {
                        console.log(`Found email with selector: ${selector}`);
                        break;
                    }
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        if (!emailText || !emailText.includes('@')) {
            console.log('Email not found with common selectors. Searching page content...');
            
            // Search for email pattern in page content
            const pageContent = await page.textContent('body');
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const emailMatches = pageContent.match(emailRegex);
            
            if (emailMatches && emailMatches.length > 0) {
                emailText = emailMatches[0];
                console.log(`Found email in page content: ${emailText}`);
            }
        }
        
        if (!emailText || !emailText.includes('@')) {
            throw new Error('Could not find email address on the page');
        }
        
        console.log(`Found email: ${emailText}`);
        
        // Write email to file
        const filePath = path.join(__dirname, 'temp_email.txt');
        fs.writeFileSync(filePath, emailText.trim(), 'utf8');
        
        console.log(`Email saved to: ${filePath}`);
        console.log(`Email address: ${emailText.trim()}`);
        
    } catch (error) {
        console.error('Error occurred:', error.message);
        
        // Take screenshot for debugging
        try {
            await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
            console.log('Screenshot saved as error-screenshot.png for debugging');
        } catch (screenshotError) {
            console.error('Could not take screenshot:', screenshotError.message);
        }
        
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the function
if (require.main === module) {
    getTempEmail()
        .then(() => {
            console.log('Script completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error.message);
            process.exit(1);
        });
}

module.exports = { getTempEmail };
