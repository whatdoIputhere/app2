const nodemailer = require('nodemailer');
dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

console.log('Email:', process.env.EMAIL);
console.log('Password:', process.env.PASSWORD);
console.log('env', process.env);

const mailOptions = {
    from: 'pv19910@alunos.estgv.ipv.pt',
    to: 'pv19910@alunos.estgv.ipv.pt',
    subject: 'teste secrets',
    text: 'teste secrets'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});