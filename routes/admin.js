const express = require('express')
const router = express.Router()
const { a_auth } = require('../middleware/a_auth')
const { admins, alogin, dashboard, addcategory, managecategories, addauthor, manageauthors, managebooks, addbook, manageissuedbooks, issuebook, regstudents, changepassword, logout, editcategory, editauthor, editbook, getstudent, getbook, updateissuebookdeails } = require('../controller/admin')

router.get('/', admins);
router.post('/', alogin);
router.get('/dashboard', a_auth, dashboard);
router.use('/add-category', a_auth, addcategory);
router.get('/manage-categories', a_auth, managecategories);
router.use('/edit-category', a_auth, editcategory);
router.use('/add-author', a_auth, addauthor);
router.use('/edit-author', a_auth, editauthor);
router.get('/manage-authors', a_auth, manageauthors);
router.use('/change-password', a_auth, changepassword);
router.use('/add-book', a_auth, addbook);
router.get('/manage-books', a_auth, managebooks);
router.use('/edit-book', a_auth, editbook);
router.use('/issue-book', a_auth, issuebook);
router.post('/get_student', a_auth, getstudent);
router.post('/get_book', a_auth, getbook);
router.get('/manage-issued-books', a_auth, manageissuedbooks);
router.use('/update-issue-bookdeails', a_auth, updateissuebookdeails);
router.get('/reg-students', a_auth, regstudents);
router.get('/logout', a_auth, logout);

module.exports = router