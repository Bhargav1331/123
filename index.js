const express = require('express');
const app = express();

const cookieParser = require("cookie-parser");
const sessions = require('express-session');
app.use(cookieParser());

const path = require('path')
const userrouter = require('./routes/user')
const hbs = require('hbs')

require('./db/db');

app.set('views', __dirname + '/public/views');
app.use('/public', express.static('public'));
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, '/public/partials'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5050

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));



app.use('/', userrouter);

 app.use('/admin', (req, res) => {
    res.send('<h1>This is admin Panel...</h1>')
}); 

 app.use('*', (req, res) => {
    res.render('notfound');
}); 

app.listen(PORT, () => {
    console.log(`app run on port ${PORT}`)
});
