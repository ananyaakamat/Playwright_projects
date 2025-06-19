const { chromium } = require('playwright');

async function debugCountryFieldSpecific() {
    console.log('🔍 SPECIFIC Country Field Debug Test');
    console.log('===================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        
        console.log('📸 Taking BEFORE screenshot...');
        await page.screenshot({ 
            path: 'country_before_selection.png', 
            fullPage: true 
        });
        
        // Fill other fields first to see the form
        console.log('📝 Filling other fields first...');
        await page.fill('input[name="firstName"]', 'Test');
        await page.fill('input[name="lastName"]', 'User');
        await page.fill('input[name="phone"]', '9999999999');
        
        // Now focus on country field
        console.log('\n🌍 DEBUGGING COUNTRY FIELD:');
        console.log('============================');
        
        // Find all select elements
        const allSelects = await page.evaluate(() => {
            const selects = document.querySelectorAll('select');
            return Array.from(selects).map((select, index) => ({
                index: index,
                name: select.name || 'N/A',
                id: select.id || 'N/A',
                className: select.className || 'N/A',
                optionsCount: select.options.length,
                options: Array.from(select.options).map(opt => ({
                    value: opt.value,
                    text: opt.text
                })),
                currentValue: select.value,
                visible: select.offsetParent !== null
            }));
        });
        
        console.log(`Found ${allSelects.length} select element(s):`);
        allSelects.forEach((select, index) => {
            console.log(`\n${index + 1}. SELECT Element:`);
            console.log(`   Name: ${select.name}`);
            console.log(`   ID: ${select.id}`);
            console.log(`   Class: ${select.className}`);
            console.log(`   Options Count: ${select.optionsCount}`);
            console.log(`   Current Value: ${select.currentValue}`);
            console.log(`   Visible: ${select.visible}`);
            console.log(`   First 5 Options:`);
            select.options.slice(0, 5).forEach((opt, i) => {
                console.log(`     ${i + 1}. "${opt.text}" (value: "${opt.value}")`);
            });
            
            // Check if India is in options
            const hasIndia = select.options.some(opt => 
                opt.text.toLowerCase().includes('india') || 
                opt.value.toLowerCase().includes('india')
            );
            console.log(`   Has India: ${hasIndia ? '✅ YES' : '❌ NO'}`);
        });
        
        // Try to select India in all found selects
        console.log('\n🎯 Attempting to select India...');
        
        for (let i = 0; i < allSelects.length; i++) {
            const select = allSelects[i];
            console.log(`\nTrying select #${i + 1} (${select.name || select.id}):`);
            
            try {
                let selector = '';
                if (select.name) {
                    selector = `select[name="${select.name}"]`;
                } else if (select.id) {
                    selector = `select[id="${select.id}"]`;
                } else {
                    selector = `select:nth-of-type(${i + 1})`;
                }
                
                console.log(`  Using selector: ${selector}`);
                
                // Try different methods
                const methods = [
                    { name: 'by label "India"', action: () => page.selectOption(selector, { label: 'India' }) },
                    { name: 'by value "India"', action: () => page.selectOption(selector, { value: 'India' }) },
                    { name: 'by value "IN"', action: () => page.selectOption(selector, { value: 'IN' }) },
                    { name: 'by value "india"', action: () => page.selectOption(selector, { value: 'india' }) }
                ];
                
                for (const method of methods) {
                    try {
                        await method.action();
                        console.log(`  ✅ SUCCESS: ${method.name}`);
                        
                        // Verify selection
                        const selectedValue = await page.evaluate((sel) => {
                            const selectEl = document.querySelector(sel);
                            return selectEl ? selectEl.value : 'Not found';
                        }, selector);
                        
                        console.log(`  📋 Selected value: "${selectedValue}"`);
                        break;
                    } catch (error) {
                        console.log(`  ❌ FAILED: ${method.name} - ${error.message}`);
                    }
                }
                
            } catch (error) {
                console.log(`  ❌ ERROR with select #${i + 1}: ${error.message}`);
            }
        }
        
        // Fill remaining fields
        console.log('\n📝 Filling remaining fields...');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'Password123!');
        
        // Check checkbox if exists
        try {
            await page.check('input[type="checkbox"]');
            console.log('✅ Checkbox checked');
        } catch {
            console.log('⚠️ No checkbox found');
        }
        
        console.log('\n📸 Taking AFTER screenshot...');
        await page.screenshot({ 
            path: 'country_after_selection.png', 
            fullPage: true 
        });
        
        // Get final state of all selects
        console.log('\n📊 Final state of select elements:');
        const finalState = await page.evaluate(() => {
            const selects = document.querySelectorAll('select');
            return Array.from(selects).map((select, index) => ({
                index: index,
                name: select.name || 'N/A',
                value: select.value,
                selectedText: select.options[select.selectedIndex]?.text || 'None'
            }));
        });
        
        finalState.forEach((select, index) => {
            console.log(`${index + 1}. ${select.name}: "${select.selectedText}" (value: "${select.value}")`);
        });
        
        console.log('\n⏳ Holding page for 15 seconds to verify visually...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugCountryFieldSpecific().then(() => {
    console.log('\n🎉 Country field specific debug completed!');
});
