const puppeteer = require('puppeteer');

async function autoApply(jobLink, profile) {
    const browser = await puppeteer.launch({
        headless: false,  // Keep the browser visible for manual input, maybe change
        defaultViewport: null
    });

    const noAnswerOptions = ['Decline to', "I don't wish", 'I do not want', 'Prefer '];
    const yesOptions = ['Yes', 'I identify'];
    const declineOptions = ['No', 'I am not'];

    // Translating our input to the application's wording
    const optionToOptions = new Map([
        ['Prefer Not To Say', noAnswerOptions],
        ['Yes', yesOptions],
        ['No', declineOptions],
        ]);

    const dropdown = async (identifier, info) => {
        // Click on the input field to focus
        try { // if the field doesn't exist, just return
            await page.click(`input[id*="${identifier}"]`);
        } catch (error) {
            console.error(error.message);
            return;
        }
        if (optionToOptions.has(info)) {
            for (const option of optionToOptions.get(info)) {
                try {
                    // Type the options
                    await page.type(`input[id*="${identifier}"]`, option);
                    // Wait for the dropdown options to appear
                    await page.waitForSelector('[role="option"]', { timeout: 500 });
                    break; //break if we found a match
                } catch (error) {
                    console.error(`Error with option "${option}": ${error.message}`);
                    // clear field to try next option
                    await page.$eval(`input[id*="${identifier}"]`, el => el.value = '');
                }
            }
        } else {
            // Type the info
            await page.type(`input[id*="${identifier}"]`, info).catch(error => console.error(error.message));
            await page.waitForSelector('[role="option"]').catch(error => console.error(error.message));
        }

        // Select the first matching option (or navigate if necessary)
        //await page.keyboard.press('ArrowDown').catch(error => console.error('School: ', error.message)); // Navigate to the first option
        await page.keyboard.press('Enter').catch(error => console.error(error.message)); // Select the option
        
    }

    const getMonthName = (mongoDate) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthNum = parseInt(mongoDate.split('-')[1], 10);
        return months[monthNum - 1] || "Invalid month"; // Subtract 1 because arrays are zero-indexed
    };

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
        const edu = profile.education;
        for (let i=0; i<edu.length; i++) {
            await dropdown('school--'+i, edu[i].school);
            await dropdown('degree--'+i, edu[i].degree);
            await dropdown('discipline--'+i, edu[i].field);
            await dropdown('start-month--'+i, getMonthName(edu[i].start));
            await dropdown('end-month--'+i, getMonthName(edu[i].end));
            await page.type(`input[id*="start-year--${i}"]`, edu[i].start.slice(0, 4) || '').catch(error => console.error(error.message));
            await page.type(`input[id*="end-year--${i}"]`, edu[i].end.slice(0, 4) || '').catch(error => console.error(error.message));
            if (i+1 !== edu.length) {
                await page.click('button[class*="add-another"]');
            }
        }

        const resume = await page.waitForSelector('input[type=file]').catch(error => console.error(error.message));
        await resume.uploadFile(profile.resume).catch(error => console.error(error.message));
        await dropdown('gender', profile.gender);
        await dropdown('hispanic', profile.hispanic);
        await dropdown('race', profile.race);
        await dropdown('veteran', profile.veteran);
        await dropdown('disability', profile.disability);
        
        // Resume with manual input for unknown fields
        const unknownFields = await page.$$('input:not([value]):not([name="fullName"]):not([name="email"]):not([name="phone"])');

        if (unknownFields.length > 0) {
            console.log('⚠️ Pausing for manual input. Please complete the remaining fields.');
            await page.evaluate(() => alert('Please fill in the remaining fields and click "Submit" manually.'));
        } else {
            console.log('✅ All known details filled. Submitting...');
            //await page.click('button[type="submit"]');
        }

    } catch (error) {
        console.error(`❌ Error during auto-application: ${error.message}`);
        //return {error:`❌ Error during auto-application: ${error.message}`};
    }

    //await browser.close();
}

module.exports = autoApply;
