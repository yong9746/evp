const puppeteer = require('puppeteer-core');
require('dotenv').config();

const proxy = 'http://23.247.105.131:5195';
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

let browser; // Singleton browser instance

const initializeBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${proxy}`,
        '--disable-images',
        '--disable-media'
      ],
      executablePath: process.env.NODE_ENV === 'production'
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    });
    console.log('Browser initialized');
  }
  console.log('Browser initialized2');
  return browser;
};

const scrapeLogic = async (res) => {
  try {
    const browser = await initializeBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Intercept requests to avoid loading images and videos
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (['image', 'media'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Authenticate proxy
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });

    console.log('Page loaded1');

    // Set cookies
    await page.setCookie({
      name: '_elements_session_4',
      value: 'aFFRM2RtVm1PY3N3MGdFR2JENExKdHBmSlBHOXg0M0pUekVQK1JUYXQ2YjM1VndaNTZKQW5qenZ0Y0pLSnFqZUNUazdFRTRqTHR2ZHVGVWxGTWVFSDljQ3ZDcHUrdURCM1A3WTA5bEs3Q0hvaU1YbEZ3SExiZlRKcjRMaEhoYTNuY2doRlc4Yk5JK2JYSkFielNpREc3Q1lWZWF3S2YwRDlOSzV1d0YxY3paY0MxaTlYOHdDN1pWbS91UjVVNEVYU2lmQThwSHUxVExmQXVpbGtyYWZrTFJDYnBvRjlDSXpZaUdSTSt6NG5hUWcrQ1BSaFVvVFRJSnZNbkMraFhzaEZDZk92aVRrMmh5Ti9jUWppNWZXMDQ3Z2d4V3JPV0E2R20rb2ttU1FtbFNEZ0hLMEJiem1IbzkvVWtUNjd1M2w1b2xHTUNWY1VCSjFndFNGME9FWm4rVHdLU3BsQWFRNXV5UXByWHM3dkhHSTFPMytiVXZBZWlDeWlVbUg3c2ZuajdTMDIyM0JJajA1OFNJM2g3bHdQZz09LS03TDZuZGRiSVNicW9NVHU5dVptdjRBPT0%3D--3dd7868d072a066ae47bdcba5a5f1b10ad6cc96a',
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
