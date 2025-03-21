const puppeteer = require('puppeteer');

async function autoApply(jobLink, profileData) {
    const browser = await puppeteer.launch({
        headless: false,  // Keep the browser visible for manual input, maybe change
        defaultViewport: null
    });
    
    // const actions = [
    //     page.type('input[label*="First"][aria-label*="First"]', profileData.firstName || '').catch(error => console.error('First Name: ', error.message)),
    //     page.type('input[label*="Last"][aria-label*="Last"]', profileData.lastName || '').catch(error => console.error('Last Name: ', error.message)),
    //     page.type('input[type="email"]', profileData.email || '').catch(error => console.error('Email: ', error.message)),
    //     page.select('select[id*="device"]', profileData.deviceType).catch(error => console.error('Device Type: ', error.message)),
    //     page.type('input[label*="Phone"][aria-label*="Phone"]', profileData.phone || '').catch(error => console.error('Phone Number: ', error.message))
    // ];

    const page = await browser.newPage();
    await page.goto(jobLink, { waitUntil: 'networkidle2' });

    try {
        // Auto-fill known details
        //await Promise.allSettled(actions);
        await page.type('input[label*="First"][aria-label*="First"]', profileData.firstName || '').catch(error => console.error('First Name: ', error.message)),
        await page.type('input[label*="Last"][aria-label*="Last"]', profileData.lastName || '').catch(error => console.error('Last Name: ', error.message)),
        await page.type('input[type="email"]', profileData.email || '').catch(error => console.error('Email: ', error.message)),
        await page.select('select[id*="device"]', profileData.deviceType).catch(error => console.error('Device Type: ', error.message)),
        await page.type('input[label*="Phone"][aria-label*="Phone"]', profileData.phone || '').catch(error => console.error('Phone Number: ', error.message))
        
        await page.waitForTimeout(1000); // Wait for 500ms
        
        // Resume with manual input for unknown fields
        const unknownFields = await page.$$('input:not([value]):not([name="fullName"]):not([name="email"]):not([name="phone"])');

        if (unknownFields.length > 0) {
            console.log('⚠️ Pausing for manual input. Please complete the remaining fields.');
            await page.evaluate(() => alert('Please fill in the remaining fields and click "Submit" manually.'));
        } else {
            console.log('✅ All known details filled. Submitting...');
            await page.click('button[type="submit"]');
        }

    } catch (error) {
        console.error(`❌ Error during auto-application: ${error.message}`);
        //return {error:`❌ Error during auto-application: ${error.message}`};
    }

    //await browser.close();
}

module.exports = autoApply;
