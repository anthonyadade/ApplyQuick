const puppeteer = require('puppeteer');

async function autoApply(jobLink, profileData) {
    const browser = await puppeteer.launch({
        headless: false,  // Keep the browser visible for manual input, maybe change
        defaultViewport: null
    });

    const page = await browser.newPage();
    await page.goto(jobLink, { waitUntil: 'networkidle2' });

    try {
        // Auto-fill known details
        await page.type('input[name="fullName"]', profileData.name || '');
        await page.type('input[name="email"]', profileData.email || '');
        await page.type('input[name="phone"]', profileData.phone || '');
        
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
    }

    await browser.close();
}

module.exports = autoApply;
