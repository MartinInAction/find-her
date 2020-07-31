const puppeteer = require('puppeteer')

const TINDER_OAUTH_URL = 'https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&client_id=464891386855067&ret=login&fallback_redirect_uri=221e1158-f2e9-1452-1a05-8983f99f7d6e&ext=1556057433&hash=Aea6jWwMP_tDMQ9y';
const EMAIL_ID = '#email';
const PASSWORD_ID = '#pass';
const LOGIN_ID = '#loginbutton';
const CONFIRM_SELECTOR = 'button[name="__CONFIRM__"]';

async function generateAccessToken({ emailAddress, password }) {
    console.log('Started puppeteer')
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('Navigating to tinder oauth')
    await page.goto(TINDER_OAUTH_URL);
    console.log('Inputing email')
    await page.click(EMAIL_ID);
    await page.keyboard.type(emailAddress);
    console.log('Inputing pass')
    await page.click(PASSWORD_ID);
    await page.keyboard.type(password);
    console.log('Clicked login')
    await Promise.all([
        page.waitForNavigation(),
        page.click(LOGIN_ID),
    ]);
    console.log('checking 2-factor auth');
    
    await delay(3000);

    if (page.url().indexOf('www.facebook.com/checkpoint/?next') !== -1) {
        console.log('We dont support 2 factor auth... sorry you are fucked')
        return Promise.reject(new Error('2 factor auth not supported... fuck you'))
    }
    await page.waitForSelector(CONFIRM_SELECTOR);
    console.log('Clicking confirm')
    const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().endsWith('/dialog/oauth/confirm/')),
        page.click(CONFIRM_SELECTOR),
    ]);
    console.log('getting your token')
    const responseText = await response.text();
    const tokenParameter = 'access_token=';
    const startIndexOfAccessToken = responseText.indexOf(tokenParameter) + tokenParameter.length;
    const endIndexOfAccessToken = responseText.indexOf('&', startIndexOfAccessToken);
    await browser.close();
    return responseText.substring(startIndexOfAccessToken, endIndexOfAccessToken)
}

module.exports = generateAccessToken;

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
