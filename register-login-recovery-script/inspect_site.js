const { chromium } = require('playwright');

async function inspectQAPracticeSite() {
    console.log('🔍 Inspecting QA Practice site structure...');
    
    const browser = await chromium.launch({
        headless: false,
        channel: 'chrome'
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Check registration page
        console.log('\n📝 Inspecting Registration Page:');
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        
        // Get all form input elements
        const inputs = await page.$$eval('input', elements => {
            return elements.map(el => ({
                name: el.name || 'no-name',
                id: el.id || 'no-id',
                type: el.type,
                placeholder: el.placeholder || 'no-placeholder',
                class: el.className || 'no-class'
            }));
        });
        
        console.log('Form inputs found:');
        inputs.forEach((input, index) => {
            console.log(`  ${index + 1}. Type: ${input.type}, ID: ${input.id}, Name: ${input.name}, Placeholder: ${input.placeholder}`);
        });
        
        // Check for select elements (country dropdown)
        const selects = await page.$$eval('select', elements => {
            return elements.map(el => ({
                name: el.name || 'no-name',
                id: el.id || 'no-id',
                class: el.className || 'no-class'
            }));
        });
        
        console.log('\\nSelect elements found:');
        selects.forEach((select, index) => {
            console.log(`  ${index + 1}. ID: ${select.id}, Name: ${select.name}`);
        });
        
        // Check for submit button
        const buttons = await page.$$eval('button, input[type="submit"]', elements => {
            return elements.map(el => ({
                text: el.textContent?.trim() || el.value || 'no-text',
                type: el.type,
                id: el.id || 'no-id',
                class: el.className || 'no-class'
            }));
        });
        
        console.log('\\nButtons found:');
        buttons.forEach((button, index) => {
            console.log(`  ${index + 1}. Text: "${button.text}", Type: ${button.type}, ID: ${button.id}`);
        });
        
        await page.waitForTimeout(5000); // Keep page open for 5 seconds to see it
        
    } catch (error) {
        console.error('Error inspecting site:', error.message);
    } finally {
        await browser.close();
    }
}

inspectQAPracticeSite();
