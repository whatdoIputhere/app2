const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
dotenv = require('dotenv');
dotenv.config();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const cookieString = "MoodleSession202324=1dp23l0676ks87bsl20emg7rjp";

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const mailOptions = {
    from: 'pv19910@alunos.estgv.ipv.pt',
    to: 'pv19910@alunos.estgv.ipv.pt',
    subject: 'SAIU NOTAS DE REDES',
    text: 'SAIU NOTAS DE REDES'
};

oldAvalElement = "";
oldTesteElement = "";

fetch("https://moodle.estgv.ipv.pt/course/view.php?id=6581", {
    headers: {
        Cookie: cookieString
    }
}).then(response => {
    if (response.ok) {
        console.log("Response OK");
        return response.text();
    } else {
        console.log("Response not OK");
        throw new Error("Something went wrong");
    }
}).then(html => {
    console.log("HTML fetched");
    const dom = new JSDOM(html);
    const newDOM = dom.window.document;
    const newAvalElement = newDOM.querySelector('#section-2');
    oldAvalElement = newAvalElement.innerHTML;
    const newTesteElement = newDOM.querySelector('#section-6');
    oldTesteElement = newTesteElement.innerHTML;
    console.log("Old Aval Element updated");
    console.log("Old Teste Element updated");
}).catch(error => {
    console.error(error);
});


console.log("started")
setInterval(() => {
    console.log("Fetching HTML");
    fetch("https://moodle.estgv.ipv.pt/course/view.php?id=6581", {
        headers: {
            Cookie: cookieString
        }
    }).then(response => {
        if (response.ok) {
            console.log("Response OK");
            return response.text();
        } else {
            console.log("Response not OK");
            throw new Error("Something went wrong");
        }
    }).then(html => {
        console.log("HTML fetched");
        const dom = new JSDOM(html);
        const newDOM = dom.window.document;
        if (oldTesteElement != null) {
            const newAvalElement = newDOM.querySelector('#section-2');
            console.log(new Date().toLocaleString());
            if (oldAvalElement != newAvalElement.innerHTML) {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                console.log("Different");
                console.log("Opening newaval.html in browser");
                oldAvalElement = newAvalElement.innerHTML;
            } else {
                console.log("No changes #1");
            }
            const newTesteElement = newDOM.querySelector('#section-6');

            if (oldTesteElement != newTesteElement.innerHTML) {
                console.log(newTesteElement.innerHTML);
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                console.log("Different");
                oldTesteElement = newTesteElement.innerHTML;
            } else {
                console.log("No changes #2");
            }
            console.log();
        }
    }).catch(error => {
        console.error(error);
    });
}, 10 * 1000);
