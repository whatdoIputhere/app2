const nodemailer = require('nodemailer');
require("dotenv").config();

function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: "Outlook",
        auth: {
            user: process.env.MOODLE_USER + "@alunos.estgv.ipv.pt",
            pass: process.env.MOODLE_PASS,
        },
    });

    let mailOptions = {
        to: to,
        subject: subject,
        text: text,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

exports.sendEmail = sendEmail;