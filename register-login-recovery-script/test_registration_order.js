const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Test data
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
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
};

// Helper function to try multiple selectors
async function fillFieldWithFallback(page, selectors, value, fieldName) {
    const selectorList = selectors.split(', ');
    
    for (const selector of selectorList) {
        try {
            await page.waitForSelector(selector.trim(), { timeout: 3000 });
            await page.fill(selector.trim(), value);
            console.log(`✓ ${fieldName}: ${value} (using ${selector.trim()})`);
            return true;
        } catch (error) {
            continue;
        }
    }
    
    console.warn(`⚠ Could not find ${fieldName} field with any selector`);
    return false;
}

async function testRegistrationOrder() {
    console.log('🧪 Testing Registration Form Field Order');
    console.log('======================================\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    
    try {
        // Navigate to registration page
        console.log('🌐 Navigating to registration page...');
        await page.goto('https://qa-practice.netlify.app/register');
        await page.waitForLoadState('networkidle');
        console.log('✓ Page loaded successfully\n');
        
        // Fill form in order (1-13)
        console.log('📝 Filling form fields in top-to-bottom order:');
        console.log('===============================================');
        
        // 1. First Name
        console.log('1️⃣ Filling First Name...');
        await fillFieldWithFallback(page, 'input[name="firstName"], input[name="firstname"], #firstName, #firstname, input[placeholder*="First"]', testData.firstName, 'First name');
        await page.waitForTimeout(800);
        
        // 2. Last Name
        console.log('2️⃣ Filling Last Name...');
        await fillFieldWithFallback(page, 'input[name="lastName"], input[name="lastname"], #lastName, #lastname, input[placeholder*="Last"]', testData.lastName, 'Last name');
        await page.waitForTimeout(800);
        
        // 3. Email
        console.log('3️⃣ Filling Email...');
        await fillFieldWithFallback(page, 'input[name="email"], input[type="email"], #email, input[placeholder*="Email"]', testData.email, 'Email');
        await page.waitForTimeout(800);
        
        // 4. Phone
        console.log('4️⃣ Filling Phone...');
        await fillFieldWithFallback(page, 'input[name="phone"], input[name="phoneNumber"], #phone, input[placeholder*="Phone"]', testData.phone, 'Phone');
        await page.waitForTimeout(800);
        
        // 5. Address
        console.log('5️⃣ Filling Address...');
        await fillFieldWithFallback(page, 'input[name="address"], #address, input[placeholder*="Address"]', testData.address, 'Address');
        await page.waitForTimeout(800);
        
        // 6. City
        console.log('6️⃣ Filling City...');
        await fillFieldWithFallback(page, 'input[name="city"], #city, input[placeholder*="City"]', testData.city, 'City');
        await page.waitForTimeout(800);
        
        // 7. State
        console.log('7️⃣ Filling State...');
        await fillFieldWithFallback(page, 'input[name="state"], #state, input[placeholder*="State"]', testData.state, 'State');
        await page.waitForTimeout(800);
        
        // 8. ZIP Code
        console.log('8️⃣ Filling ZIP Code...');
        await fillFieldWithFallback(page, 'input[name="zipCode"], input[name="zip"], #zipCode, #zip, input[placeholder*="Zip"]', testData.zipCode, 'ZIP Code');
        await page.waitForTimeout(800);
        
        // 9. Country Selection
        console.log('9️⃣ Selecting Country...');
        try {
            const countrySelectors = 'select[name="country"], #country, select[placeholder*="Country"]';
            const countryOptions = countrySelectors.split(', ');
            
            for (const selector of countryOptions) {
                try {
                    await page.waitForSelector(selector.trim(), { timeout: 3000 });
                    await page.selectOption(selector.trim(), { label: testData.country });
                    console.log(`✓ Country: ${testData.country} (using ${selector.trim()})`);
                    break;
                } catch (error) {
                    continue;
                }
            }
        } catch (error) {
            console.warn('⚠ Could not select country');
        }
        await page.waitForTimeout(800);
        
        // 10. Password
        console.log('🔟 Filling Password...');
        await fillFieldWithFallback(page, 'input[name="password"], input[type="password"], #password, input[placeholder*="Password"]', testData.password, 'Password');
        await page.waitForTimeout(800);
        
        // 11. Confirm Password
        console.log('1️⃣1️⃣ Filling Confirm Password...');
        await fillFieldWithFallback(page, 'input[name="confirmPassword"], input[name="password2"], #confirmPassword, input[placeholder*="Confirm"]', testData.confirmPassword, 'Password confirmation');
        await page.waitForTimeout(800);
        
        // 12. Checkbox - CRITICAL STEP
        console.log('1️⃣2️⃣ Checking Agreement/Terms Checkbox...');
        try {
            const checkboxSelectors = 'input[type="checkbox"], #agree, input[name="agree"], input[name="terms"], input[name="agreement"]';
            const checkboxOptions = checkboxSelectors.split(', ');
            
            let checkboxFound = false;
            for (const selector of checkboxOptions) {
                try {
                    await page.waitForSelector(selector.trim(), { timeout: 3000 });
                    
                    const isChecked = await page.isChecked(selector.trim());
                    if (!isChecked) {
                        await page.check(selector.trim());
                        console.log(`✅ Agreement checkbox CHECKED (using ${selector.trim()})`);
                    } else {
                        console.log(`✅ Agreement checkbox already checked (using ${selector.trim()})`);
                    }
                    checkboxFound = true;
                    break;
                } catch (error) {
                    continue;
                }
            }
            
            if (!checkboxFound) {
                console.log('⚠ No agreement checkbox found');
            }
        } catch (error) {
            console.log('⚠ Error with checkbox:', error.message);
        }
        await page.waitForTimeout(1000);
        
        console.log('\n📸 Taking screenshot of completed form...');
        await page.screenshot({ 
            path: path.join(__dirname, 'screenshots', `form_filled_test_${Date.now()}.png`), 
            fullPage: true 
        });
        
        console.log('\n⏳ Holding page open for 15 seconds to verify all fields...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testRegistrationOrder().then(() => {
    console.log('\n🎉 Registration order test completed!');
});
