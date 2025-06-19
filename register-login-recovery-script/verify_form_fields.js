const { chromium } = require('playwright');

async function verifyFormFields() {
    console.log('🔍 Verifying Actual Form Fields');
    console.log('===============================\n');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        
        // Get all form input fields with their labels
        const formFields = await page.evaluate(() => {
            const fields = [];
            const form = document.querySelector('form');
            if (!form) return fields;
            
            // Get all input, select, textarea elements
            const elements = form.querySelectorAll('input, select, textarea');
            
            elements.forEach((element, index) => {
                if (element.type !== 'hidden' && element.type !== 'submit' && element.type !== 'button' && element.offsetParent) {
                    const rect = element.getBoundingClientRect();
                    
                    // Try to find associated label
                    let label = '';
                    if (element.id) {
                        const labelEl = document.querySelector(`label[for="${element.id}"]`);
                        if (labelEl) label = labelEl.textContent.trim();
                    }
                    
                    // If no label found, look for parent label or nearby text
                    if (!label) {
                        const parent = element.closest('div, p, span');
                        if (parent) {
                            const parentText = parent.textContent.trim();
                            if (parentText && parentText.length < 50) {
                                label = parentText.replace(element.value || '', '').trim();
                            }
                        }
                    }
                    
                    fields.push({
                        index: index,
                        name: element.name || '',
                        id: element.id || '',
                        type: element.type || element.tagName.toLowerCase(),
                        placeholder: element.placeholder || '',
                        label: label,
                        top: Math.round(rect.top),
                        required: element.required,
                        tagName: element.tagName.toLowerCase()
                    });
                }
            });
            
            // Sort by top position
            return fields.sort((a, b) => a.top - b.top);
        });
        
        console.log('📋 Actual Form Fields (in visual order):');
        console.log('=======================================');
        
        formFields.forEach((field, index) => {
            console.log(`${index + 1}. ${field.tagName.toUpperCase()} (${field.type})`);
            console.log(`   Name: "${field.name}"`);
            console.log(`   ID: "${field.id}"`);
            console.log(`   Placeholder: "${field.placeholder}"`);
            console.log(`   Label: "${field.label}"`);
            console.log(`   Required: ${field.required}`);
            console.log(`   Position: ${field.top}px from top`);
            console.log('   ---');
        });
        
        // Generate correct field sequence for script
        console.log('\n🎯 Correct Field Sequence for Script:');
        console.log('====================================');
        
        const dataFields = formFields.filter(f => f.type !== 'checkbox' && f.type !== 'submit');
        dataFields.forEach((field, index) => {
            let fieldName = field.name || field.id || field.placeholder;
            console.log(`${index + 1}. ${fieldName} (${field.type})`);
        });
        
        // Generate CSV headers
        console.log('\n📊 Suggested CSV Headers:');
        console.log('=========================');
        const headers = dataFields.map(field => {
            let header = field.label || field.placeholder || field.name || field.id;
            // Clean up header
            header = header.replace(/[*:]/g, '').trim();
            return header;
        }).filter(h => h);
        
        console.log(headers.join(','));
        
        console.log('\n⏳ Holding page for 10 seconds...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

verifyFormFields().then(() => {
    console.log('\n🎉 Form field verification completed!');
});
