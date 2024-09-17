if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const app = express();

const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));



app.get('/', (req, res) => {
    res.redirect('/portfolio');
});


app.get('/portfolio', (req, res) => {
    res.render('index');
});

app.get('/portfolio/contact', (req, res) => {
    res.render('contact');
});

app.get('/portfolio/about', (req, res) => {
    res.render('about');
});
app.get('/portfolio/projects', (req, res) => {
    res.render('portfolio');
});


app.post('/portfolio/contact/send', (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.MAIL,
        subject: `Contact Form: ${subject}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Something went wrong.');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).redirect('/portfolio/contact');
        }
    });


});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
