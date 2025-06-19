const { chromium } = require('playwright');

async function simpleCountryTest() {
    console.log('🔍 Simple Country Field Test');
    console.log('============================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        console.log('🌐 Navigating to registration page...');
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        console.log('✅ Page loaded\n');
        
        // Take initial screenshot
        await page.screenshot({ path: 'simple_test_start.png', fullPage: true });
        
        // Check if form elements exist
        console.log('🔍 Checking form elements...');
        
        const formCheck = await page.evaluate(() => {
            const form = document.querySelector('form');
            if (!form) return { hasForm: false };
            
            const firstName = form.querySelector('input[name="firstName"], input[name="firstname"], #firstName');
            const lastName = form.querySelector('input[name="lastName"], input[name="lastname"], #lastName');
            const email = form.querySelector('input[type="email"], input[name="email"]');
            const phone = form.querySelector('input[name="phone"], input[type="tel"]');
            const selects = form.querySelectorAll('select');
            
            return {
                hasForm: true,
                hasFirstName: !!firstName,
                hasLastName: !!lastName,
                hasEmail: !!email,
                hasPhone: !!phone,
                selectCount: selects.length,
                selects: Array.from(selects).map((select, index) => ({
                    index: index,
                    name: select.name || 'N/A',
                    id: select.id || 'N/A',
                    optionsCount: select.options.length,
                    firstOption: select.options.length > 0 ? select.options[0].text : 'None',
                    hasIndiaOption: Array.from(select.options).some(opt => 
                        opt.text.toLowerCase().includes('india')
                    )
                }))
            };
        });
        
        console.log('Form Check Results:');
        console.log(`  Has Form: ${formCheck.hasForm}`);
        console.log(`  Has First Name: ${formCheck.hasFirstName}`);
        console.log(`  Has Last Name: ${formCheck.hasLastName}`);
        console.log(`  Has Email: ${formCheck.hasEmail}`);
        console.log(`  Has Phone: ${formCheck.hasPhone}`);
        console.log(`  Select Elements: ${formCheck.selectCount}`);
        
        if (formCheck.selectCount > 0) {
            console.log('\nSelect Elements Details:');
            formCheck.selects.forEach((select, index) => {
                console.log(`  ${index + 1}. Name: ${select.name}, ID: ${select.id}`);
                console.log(`     Options: ${select.optionsCount}, Has India: ${select.hasIndiaOption}`);
                console.log(`     First Option: "${select.firstOption}"`);
            });
        } else {
            console.log('❌ NO SELECT ELEMENTS FOUND!');
        }
        
        // Try to fill basic fields if they exist
        if (formCheck.hasFirstName) {
            console.log('\n📝 Filling basic fields...');
            try {
                await page.fill('input[name="firstName"], input[name="firstname"], #firstName', 'John');
                console.log('✅ First name filled');
            } catch (e) {
                console.log('❌ First name failed:', e.message);
            }
            
            try {
                await page.fill('input[name="lastName"], input[name="lastname"], #lastName', 'Doe');
                console.log('✅ Last name filled');
            } catch (e) {
                console.log('❌ Last name failed:', e.message);
            }
            
            try {
                await page.fill('input[name="phone"], input[type="tel"]', '1234567890');
                console.log('✅ Phone filled');
            } catch (e) {
                console.log('❌ Phone failed:', e.message);
            }
        }
        
        // If there's a country select, try to use it
        if (formCheck.selectCount > 0) {
            console.log('\n🌍 Attempting country selection...');
            
            for (let i = 0; i < formCheck.selects.length; i++) {
                const select = formCheck.selects[i];
                if (select.hasIndiaOption) {
                    console.log(`Trying select #${i + 1}...`);
                    
                    let selector = `select:nth-of-type(${i + 1})`;
                    if (select.name !== 'N/A') {
                        selector = `select[name="${select.name}"]`;
                    } else if (select.id !== 'N/A') {
                        selector = `select[id="${select.id}"]`;
                    }
                    
                    try {
                        await page.selectOption(selector, { label: 'India' });
                        console.log('✅ India selected by label');
                        break;
                    } catch (e1) {
                        try {
                            await page.selectOption(selector, { value: 'India' });
                            console.log('✅ India selected by value');
                            break;
                        } catch (e2) {
                            console.log(`❌ Failed both methods: ${e1.message}`);
                        }
                    }
                }
            }
        }
        
        // Fill remaining fields
        if (formCheck.hasEmail) {
            try {
                await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
                console.log('✅ Email filled');
            } catch (e) {
                console.log('❌ Email failed:', e.message);
            }
        }
        
        // Take final screenshot
        await page.screenshot({ path: 'simple_test_end.png', fullPage: true });
        console.log('\n📸 Screenshots saved: simple_test_start.png & simple_test_end.png');
        
        console.log('\n⏳ Holding page for 10 seconds...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

simpleCountryTest().then(() => {
    console.log('\n🎉 Simple country test completed!');
});
