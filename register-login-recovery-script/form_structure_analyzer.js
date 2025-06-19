const { chromium } = require('playwright');

async function analyzeFormStructure() {
    console.log('📋 Analyzing Registration Form Structure');
    console.log('=======================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        
        // Take a screenshot first
        await page.screenshot({ 
            path: 'form_structure_analysis.png', 
            fullPage: true 
        });
        console.log('📸 Screenshot saved: form_structure_analysis.png\n');
        
        // Get form fields in visual order (top to bottom)
        const formData = await page.evaluate(() => {
            const form = document.querySelector('form');
            if (!form) return { fields: [], structure: 'No form found' };
            
            const elements = [];
            const allInputs = form.querySelectorAll('input, select, textarea, button');
            
            allInputs.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const styles = window.getComputedStyle(element);
                
                if (element.offsetParent !== null && styles.display !== 'none') { // Only visible elements
                    elements.push({
                        index: index,
                        tag: element.tagName.toLowerCase(),
                        type: element.type || 'N/A',
                        name: element.name || 'N/A',
                        id: element.id || 'N/A',
                        placeholder: element.placeholder || 'N/A',
                        value: element.value || 'N/A',
                        text: element.textContent?.trim() || 'N/A',
                        top: Math.round(rect.top),
                        left: Math.round(rect.left),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        required: element.required || false,
                        className: element.className || 'N/A'
                    });
                }
            });
            
            // Sort by top position (visual order)
            elements.sort((a, b) => a.top - b.top);
            
            return {
                fields: elements,
                formHTML: form.innerHTML.substring(0, 500) + '...'
            };
        });
        
        console.log('📝 Form Fields in Visual Order (Top to Bottom):');
        console.log('==============================================');
        
        let fieldNumber = 1;
        const actualFields = formData.fields.filter(field => 
            field.tag === 'input' && field.type !== 'hidden' && field.type !== 'button' && field.type !== 'submit'
        );
        
        actualFields.forEach((field, index) => {
            console.log(`${fieldNumber}. ${field.tag.toUpperCase()} - ${field.type}`);
            console.log(`   Name: ${field.name}`);
            console.log(`   ID: ${field.id}`);
            console.log(`   Placeholder: ${field.placeholder}`);
            console.log(`   Position: (${field.left}, ${field.top})`);
            console.log(`   Size: ${field.width}x${field.height}`);
            console.log(`   Required: ${field.required}`);
            console.log(`   Class: ${field.className}`);
            console.log('   ---');
            fieldNumber++;
        });
        
        // Check for select elements (dropdowns)
        const selects = formData.fields.filter(field => field.tag === 'select');
        if (selects.length > 0) {
            console.log('\n📋 SELECT Elements (Dropdowns):');
            selects.forEach((select, index) => {
                console.log(`${fieldNumber}. SELECT - ${select.name || select.id}`);
                console.log(`   Name: ${select.name}`);
                console.log(`   ID: ${select.id}`);
                console.log(`   Position: (${select.left}, ${select.top})`);
                console.log('   ---');
                fieldNumber++;
            });
        }
        
        // Check for checkboxes
        const checkboxes = formData.fields.filter(field => field.type === 'checkbox');
        if (checkboxes.length > 0) {
            console.log('\n☑️ CHECKBOX Elements:');
            checkboxes.forEach((checkbox, index) => {
                console.log(`${fieldNumber}. CHECKBOX`);
                console.log(`   Name: ${checkbox.name}`);
                console.log(`   ID: ${checkbox.id}`);
                console.log(`   Position: (${checkbox.left}, ${checkbox.top})`);
                console.log('   ---');
                fieldNumber++;
            });
        }
        
        // Check for buttons
        const buttons = formData.fields.filter(field => 
            field.tag === 'button' || field.type === 'submit' || field.type === 'button'
        );
        if (buttons.length > 0) {
            console.log('\n🔘 BUTTON Elements:');
            buttons.forEach((button, index) => {
                console.log(`${fieldNumber}. BUTTON - ${button.type}`);
                console.log(`   Text: ${button.text}`);
                console.log(`   Name: ${button.name}`);
                console.log(`   ID: ${button.id}`);
                console.log(`   Position: (${button.left}, ${button.top})`);
                console.log('   ---');
                fieldNumber++;
            });
        }
        
        console.log('\n🔍 Recommended Field Order Based on Visual Position:');
        console.log('===================================================');
        
        // Combine all form elements and sort by position
        const allRelevantElements = formData.fields.filter(field => 
            (field.tag === 'input' && field.type !== 'hidden') || 
            field.tag === 'select' || 
            (field.tag === 'button' && field.type === 'submit')
        );
        
        allRelevantElements.forEach((field, index) => {
            let fieldType = '';
            if (field.tag === 'input') {
                fieldType = field.type === 'checkbox' ? 'CHECKBOX' : `INPUT (${field.type})`;
            } else if (field.tag === 'select') {
                fieldType = 'DROPDOWN';
            } else if (field.tag === 'button') {
                fieldType = 'SUBMIT BUTTON';
            }
            
            console.log(`${index + 1}. ${fieldType} - ${field.name || field.id || field.placeholder}`);
        });
        
        console.log('\n⏳ Holding page for 15 seconds to verify form structure...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

analyzeFormStructure().then(() => {
    console.log('\n🎉 Form structure analysis completed!');
});
