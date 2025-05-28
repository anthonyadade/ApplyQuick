const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = 'https://workday.wd5.myworkdayjobs.com/en-US/Workday/job/USA%2C-OR%2C-Remote/Sr-Engagement--Project--Delivery--Manager---State---Local-Government_JR-0095254-1/apply/autofillWithResume?source=Careers_Website'; // Replace with job link

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('input, select', { timeout: 10000 });

  const inputs = await page.$$eval('input, select', elements =>
    elements.map(el => {
      const attrs = {};
      for (const attr of el.getAttributeNames()) {
        attrs[attr] = el.getAttribute(attr);
      }
      return {
        tag: el.tagName.toLowerCase(),
        attributes: attrs,
        label: "", // Label later
      };
    })
  );

  const outputPath = 'form_fields.json';
  fs.writeFileSync(outputPath, JSON.stringify(inputs, null, 2));
  console.log(`✅ Extracted ${inputs.length} elements and saved to ${outputPath}`);

  await browser.close();
})();
