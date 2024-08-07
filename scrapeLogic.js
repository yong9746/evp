const puppeteer = require("puppeteer");
require("dotenv").config();


const proxy = 'http://23.247.105.131:5195';
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
     console.log('cc1');
    const page = await browser.newPage();
    const url = 'https://elements.envato.com/logotype-modern-logo-font-4X4ER6T' ;
    // await page.goto("https://elements.envato.com/logotype-modern-logo-font-4X4ER6T");
    
        await page.authenticate({
            username: 'msnmmayl',
            password: '626he4yucyln',
          });
console.log('cc4');
           // Set cookies
        await page.setCookie({
            name: '_elements_session_4',
            value: 'N29OSTN2ZDFWdmZjc1UvQ2lMYkxJRkRhUjlTcS8vVjRqd1FhdWFIRWVZTEdnUklWWXpLNGdRVnlvdnl5UzUrWE9MSGJPQm1aNlVjcTllTEJpaWJnR1VBQUlPUUFVL05NU09qUU5ZZ3RCVTVWdm9OQU5HV1VNS0pPQmtyOFIrZkE3ZG5JcG9HRktXZ1dvUE43RENmTHNBOXJwV0U3STViUmpCbkYvQk56R2RiNFBKQU9YSWphUWVXWW5MR2VwRm9tUVR5LzFlZjIxc2VvZmpnSE1sREFVUDI2dFlPNXdzbFpoVXRPczF5ZjlEdldkTUR3Nm9LeFlHRGJoMVBtNzNLZlJmMXZYU21IWDkyczhJRlBLbldNZTAycW9TWUU2Z2ExeVpkUDQ2TEZjemFJcmUrM0lPYWlPbE9UOWc4WSt5Y2dSUEFwQ3dTRFFDUnRwY1o2a2lOallxMUJidVYrRFQvUG9teit3OUVRNW9YclB5OTFVVmVFNGpYRFJTckRxMlJNZlZZOHNLV0pFdytKT24yeC9icnlwdz09LS0wVzBNT0JSK05Nd1l2UkFjWEh6Qk1BPT0%3D--6737668aa4ecd5c6513b72e3df24e62c12a232de',
            domain: '.elements.envato.com', // Adjust the domain to match the target site
        });
        await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('cc2');
    // Set screen size
// const data = await page.evaluate(() => document.querySelector('*').outerHTML);

   
      
      console.log('cc');
                // Wait for the element containing the text to load
                await page.waitForSelector('.woNBXVXX');

                // Extract the text content
                const text = await page.evaluate(() => {
                // Replace '.target-element-class' with the actual class, id, or selector of the element
                return document.querySelector('.woNBXVXX').innerText;
                });
  console.log('dd');
                console.log('Extracted Text:', text);
                await page.keyboard.press('Escape');
                await page.keyboard.press('Escape');
                await page.keyboard.press('Escape');
                await page.keyboard.press('Escape');
                await page.keyboard.press('Escape');
                await page.keyboard.press('Escape');


                // Wait for the button to be available in the DOM
                await page.waitForSelector('.ncWzoxCr.WjwUaJcT.NWg5MVVe.METNYJBx');

                // Click the button
                await page.click('.ncWzoxCr.WjwUaJcT.NWg5MVVe.METNYJBx');

                console.log('Button clicked!');
  await page.screenshot({ path: '/tmp/screenshot.png' });
 
  console.log('ee');
    
            // Wait for the button to be available in the DOM
            await page.waitForSelector('[data-testid="download-without-license-button"]');
            console.log('Button clicked2!');

            // Click the button
            await page.click('[data-testid="download-without-license-button"]');

            console.log('Button clicked22!');


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

    // Print the full title
    res.send('gg');
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
