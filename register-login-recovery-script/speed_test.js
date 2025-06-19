const { chromium } = require('playwright');

// Test data
const testData = {
    firstName: 'Speed',
    lastName: 'Test',
    email: 'speed.test@gmail.com',
    phone: '9876543210',
    address: '456 Speed Street',
    city: 'Fast City',
    state: 'Quick State',
    zipCode: '54321',
    country: 'India',
    password: 'SpeedTest123!',
    confirmPassword: 'SpeedTest123!'
};

async function quickRegistrationTest() {
    console.log('⚡ Quick Registration Test (SPEED OPTIMIZED)');
    console.log('============================================\n');
    
    const startTime = Date.now();
    
    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--start-maximized',
            '--disable-web-security',
            '--no-first-run',
            '--disable-default-apps'
        ]
    });
    const page = await browser.newPage();
    
    try {
        console.log('🌐 Navigating to registration page...');
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        
        const navigationTime = Date.now() - startTime;
        console.log(`✓ Page loaded in ${navigationTime}ms\n`);
        
        console.log('📝 Filling form fields (no delays):');
        
        // Fill all fields quickly
        const fields = [
            { selector: 'input[name="firstName"], #firstName', value: testData.firstName, name: 'First Name' },
            { selector: 'input[name="lastName"], #lastName', value: testData.lastName, name: 'Last Name' },
            { selector: 'input[name="email"], input[type="email"]', value: testData.email, name: 'Email' },
            { selector: 'input[name="phone"], #phone', value: testData.phone, name: 'Phone' },
            { selector: 'input[name="address"], #address', value: testData.address, name: 'Address' },
            { selector: 'input[name="city"], #city', value: testData.city, name: 'City' },
            { selector: 'input[name="state"], #state', value: testData.state, name: 'State' },
            { selector: 'input[name="zipCode"], #zipCode', value: testData.zipCode, name: 'ZIP Code' }
        ];
        
        for (const field of fields) {
            try {
                await page.fill(field.selector.split(', ')[0], field.value);
                console.log(`✓ ${field.name}: ${field.value}`);
            } catch {
                try {
                    await page.fill(field.selector.split(', ')[1], field.value);
                    console.log(`✓ ${field.name}: ${field.value} (fallback)`);
                } catch {
                    console.log(`⚠ ${field.name}: Could not fill`);
                }
            }
        }
        
        // Country selection
        console.log('🌍 Selecting Country...');
        try {
            await page.selectOption('select[name="country"]', { label: 'India' });
            console.log('✓ Country: India');
        } catch {
            try {
                await page.selectOption('#country', { label: 'India' });
                console.log('✓ Country: India (fallback)');
            } catch {
                console.log('⚠ Country: Could not select');
            }
        }
        
        // Password fields
        try {
            await page.fill('input[name="password"]', testData.password);
            console.log(`✓ Password: ${testData.password}`);
        } catch {
            console.log('⚠ Password: Could not fill');
        }
        
        try {
            await page.fill('input[name="confirmPassword"]', testData.confirmPassword);
            console.log(`✓ Confirm Password: ${testData.confirmPassword}`);
        } catch {
            console.log('⚠ Confirm Password: Could not fill');
        }
        
        // Checkbox
        console.log('☑️ Checking agreement checkbox...');
        try {
            await page.check('input[type="checkbox"]');
            console.log('✅ Checkbox checked');
        } catch {
            console.log('⚠ Checkbox: Not found');
        }
        
        const formTime = Date.now() - startTime;
        console.log(`\n⏱️ Form filled in ${formTime - navigationTime}ms`);
        console.log(`⏱️ Total time so far: ${formTime}ms`);
        
        // Take screenshot
        await page.screenshot({ 
            path: `speed_test_${Date.now()}.png`, 
            fullPage: true 
        });
        
        console.log('\n⏳ Holding page for 5 seconds to verify...');
        await page.waitForTimeout(5000);
        
        const totalTime = Date.now() - startTime;
        console.log(`\n🏁 Total execution time: ${totalTime}ms (${(totalTime/1000).toFixed(1)}s)`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

quickRegistrationTest().then(() => {
    console.log('\n🎉 Speed test completed!');
});
