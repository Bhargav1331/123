const a_auth = async (req, res, next) => {

    if (req.session.a_login) {
        next()
    }
    else {
        res.redirect('/admin');
    }
}


module.exports = {
    a_auth,
}
