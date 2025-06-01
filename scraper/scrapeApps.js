const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false,
        defaultViewport: null // Full-size window
   });
  
   const page = await browser.newPage();

   // Helper: get the frame containing the form
  async function getFormFrame() {
    const frames = page.frames();
    // Heuristically pick the right iframe (could use more advanced checks)
    return frames.find(frame =>
      frame.url().includes('in_iframe=1')
    );
  }



  // Repeated scraping function
  async function scrapeAndSave() {
    try {
      //page.frames().forEach(f => console.log(f.url()));
      const formFrame = await getFormFrame();
      const scrapee = formFrame || page;

      console.log('yo: ' + scrapee.url());

      await scrapee.waitForSelector('input, select', { timeout: 10000 });
      const inputs = await scrapee.$$eval('input, select', elements =>
        elements.map(el => {
          const attrs = {};
          for (const attr of el.getAttributeNames()) {
            attrs[attr] = el.getAttribute(attr);
          }
          return {
            tag: el.tagName.toLowerCase(),
            attributes: attrs,
            label: "", // You can add context extraction later
          };
        })
      );

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputPath = `out/form_fields_${timestamp}.json`;
      fs.writeFileSync(outputPath, JSON.stringify(inputs, null, 2));
      console.log(`Extracted ${inputs.length} elements and saved to ${outputPath}`);
    } catch (err) {
      console.warn(err+ 'Could not find form elements on this page' + err);
    }
  }
  
  //scrapeAndSave()
  await page.exposeFunction('scrapeAndSave', scrapeAndSave);

  // Automatically scrape on every navigation
  // page.on('domcontentloaded', async () => {
  //   console.log('DOM loaded:', page.url());
  //   await scrapeAndSave();
  // });

  // Start from a URL, or just let the user manually navigate
  await page.goto('https://jobs.spectrum.com/job/-/-/4673/81850982400?utm_source=linkedIn&utm_medium=job-listings&utm_campaign=brand&utm_term=RD-TA');

})();
