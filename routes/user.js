const express = require('express')
const router = express.Router()
const { login, dashboard, myprofile, changepassword, issuedbooks, adminlogin, signup, forgotpassword, logout, check_availability } = require('../controller/user')
const { auth } = require('../middleware/auth')

router.get('/', (req, res) => {
    if (req.session.login) {
        res.redirect('/dashboard')
    }
    else {
        req.session.vercode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        res.render('login', {
            vercode: req.session.vercode
        })
    }
});
router.post('/', login)
router.get('/dashboard', auth, dashboard)
router.get('/myprofile', auth, myprofile)
router.post('/myprofile', auth, myprofile)
router.get('/changepassword', auth, changepassword)
router.post('/changepassword', auth, changepassword)
router.get('/issuedbooks', auth, issuedbooks)
router.get('/adminlogin', auth, adminlogin)
router.get('/signup', signup)
router.post('/signup', signup)
router.get('/forgotpassword', forgotpassword)
router.post('/forgotpassword', forgotpassword)
router.get('/logout', auth, logout)
router.post('/check_availability', check_availability)


module.exports = router
