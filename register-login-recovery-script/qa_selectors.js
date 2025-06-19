// Common QA Practice form selectors (best guess based on typical patterns)
const SELECTORS = {
    // Registration page selectors
    registration: {
        firstName: 'input[name="firstName"], input[name="firstname"], #firstName, #firstname, input[placeholder*="First"], input[placeholder*="first"]',
        lastName: 'input[name="lastName"], input[name="lastname"], #lastName, #lastname, input[placeholder*="Last"], input[placeholder*="last"]',
        email: 'input[name="email"], input[type="email"], #email, input[placeholder*="Email"], input[placeholder*="email"]',
        phone: 'input[name="phone"], input[name="phoneNumber"], #phone, input[placeholder*="Phone"], input[placeholder*="phone"]',
        address: 'input[name="address"], #address, input[placeholder*="Address"], input[placeholder*="address"]',
        city: 'input[name="city"], #city, input[placeholder*="City"], input[placeholder*="city"]',
        state: 'input[name="state"], #state, input[placeholder*="State"], input[placeholder*="state"]',
        zipCode: 'input[name="zipCode"], input[name="zip"], #zipCode, #zip, input[placeholder*="Zip"], input[placeholder*="zip"]',
        country: 'select[name="country"], #country, select[placeholder*="Country"], select[placeholder*="country"]',
        password: 'input[name="password"], input[type="password"], #password, input[placeholder*="Password"], input[placeholder*="password"]',
        confirmPassword: 'input[name="confirmPassword"], input[name="password2"], #confirmPassword, input[placeholder*="Confirm"], input[placeholder*="confirm"]',
        submitButton: 'button[type="submit"], input[type="submit"], button:has-text("Register"), button:has-text("Submit"), button:has-text("Create")',
        agreeCheckbox: 'input[type="checkbox"], #agree, input[name="agree"], input[name="terms"]'
    },
    
    // Login page selectors  
    login: {
        email: 'input[name="email"], input[type="email"], #email, input[placeholder*="Email"], input[placeholder*="email"], input[name="username"]',
        password: 'input[name="password"], input[type="password"], #password, input[placeholder*="Password"], input[placeholder*="password"]',
        submitButton: 'button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Submit"), button:has-text("Sign")'
    },
    
    // Password recovery selectors
    recovery: {
        email: 'input[name="email"], input[type="email"], #email, input[placeholder*="Email"], input[placeholder*="email"]',
        submitButton: 'button[type="submit"], input[type="submit"], button:has-text("Recover"), button:has-text("Reset"), button:has-text("Submit")'
    }
};

console.log('Selector patterns defined for QA Practice site');
console.log(JSON.stringify(SELECTORS, null, 2));
