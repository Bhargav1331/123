//FDSFSFSF
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const path = require('path')
app.use(cookieParser());
const userrouter = require('./routes/user')
//MIDDLEWARE
const { auth } = require('./middleware/auth')
const hbs = require('hbs')
//DATABASE REUIREMENT
require('./db/db');
const con = require('./db/db');
app.set('views', __dirname + '/public/views');
app.use('/public', express.static('public'));
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, '/public/partials'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const md5 = require('md5');
const { clearScreenDown } = require('readline');
const PORT = process.env.PORT || 5050

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
clearScreenDown
// a variable to save a session
var session;
//MIDDLEWARE
/* app.use(auth) */

// FOR ALL ROTES 

app.use('/', userrouter);

app.use('/admin', (req, res) => {
    res.send('<h1>This is admin Panel...</h1>')
});
/* 
app.use('/', (req, res) => { res.redirect('/lib') }); */


























app.use('*', (req, res) => {
    res.render('notfound');
});

//LISTEN FOR PORT
app.listen(PORT, () => {
    console.log(`app run on port ${PORT}`)
});