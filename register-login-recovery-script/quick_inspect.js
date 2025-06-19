const { chromium } = require('playwright');

async function quickInspection() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Registration page
        console.log('🔍 Checking Registration Page...');
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForTimeout(3000);
        
        const registrationInputs = await page.evaluate(() => {
            const inputs = document.querySelectorAll('input');
            return Array.from(inputs).map(input => ({
                id: input.id,
                name: input.name,
                type: input.type,
                placeholder: input.placeholder
            }));
        });
        
        console.log('Registration form inputs:');
        registrationInputs.forEach(input => {
            console.log(`  ID: ${input.id}, Name: ${input.name}, Type: ${input.type}, Placeholder: ${input.placeholder}`);
        });
        
        // Login page
        console.log('\\n🔍 Checking Login Page...');
        await page.goto('https://qa-practice.netlify.app/auth_ecommerce');
        await page.waitForTimeout(3000);
        
        const loginInputs = await page.evaluate(() => {
            const inputs = document.querySelectorAll('input');
            return Array.from(inputs).map(input => ({
                id: input.id,
                name: input.name,
                type: input.type,
                placeholder: input.placeholder
            }));
        });
        
        console.log('Login form inputs:');
        loginInputs.forEach(input => {
            console.log(`  ID: ${input.id}, Name: ${input.name}, Type: ${input.type}, Placeholder: ${input.placeholder}`);
        });
        
        // Password recovery page
        console.log('\\n🔍 Checking Password Recovery Page...');
        await page.goto('https://qa-practice.netlify.app/recover-password');
        await page.waitForTimeout(3000);
        
        const recoveryInputs = await page.evaluate(() => {
            const inputs = document.querySelectorAll('input');
            return Array.from(inputs).map(input => ({
                id: input.id,
                name: input.name,
                type: input.type,
                placeholder: input.placeholder
            }));
        });
        
        console.log('Password recovery form inputs:');
        recoveryInputs.forEach(input => {
            console.log(`  ID: ${input.id}, Name: ${input.name}, Type: ${input.type}, Placeholder: ${input.placeholder}`);
        });
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

quickInspection();
