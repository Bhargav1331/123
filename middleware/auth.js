const express = require('express');
const app = express();

const auth = async (req, res, next) => {

    if (req.session.login) {
        next()
    }
    else {
        res.redirect('/');
    }
}





module.exports = {
    auth
}