const express = require('express');
const app = express();

const cookieParser = require("cookie-parser");
const sessions = require('express-session');
app.use(cookieParser());

const path = require('path')
const userrouter = require('./routes/user')
const adminrouter = require('./routes/admin')
const hbs = require('hbs')

require('./db/db');

app.set('views', __dirname + '/public/views/');
app.use('/public', express.static('public'));
app.set('view engine', 'hbs')

hbs.registerPartials(path.join(__dirname, '/public/partials/'))
hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});
hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
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

app.use('/admin', adminrouter);

app.use('*', (req, res) => {
    res.render('notfound');
});

app.listen(PORT, () => {
    console.log(`app run on port ${PORT}`)
});
