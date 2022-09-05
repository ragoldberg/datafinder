
const https = require('https');

const url = encodeURIComponent('https://www.linkedin.com/company/broadcom/');
const options = {
  hostname: 'api.proxycrawl.com',
  path: '/?token=42MPlXMTqs0BSwtscQ8XFw&scraper=linkedin-company&url=' + url
};

https.request(options, (response) => {
  let body = '';
  response.on('data', chunk => body += chunk).on('end', () => console.log(body));
}).end();