const puppeteer = require("puppeteer");
require("dotenv").config();


const proxy = 'http://104.223.227.145:6668';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      `--proxy-server=${proxy}`,
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
   console.log('Browser launched');
        const page = await browser.newPage();
        
        // Authenticate proxy
        await page.authenticate({
          username: proxyUsername,
          password: proxyPassword,
        });
    
      
    
        // Set cookies
        await page.setCookie({
          name: '_elements_session_4',
          value: 'N29OSTN2ZDFWdmZjc1UvQ2lMYkxJRkRhUjlTcS8vVjRqd1FhdWFIRWVZTEdnUklWWXpLNGdRVnlvdnl5UzUrWE9MSGJPQm1aNlVjcTllTEJpaWJnR1VBQUlPUUFVL05NU09qUU5ZZ3RCVTVWdm9OQU5HV1VNS0pPQmtyOFIrZkE3ZG5JcG9HRktXZ1dvUE43RENmTHNBOXJwV0U3STViUmpCbkYvQk56R2RiNFBKQU9YSWphUWVXWW5MR2VwRm9tUVR5LzFlZjIxc2VvZmpnSE1sREFVUDI2dFlPNXdzbFpoVXRPczF5ZjlEdldkTUR3Nm9LeFlHRGJoMVBtNzNLZlJmMXZYU21IWDkyczhJRlBLbldNZTAycW9TWUU2Z2ExeVpkUDQ2TEZjemFJcmUrM0lPYWlPbE9UOWc4WSt5Y2dSUEFwQ3dTRFFDUnRwY1o2a2lOallxMUJidVYrRFQvUG9teit3OUVRNW9YclB5OTFVVmVFNGpYRFJTckRxMlJNZlZZOHNLV0pFdytKT24yeC9icnlwdz09LS0wVzBNT0JSK05Nd1l2UkFjWEh6Qk1BPT0%3D--6737668aa4ecd5c6513b72e3df24e62c12a232de',
          domain: '.elements.envato.com', // Adjust the domain to match the target site
        });
    
        const url = 'https://elements.envato.com/logotype-modern-logo-font-4X4ER6T';
        await page.goto(url, { waitUntil: 'networkidle2' });
    
        console.log('Page loaded');
    
        await page.waitForFunction(() =>
            Array.from(document.querySelectorAll('button, a'))
                .some(el => el.textContent.trim() === 'Accept all')
        );
    
        // Click the button with text 'Accept all'
        await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll('button, a'))
                .find(el => el.textContent.trim() === 'Accept all');
            if (button) {
                button.click();
            }
        });
        // Set screen size (optional)
        await page.setViewport({ width: 1280, height: 800 });
    
        // Wait for the element containing the text to load
        await page.waitForSelector('.woNBXVXX');
    
        // Extract the text content
        const text = await page.evaluate(() => {
          return document.querySelector('.woNBXVXX').innerText;
        });
    
        console.log('Extracted Text:', text);
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');

    
        // Click the button
        await page.click('.ncWzoxCr.WjwUaJcT.NWg5MVVe.METNYJBx');
        console.log('Button clicked!');
    
        // Take a screenshot
        console.log('Screenshot saved');
    
        // Wait for the download button and click it
        await page.waitForSelector('[data-testid="download-without-license-button"]');
        await page.click('[data-testid="download-without-license-button"]');
        console.log('Download button clicked');
    
        // Send a response
        console.log('Task completed successfully');
      // Set up request interception
        await page.setRequestInterception(true);
        page.on('request', request => {
          const url = request.url();
          if (url.includes('envatousercontent.com')) {
            // Log the URL
            console.log('Intercepted request URL:', url);
            // Abort the request
            request.abort();
          } else {
            // Allow the request to continue
            request.continue();
          }
        });
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
