const puppeteer = require('puppeteer');

async function autoApply(jobLink, profile) {
    const browser = await puppeteer.launch({
        headless: false,  // Keep the browser visible for manual input, maybe change
        defaultViewport: null
    });

    const dropdown = async (identifier, info) => {
        // Click on the input field to focus
        await page.click(`input[id*="${identifier}"]`).catch(error => console.error(error.message));

        // Type the school name
        await page.type(`input[id*="${identifier}"]`, info).catch(error => console.error(error.message));;

        // Wait for the dropdown options to appear
        await page.waitForSelector('[role="option"]').catch(error => console.error(error.message));; // Adjust the selector if needed

        // Select the first matching option (or navigate if necessary)
        //await page.keyboard.press('ArrowDown').catch(error => console.error('School: ', error.message)); // Navigate to the first option
        await page.keyboard.press('Enter').catch(error => console.error(error.message)); // Select the option
        
    }

    const page = await browser.newPage();
    await page.goto(jobLink, { waitUntil: 'networkidle2' });

    try {
        // Auto-fill known details
        await page.type('input[aria-label*="First"]', profile.firstName || '').catch(error => console.error(error.message));
        await page.type('input[aria-label*="Last"]', profile.lastName || '').catch(error => console.error(error.message));
        await page.type('input[aria-label*="Email"]', profile.email || '').catch(error => console.error(error.message));
        await page.select('select[id*="device"]', profile.deviceType).catch(error => console.error(error.message));
        await page.type('input[aria-label*="Phone"]', profile.phone || '').catch(error => console.error(error.message));
        await page.type('input[aria-label*="title"]', profile.phone || '').catch(error => console.error(error.message));
        await page.type('input[aria-label*="LinkedIn"]', profile.linkedIn || '').catch(error => console.error(error.message));
        // Iterate through the education section
        for (const item of profile.education) {
            await dropdown('school', item.school);
            await dropdown('degree', item.degree);
            await dropdown('discipline', item.field);
            //await dropdown('start-month', item.field);
            //await dropdown('end-month', item.field);
            await page.type('input[id*="start-year"]', item.start.toString() || '').catch(error => console.error(error.message));
            await page.type('input[id*="end-year"]', item.end.toString() || '').catch(error => console.error(error.message));
        }

        const resume = await page.waitForSelector('input[type=file]').catch(error => console.error(error.message));
        await resume.uploadFile(profile.resume).catch(error => console.error(error.message));
        await dropdown('gender', profile.gender);
        await dropdown('hispanic', profile.hispanic);
        await dropdown('race', profile.race);
        await dropdown('veteran', profile.veteran);
        await dropdown('disability', profile.disability);
        //await page.uploadFile('input[type=file]', profile.resume || '').catch(error => console.error('Resume: ', error.message))
        //await page.up
        //await page.click('button[type="submit"]');
        //await page.waitForTimeout(1000); // Wait for 500ms
        
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
