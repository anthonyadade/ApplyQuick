const puppeteer = require('puppeteer');
const axios = require('axios');

const noAnswerOptions = ['Decline to', "I don't wish", 'I do not want', 'Prefer '];
const yesOptions = ['Yes', 'I identify'];
const declineOptions = ['No', 'I am not'];

// Translating our input to the application's wording
const optionToOptions = new Map([
    ['Prefer Not To Say', noAnswerOptions],
    ['Yes', yesOptions],
    ['No', declineOptions],
]);

const getMonthName = (mongoDate) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthNum = parseInt(mongoDate.split('-')[1], 10);
    return months[monthNum - 1] || "Invalid month"; // Subtract 1 because arrays are zero-indexed
};

// call the ml model
const predictFieldLabel = async (field) => {
    try {
        const response = await axios.post('http://localhost:8001/predict', field);
        //console.log(field.attributes['name'] + ", response: " + response.data.label)
        return response.data.label;
    } catch (error) {
        console.error('ML prediction error:', error.message);
        return "unknown";
    }
}

// handles dropdown
const dropdown = async (scrapee, identifier, info) => {
    // Click on the input field to focus
    try { // if the field doesn't exist, just return
        await scrapee.click(`input[id*="${identifier}"]`);
    } catch (error) {
        console.error(error.message);
        return;
    }
    if (optionToOptions.has(info)) {
        for (const option of optionToOptions.get(info)) {
            try {
                // Type the options
                await scrapee.type(`input[id*="${identifier}"]`, option);
                // Wait for the dropdown options to appear
                await scrapee.waitForSelector('[role="option"]', { timeout: 500 });
                break; //break if we found a match
            } catch (error) {
                console.error(`Error with option "${option}": ${error.message}`);
                // clear field to try next option
                await scrapee.$eval(`input[id*="${identifier}"]`, el => el.value = '');
            }
        }
    } else {
        // Type the info
        await scrapee.type(`input[id*="${identifier}"]`, info).catch(error => console.error(error.message));
        await scrapee.waitForSelector('[role="option"]').catch(error => console.error(error.message));
    }

    // Select the first matching option (or navigate if necessary)
    //await scrapee.keyboard.press('ArrowDown').catch(error => console.error('School: ', error.message)); // Navigate to the first option
    await scrapee.keyboard.press('Enter').catch(error => console.error(error.message)); // Select the option
}

// Helper: get the frame containing the form
const getFormFrame = async (page) => {
    const frames = page.frames();
    // Heuristically pick the right iframe (could use more advanced checks)
    return frames.find(frame =>
        frame.url().includes('in_iframe=1')
    );
}

async function autoApply(jobLink, profile) {
    const browser = await puppeteer.launch({
        headless: false,  // Keep the browser visible for manual input, maybe change
        defaultViewport: null
    });

    const page = (await browser.pages())[0];
    await page.goto(jobLink, { waitUntil: 'networkidle2' });

    const autoFill = async () => {
        try {
            const formFrame = await getFormFrame(page);
            const scrapee = formFrame || page;
            
            await scrapee.waitForSelector('input, select', { timeout: 10000 });
            
            const elements = await scrapee.$$('input, select');

            for (const el of elements) {
                const attrs = await el.evaluate(e => {
                    const obj = {};
                    for (const attr of e.getAttributeNames()) {
                        obj[attr] = e.getAttribute(attr);
                    }
                    return obj;
                });
                const input = {
                    tag: await el.evaluate(e => e.tagName.toLowerCase()),
                    attributes: attrs,
                    label: ""
                };
                const predictedLabel = await predictFieldLabel(input);
                // Now use predictedLabel to decide how to autofill this field
                if (predictedLabel in profile) {
                    await el.type(profile[predictedLabel] || '').catch(error => console.error(error.message));
                }
            }

            await scrapee.evaluate(() => alert('Autofill complete.'));

        } catch (error) {
            console.error(`❌ Error during auto-application: ${error.message}`);
        }
    }

    await autoFill();

    // can call autoFill() in console to run autofill again on current page
    // ueseful for multipage applications ahem workday
    await page.exposeFunction('autoFill', autoFill);
}

module.exports = autoApply;
