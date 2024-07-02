const axios = require("axios");
require("dotenv").config();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const login = require("./auth").login;
const sendEmail = require("./mail").sendEmail;
const fs = require("fs");
let _client = "";
let _notifications = [];
let _pageInfo = [];
let _interval = 1000 * 30;
let _intervalId = null;
const apiEndpoint = `http://${process.env.API_ENDPOINT}:80`;
async function startSession() {
    console.log("Getting client");
    try {
        if (_intervalId) {
            clearInterval(_intervalId);
            _intervalId = null;
        }
        const client = await login(
            "https://moodle.estgv.ipv.pt/login/index.php",
            process.env.MOODLE_USER,
            process.env.MOODLE_PASS
        );
        if (!client) {
            console.error("Failed to get client, retrying in 5 seconds...");
            setTimeout(startSession, 5000);
            return;
        }
        _client = client;
        console.log("Got client");
        await getNotifications();
        monitor();
    } catch (error) {
        console.error("Error in startSession:", error);
    }
}

async function getNotifications() {
    console.log("Getting notifications");
    try {
        const response = await axios.get(apiEndpoint + "/notification");
        _notifications = response.data;
        for (const notification of _notifications) {
            const index = _pageInfo.findIndex((page) => page.url === notification.url);
            if (index !== -1) {
                continue;
            }
            const response = await _client.get(notification.url);
            const pageTitle = new JSDOM(response.data).window.document.querySelector(
                "title"
            ).textContent;
            let normalizedPage = normalizePage(response.data);
            fs.writeFileSync(pageTitle + ".html", page.content);

            _pageInfo.push({
                url: notification.url,
                content: normalizedPage,
                email: notification.email,
                pageTitle: pageTitle,
            });
        }
        for (let i = 0; i < _pageInfo.length; i++) {
            const page = _pageInfo[i];
            const index = _notifications.findIndex((notification) => notification.url === page.url);
            if (index === -1) {
                _pageInfo.splice(i, 1);
            }
        }
        console.log("Got notifications");
    } catch (error) {
        console.error("Error fetching notifications:", error.code);
        console.log("Retrying in 5 seconds...");
        setTimeout(getNotifications, 5000);
    }
}

function monitor() {
    console.log("Monitoring urls");
    _intervalId = setInterval(async () => {
        console.log("--------------------------------------------");
        for (let i = 0; i < _pageInfo.length; i++) {
            const page = _pageInfo[i];
            console.log("Checking page:", page.pageTitle);
            try {
                const response = await _client.get(page.url);
                if (response.status !== 200 || response.data.includes("Entrar no site")) {
                    console.error("Failed to fetch page or session expired:", response.status);
                    console.log("=============================================");
                    restartSession();
                    break;
                }
                const normalizedPageResponse = normalizePage(response.data);
                if (page.content === normalizedPageResponse) {
                    console.log("No updates to page " + page.pageTitle);
                    continue;
                }
                sendEmail(page.email, `Updates made to ${pageTitle}`, page.url);
                console.log("Page updated " + page.pageTitle);
                fs.writeFileSync(page.pageTitle + "_old.html", page.content);
                fs.writeFileSync(page.pageTitle + "_new.html", normalizedPageResponse);
                page.content = normalizedPageResponse;
            } catch (error) {
                console.error("Error processing fetch page code", error.code);
                restartSession();
                break;
            }
        }
        await getNotifications();
    }, _interval);
}

function normalizePage(page) {
    const footerIndex = page.indexOf("<footer");
    if (footerIndex !== -1) {
        page = page.substring(0, footerIndex);
    }
    return page
        .replace(/id="[^"]*"/g, "")
        .replace(/aria-[^"]*"/g, "")
        .replace(/popover-region-container-[^"]*"/g, "")
        .replace(/drop-down-[^"]*"/g, "")
        .replace(/requests-tab-[^"]*"/g, "")
        .replace(/contacts-tab-[^"]*"/g, "")
        .replace(/view-overview-[^"]*"/g, "")
        .replace(/message-drawer-[^"]*"/g, "")
        .replace(/block-[^"]*"/g, "")
        .replace(/enter-[^"]*"/g, "");
}

function restartSession() {
    clearInterval(_intervalId);
    _intervalId = null;
    _pageInfo = [];
    startSession();
}

async function main() {
    await startSession();
}

main();
