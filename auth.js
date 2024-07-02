const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar } = require("tough-cookie");
const cheerio = require("cheerio");

require("dotenv").config();

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function getLoginToken(url) {
    try {
        const response = await client.get(url, {
            withCredentials: true,
        });
        const $ = cheerio.load(response.data);
        const logintoken = $('input[name="logintoken"]').val();
        return logintoken;
    } catch (error) {
        console.error("Error fetching logintoken:", error);
        return null;
    }
}

async function login(loginUrl, username, password) {
    try {
        const logintoken = await getLoginToken(loginUrl);
        if (!logintoken) {
            console.error("Failed to fetch login token, retrying");
            login(loginUrl, username, password);
            return;
        }

        const postData = {
            username: username,
            password: password,
            logintoken: logintoken,
            anchor: "",
            rememberusername: 1,
        };

        const response = await client.post(loginUrl, postData, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (response.status === 200) {
            return client;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error during login:", error);
        return false;
    }
}

module.exports = { login };