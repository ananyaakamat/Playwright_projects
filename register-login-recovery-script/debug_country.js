const { chromium } = require('playwright');

async function debugCountryField() {
    console.log('🔍 Debugging Country Field');
    console.log('==========================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        
        // Look for all possible country-related elements
        console.log('🔍 Searching for country-related elements...\n');
        
        const countryElements = await page.evaluate(() => {
            const elements = [];
            
            // Search for select elements
            const selects = document.querySelectorAll('select');
            selects.forEach((select, index) => {
                elements.push({
                    type: 'SELECT',
                    index: index,
                    name: select.name || 'N/A',
                    id: select.id || 'N/A',
                    className: select.className || 'N/A',
                    innerHTML: select.innerHTML.substring(0, 200) + '...',
                    optionsCount: select.options.length,
                    firstOptions: Array.from(select.options).slice(0, 5).map(opt => opt.text),
                    hasIndia: Array.from(select.options).some(opt => 
                        opt.text.toLowerCase().includes('india') || 
                        opt.value.toLowerCase().includes('india')
                    )
                });
            });
            
            // Search for input elements that might be for country
            const inputs = document.querySelectorAll('input');
            inputs.forEach((input, index) => {
                const name = input.name?.toLowerCase() || '';
                const id = input.id?.toLowerCase() || '';
                const placeholder = input.placeholder?.toLowerCase() || '';
                
                if (name.includes('country') || id.includes('country') || placeholder.includes('country')) {
                    elements.push({
                        type: 'INPUT',
                        index: index,
                        name: input.name || 'N/A',
                        id: input.id || 'N/A',
                        className: input.className || 'N/A',
                        placeholder: input.placeholder || 'N/A',
                        type: input.type || 'N/A'
                    });
                }
            });
            
            return elements;
        });
        
        if (countryElements.length === 0) {
            console.log('❌ No country-related elements found!');
        } else {
            console.log(`✅ Found ${countryElements.length} country-related elements:\n`);
            
            countryElements.forEach((element, index) => {
                console.log(`${index + 1}. ${element.type}:`);
                console.log(`   Name: ${element.name}`);
                console.log(`   ID: ${element.id}`);
                console.log(`   Class: ${element.className}`);
                
                if (element.type === 'SELECT') {
                    console.log(`   Options Count: ${element.optionsCount}`);
                    console.log(`   Has India: ${element.hasIndia ? '✅ YES' : '❌ NO'}`);
                    console.log(`   First Options: ${element.firstOptions.join(', ')}`);
                } else {
                    console.log(`   Placeholder: ${element.placeholder}`);
                    console.log(`   Type: ${element.type}`);
                }
                console.log('   ---');
            });
        }
        
        // Try to find and interact with country field
        console.log('\n🎯 Attempting to select India...\n');
        
        const selectors = [
            'select[name="country"]',
            '#country',
            'select[id*="country"]',
            'select[name*="Country"]',
            'select:has(option[value*="India"])',
            'select:has(option:contains("India"))'
        ];
        
        let success = false;
        for (const selector of selectors) {
            try {
                console.log(`Trying: ${selector}`);
                await page.waitForSelector(selector, { timeout: 2000 });
                
                // Get all options first
                const options = await page.evaluate((sel) => {
                    const select = document.querySelector(sel);
                    if (!select) return [];
                    return Array.from(select.options).map(opt => ({
                        value: opt.value,
                        text: opt.text
                    }));
                }, selector);
                
                console.log('Available options:', options.slice(0, 10));
                
                // Try different selection methods
                const methods = [
                    { method: 'label', value: 'India' },
                    { method: 'value', value: 'India' },
                    { method: 'value', value: 'IN' },
                    { method: 'value', value: 'india' },
                    { method: 'index', value: options.findIndex(opt => 
                        opt.text.toLowerCase().includes('india') || 
                        opt.value.toLowerCase().includes('india')
                    )}
                ];
                
                for (const method of methods) {
                    try {
                        if (method.method === 'label') {
                            await page.selectOption(selector, { label: method.value });
                        } else if (method.method === 'value') {
                            await page.selectOption(selector, { value: method.value });
                        } else if (method.method === 'index' && method.value >= 0) {
                            await page.selectOption(selector, { index: method.value });
                        }
                        
                        console.log(`✅ SUCCESS: Selected India using ${method.method}=${method.value}`);
                        success = true;
                        break;
                    } catch (error) {
                        console.log(`❌ Failed: ${method.method}=${method.value}`);
                    }
                }
                
                if (success) break;
            } catch (error) {
                console.log(`❌ Selector not found: ${selector}`);
            }
        }
        
        if (!success) {
            console.log('\n❌ Could not select India in any country field');
        }
        
        // Take screenshot
        await page.screenshot({ 
            path: `country_debug_${Date.now()}.png`, 
            fullPage: true 
        });
        
        console.log('\n⏳ Holding page for 10 seconds...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugCountryField().then(() => {
    console.log('\n🎉 Country field debugging completed!');
});
