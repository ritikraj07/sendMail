require('dotenv').config({ path: './.env' });
const fs = require('fs');
const express = require('express');
const SendMail = require('./sendMail');


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/sendmail', (req, res) => {
    const { name, email, message } = req.body;
    const mail = new SendMail();
    mail.setTo(email);
    mail.setSubject(`Hello ${name}`);
    mail.setText(message);

    // Generate OTP
    const otp = '1234567890';

    // Read the HTML file and replace the placeholder with OTP
    fs.readFile('./mail.html', 'utf8', (err, html) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // Replace placeholder with OTP
        html = html.replace('<span id="otpPlaceholder"></span>', otp);
        html = html.replace('<span id="user_name"></span>', name);
        html = html.replace('<span id="company_name"></span>', process.env.COMPANY_NAME);
        html = html.replace('<span id="company_email_id"></span>', '<a href="mailto:ritikra3rrr@gmail">ritikra3rrr@gmail.com</a>');
        mail.setHTML(html);
        mail.send();
        res.send('Email sent successfully');
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});