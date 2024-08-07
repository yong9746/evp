const puppeteer = require("puppeteer");
require("dotenv").config();

const proxy = 'http://23.247.105.131:5195';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

let browser; // Singleton browser instance

const initializeBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [`--proxy-server=${proxy}`],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    console.log('Browser initialized');
  }
  return browser;
};

const scrapeLogic = async (res) => {
  try {
    const browser = await initializeBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Authenticate proxy
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });

    console.log('Page loaded1');

    // Set cookies
    await page.setCookie({
      name: '_elements_session_4',
      value: 'K3JIaU9iTHpzUWNBSTlSdXZvSWVEWlplYlZLVUxlN0tkM3ZkK0FlRUVJbklMSU5SeHp1NXNEdnVNZ0VmdytneFIwMjZYdytyOGI3OFdLSloxcnNKWURQdXp1d3lGZmxCZXQ1N0paTkgrd0ZJaE9pd0NiOU0yRG5mMWo0S1dZSTZJTHR4a0U2Mm5JaXdBUGpFRGlsSG91UmlZOEpPd0NvbGFWK21PT1JLNi9rWXBnMFBaWk9mbDFVNWk1SFB6TXhKaGwzK0l4VkZndEFHbG1BdUNnZDBaRzNrR1NENWdpcjcwQyt5Wi9RQWh5bWZBakw5dU1WM0xwYlZlVFJGR2VSTmgydW1hVmpwSGxRVGV5bWl6TEJwV2FrSnRwYzczZ2E0TjJOcFBMZnlvRFpaUmFLUE4rdzF5T0xWRVVvV0FERXk1YTlkY2pKeU5qN3EwMmVsOUFPS2JOOFhWMDEwY2w5eFRuVnRBTXBGQTdoaEhkNEhCbEY2RWtLZm56NVVFdzFla20xWGJ4VjZ3R3cvdVFLVkVKZllDdz09LS1MU3VaakhBNjR0NnRjTjdwTHdHbUpnPT0%3D--0e9697b57ba7c613ad46cc754e6251b73a57d31c',
      domain: '.elements.envato.com', // Adjust the domain to match the target site
    });

    console.log('Page loaded2');
    const url = 'https://elements.envato.com/portrait-of-happy-beautiful-young-blonde-female-ly-J455WNK';
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('Page loaded');

    // Try to find and click the "Accept all" button
    try {
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('button, a'))
          .some(el => el.textContent.trim() === 'Accept all'),
        { timeout: 5000 } // Adjust timeout as needed
      );
      await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button, a'))
          .find(el => el.textContent.trim() === 'Accept all');
        if (button) {
          button.click();
        }
      });
      console.log('"Accept all" button clicked');
    } catch (e) {
      console.log('"Accept all" button not found, continuing');
    }

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
    await page.screenshot({ path: '/tmp/screenshot.png' });
    console.log('Screenshot saved');

    // Wait for the download button and click it
    await page.waitForSelector('[data-testid="download-without-license-button"]');
    await page.click('[data-testid="download-without-license-button"]');
    console.log('Download button clicked');

    // Set up request interception
    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = request.url();
      if (url.includes('envatousercontent.com')) {
        // Log the URL
        console.log('Intercepted request URL:', url);
        // Send the intercepted URL as response
        res.send(url);
        // Abort the request
        request.abort();
      } else {
        // Allow the request to continue
        request.continue();
      }
    });

    console.log('Task completed successfully');
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    // Optionally close the browser if needed, but keeping it open for speed
    // await browser.close();
  }
};

module.exports = { scrapeLogic };
