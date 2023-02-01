const express = require('express')
const router = express.Router()
const { login, dashboard, myprofile, changepassword, issuedbooks, adminlogin, signup, forgotpassword, logout, check_availability, first } = require('../controller/user')
const { auth } = require('../middleware/auth')

router.get('/', first);
router.post('/', login)
router.get('/dashboard', auth, dashboard)



module.exports = router
