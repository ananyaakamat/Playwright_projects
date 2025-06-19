const { chromium } = require('playwright');

async function detailedValidationTest() {
    console.log('🔍 Starting Detailed Data Entry and Validation Test');
    console.log('==================================================\n');
    
    const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe.test@gmail.com',
        phone: '1234567890',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India',
        password: 'TestPassword123!'
    };
    
    const browser = await chromium.launch({
        headless: false,
        channel: 'chrome',
        args: ['--start-maximized']
    });
    
    try {
        const context = await browser.newContext({ viewport: null });
        const page = await context.newPage();
        
        // Test Registration Page
        console.log('📝 Testing Registration Page Data Entry:');
        console.log('========================================');
        
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        console.log('✓ Navigation completed');
        
        // Get all form fields
        const formFields = await page.evaluate(() => {
            const inputs = document.querySelectorAll('input, select, textarea');
            return Array.from(inputs).map(input => ({
                tagName: input.tagName,
                type: input.type || 'N/A',
                name: input.name || 'N/A',
                id: input.id || 'N/A',
                placeholder: input.placeholder || 'N/A',
                required: input.required,
                value: input.value || 'N/A'
            }));
        });
        
        console.log('\\n📋 Available Form Fields:');
        formFields.forEach((field, index) => {
            console.log(`  ${index + 1}. ${field.tagName} [${field.type}] - ID: ${field.id}, Name: ${field.name}, Placeholder: "${field.placeholder}", Required: ${field.required}`);
        });
        
        // Test field filling
        console.log('\\n🖊️ Testing Field Population:');
        
        const fieldTests = [
            { selector: 'input[name="firstName"]', value: testData.firstName, name: 'First Name' },
            { selector: 'input[name="lastName"]', value: testData.lastName, name: 'Last Name' },
            { selector: 'input[name="email"]', value: testData.email, name: 'Email' },
            { selector: 'input[name="phone"]', value: testData.phone, name: 'Phone' },
            { selector: 'input[name="address"]', value: testData.address, name: 'Address' },
            { selector: 'input[name="city"]', value: testData.city, name: 'City' },
            { selector: 'input[name="state"]', value: testData.state, name: 'State' },
            { selector: 'input[name="zipCode"]', value: testData.zipCode, name: 'ZIP Code' },
            { selector: 'input[name="password"]', value: testData.password, name: 'Password' },
            { selector: 'input[name="confirmPassword"]', value: testData.password, name: 'Confirm Password' }
        ];
        
        for (const test of fieldTests) {
            try {
                const element = await page.locator(test.selector).first();
                if (await element.isVisible()) {
                    await element.fill(test.value);
                    const actualValue = await element.inputValue();
                    console.log(`  ✓ ${test.name}: "${actualValue}" ${actualValue === test.value ? '(✓ Match)' : '(❌ Mismatch)'}`);
                } else {
                    console.log(`  ❌ ${test.name}: Field not visible`);
                }
            } catch (error) {
                console.log(`  ❌ ${test.name}: ${error.message}`);
            }
        }
        
        // Test country selection
        console.log('\\n🌍 Testing Country Selection:');
        try {
            const countrySelect = await page.locator('select[name="country"]').first();
            if (await countrySelect.isVisible()) {
                await countrySelect.selectOption({ label: testData.country });
                const selectedValue = await countrySelect.inputValue();
                console.log(`  ✓ Country selected: ${selectedValue}`);
            } else {
                console.log('  ❌ Country dropdown not found');
            }
        } catch (error) {
            console.log(`  ❌ Country selection failed: ${error.message}`);
        }
        
        // Test form validation
        console.log('\\n✅ Testing Form Validation:');
        
        // Check for validation messages
        const validationElements = await page.evaluate(() => {
            const validators = document.querySelectorAll('.error, .invalid, .validation-message, [class*="error"], [class*="invalid"]');
            return Array.from(validators).map(el => ({
                text: el.textContent?.trim(),
                class: el.className,
                visible: el.offsetParent !== null
            }));
        });
        
        console.log(`  📝 Found ${validationElements.length} potential validation elements`);
        validationElements.forEach((val, index) => {
            if (val.visible && val.text) {
                console.log(`    ${index + 1}. ${val.text} (Class: ${val.class})`);
            }
        });
        
        // Test submit button
        console.log('\\n🔘 Testing Submit Button:');
        try {
            const submitButtons = await page.evaluate(() => {
                const buttons = document.querySelectorAll('button, input[type="submit"]');
                return Array.from(buttons).map(btn => ({
                    text: btn.textContent?.trim() || btn.value,
                    type: btn.type,
                    disabled: btn.disabled,
                    visible: btn.offsetParent !== null
                }));
            });
            
            console.log('  Available buttons:');
            submitButtons.forEach((btn, index) => {
                console.log(`    ${index + 1}. "${btn.text}" - Type: ${btn.type}, Disabled: ${btn.disabled}, Visible: ${btn.visible}`);
            });
        } catch (error) {
            console.log(`  ❌ Button check failed: ${error.message}`);
        }
        
        // Wait to see the form
        console.log('\\n⏳ Holding page open for 10 seconds to observe...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
        console.log('\\n🎉 Detailed validation test completed!');
    }
}

detailedValidationTest();
