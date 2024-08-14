const axios = require('axios');
require('dotenv').config();

const scrapeLogic = async (res, url, cookieValue, proxy) => {
  try {
    // Build the request payload for PhantomJsCloud Automation API
    const requestPayload = {
      url,
      renderType: 'automation', // Use 'automation' to enable full browser automation
      requestSettings: {
        proxy: proxy,
        cookies: [
          {
            name: '_elements_session_4',
            value: cookieValue,
            domain: '.elements.envato.com',
          },
        ],
        customHeaders: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        // Intercept and block image and media requests
        postRequestScripts: [
          {
            script: `function(page,request) {
              if (['image', 'media'].includes(request.resourceType())) {
                request.abort();
              } else {
                request.continue();
              }
            }`,
          },
        ],
      },
      renderSettings: {
        enableJavascript: true,
        viewport: {
          width: 1280,
          height: 800,
        },
        clipRectangle: {
          top: 0,
          left: 0,
          width: 1280,
          height: 800,
        },
      },
      // Actions to be performed on the page after it is loaded
      actions: [
        {
          actionType: 'click', // Click on 'Accept all' button
          selector: 'button, a',
          selectorMatches: {
            textContent: 'Accept all',
          },
        },
        {
          actionType: 'click', // Click on the download button
          selector: '.ncWzoxCr.WjwUaJcT.NWg5MVVe.METNYJBx',
        },
        {
          actionType: 'click', // Click on the download-without-license button
          selector: '[data-testid="download-without-license-button"]',
        },
      ],
    };

    // Send the request to PhantomJsCloud Automation API
    const response = await axios.post(
      `https://phantomjscloud.com/api/browser/v2/${process.env.PHANTOMJS_CLOUD_API_KEY}/`,
      requestPayload
    );

    const result = response.data;

    if (result && result.pageResponses) {
      const pageContent = result.pageResponses[0].content;
      const interceptedRequest = result.pageResponses[0].metrics.resourceUrls.filter(url => url.includes('envatousercontent.com'));

      if (interceptedRequest.length > 0) {
        console.log('Intercepted request URL:', interceptedRequest[0]);
        res.send(interceptedRequest[0]);
      } else {
        const extractedText = pageContent.match(/class="woNBXVXX">([^<]+)<\/div>/);
        if (extractedText) {
          console.log('Extracted Text:', extractedText[1]);
          res.send(extractedText[1]);
        } else {
          console.log('Text element not found.');
          res.send('Text element not found.');
        }
      }
    } else {
      console.log('No valid page response.');
      res.send('No valid page response.');
    }

    console.log('Task completed successfully');
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running: ${e}`);
  }
};

module.exports = { scrapeLogic };
