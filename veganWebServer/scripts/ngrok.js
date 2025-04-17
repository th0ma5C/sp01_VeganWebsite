// Require ngrok javascript sdk
const ngrok = require("@ngrok/ngrok");
const dotenv = require('dotenv');
const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV || 'production';
const envFile = `.env.${NODE_ENV}`;
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`Loaded environment variables from ${envFile}`);
} else {
    dotenv.config();
    console.warn(`Loaded environment variables from default .env`);
}

(async function () {
    const listener = await ngrok.forward({ addr: 3000, authtoken: process.env.NGROK_TOKEN });

    console.log('ngrok Public URL:', listener.url());
})();

process.stdin.resume();