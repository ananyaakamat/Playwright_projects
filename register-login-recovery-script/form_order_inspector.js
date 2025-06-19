const { chromium } = require('playwright');

async function inspectRegistrationForm() {
    console.log('🔍 Inspecting Registration Form Field Order');
    console.log('==========================================\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        
        // Get all form elements in order
        const formElements = await page.evaluate(() => {
            const form = document.querySelector('form');
            if (!form) return [];
            
            const elements = [];
            const inputs = form.querySelectorAll('input, select, textarea, button');
            
            inputs.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                elements.push({
                    index: index,
                    tag: element.tagName.toLowerCase(),
                    type: element.type || 'N/A',
                    name: element.name || 'N/A',
                    id: element.id || 'N/A',
                    placeholder: element.placeholder || 'N/A',
                    text: element.textContent?.trim() || 'N/A',
                    top: Math.round(rect.top),
                    left: Math.round(rect.left),
                    visible: element.offsetParent !== null,
                    required: element.required || false
                });
            });
            
            // Sort by vertical position (top to bottom)
            return elements.sort((a, b) => a.top - b.top);
        });
        
        console.log('Form elements in visual order (top to bottom):');
        console.log('==============================================');
        
        formElements.forEach((element, index) => {
            if (element.visible) {
                console.log(`${index + 1}. ${element.tag.toUpperCase()} - Type: ${element.type}`);
                console.log(`   Name: ${element.name}`);
                console.log(`   ID: ${element.id}`);
                console.log(`   Placeholder: ${element.placeholder}`);
                console.log(`   Text: ${element.text}`);
                console.log(`   Position: (${element.left}, ${element.top})`);
                console.log(`   Required: ${element.required}`);
                console.log('   ---');
            }
        });
        
        // Wait for user to observe
        console.log('\n⏳ Holding page open for 10 seconds to observe...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('Error inspecting form:', error.message);
    } finally {
        await browser.close();
    }
}

inspectRegistrationForm().then(() => {
    console.log('\n🎉 Form inspection completed!');
});
