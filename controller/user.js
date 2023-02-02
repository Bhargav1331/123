const md5 = require('md5')
const { con } = require('../db/db')
var validator = require("email-validator");

const first = async (req, res) => {
    if (req.session.login) {
        res.redirect('/dashboard')
    }
    else {
        req.session.vercode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        res.render('login', {
            vercode: req.session.vercode
        })
    }
}

const login = async (req, res) => {

    if (req.method == 'POST') {

        if (req.body.vercode == '' || Number(req.body.vercode) !== req.session.vercode) {
            res.send("<script>alert('Incorrect verification code');window.location.href = '/';</script>")
        }
        else {

            var email = req.body.emailid
            var password = md5(req.body.password)

            con.query("SELECT EmailId,Password,StudentId,Status FROM tblstudents WHERE EmailId='" + email + "' and Password='" + password + " '", function (err, result, fields) {
                if (err) throw err;

                if (result.length > 0) {
                    req.session.stdid = result[0].StudentId
                    if (result[0].Status == 1) {
                        req.session.login = result[0].EmailId
                        res.redirect('/dashboard')
                    }
                    else {
                        res.send("<script>alert('Your Account Has been blocked .Please contact admin');window.location.href = '/';</script>")

                    }


                }
                else {

                    res.send("<script>alert('Invalid Details');window.location.href = '/';</script>")

                }



            });
        }

    }
    else {
        req.session.vercode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        res.render('login', {
            vercode: req.session.vercode
        })
    }


}

const dashboard = async (req, res) => {
    var sid = req.session.stdid
    con.query("SELECT id from tblissuedbookdetails where StudentID='" + sid + "'", function (err, result, fields) {
        if (err) throw err;

        con.query("SELECT id from tblissuedbookdetails where StudentID='" + sid + "' and RetrunStatus='0'", function (err, result1, fields) {
            if (err) throw err;
            res.render('dashboard', {
                islogin: req.session.login, no_booksissued: result.length, no_booksreturned: result1.length
            });

        });




    });

}

const myprofile = async (req, res) => {
    var sid = req.session.stdid

    if (req.body.fullanme && req.body.mobileno && req.body.email) {

        con.query("update tblstudents set FullName='" + req.body.fullanme + "',MobileNumber='" + req.body.mobileno + "' where StudentId='" + sid + "'", function (err, result, fields) {
            if (err) throw err;
        });

    }
    con.query("SELECT StudentId,FullName,EmailId,MobileNumber,RegDate,UpdationDate,Status from  tblstudents  where StudentId='" + sid + "'", function (err, result, fields) {
        if (err) throw err;

        res.render('myprofile', {
            islogin: req.session.login, result: result[0]
        })

    });



}
const changepassword = async (req, res) => {
    if (req.body.password && req.body.newpassword && req.body.confirmpassword) {
        password = md5(req.body.password)
        newpassword = md5(req.body.newpassword)
        email = req.session.login
        con.query("update tblstudents set Password='" + newpassword + "' where EmailId='" + email + "' and Password='" + password + "'", function (err, result, fields) {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.render('changepassword', {
                    islogin: req.session.login, msg: 'Your Password succesfully changed'
                })
            }
            else {
                res.render('changepassword', {
                    islogin: req.session.login, error: 'Your current password is wrong'
                })
            }

        });
    }
    else {
        res.render('changepassword', {
            islogin: req.session.login
        })
    }
}



const issuedbooks = async (req, res) => {

    var sid = req.session.stdid
    con.query("SELECT tblbooks.BookName,tblbooks.ISBNNumber,tblissuedbookdetails.IssuesDate,tblissuedbookdetails.ReturnDate,tblissuedbookdetails.id as rid,tblissuedbookdetails.fine from  tblissuedbookdetails join tblstudents on tblstudents.StudentId=tblissuedbookdetails.StudentId join tblbooks on tblbooks.id=tblissuedbookdetails.BookId where tblstudents.StudentId='" + sid + "' order by tblissuedbookdetails.id desc", function (err, result, fields) {
        if (err) throw err;
        res.render('issuedbooks.hbs', {
            islogin: req.session.login, result: result
        })

    });



}
const signup = async (req, res) => {


    if (req.method == 'POST') {
        if (req.body.vercode == '' || Number(req.body.vercode) !== req.session.vercode) {
            res.send("<script>alert('Incorrect verification code');window.location.href = '/signup';</script>")
        }
        else {

            con.query("SELECT id  FROM tblstudents ORDER BY id DESC limit 1", function (err, result, fields) {
                if (err) throw err;
                count = result[0].id + 1;

                var StudentId = 'SID' + count;
                var fname = req.body.fullanme
                var mobileno = req.body.mobileno
                var email = req.body.email
                var password = md5(req.body.password);
                var status = 1;
                con.query("INSERT INTO  tblstudents(StudentId,FullName,MobileNumber,EmailId,Password,Status) VALUES('" + StudentId + "','" + fname + "','" + mobileno + "','" + email + "','" + password + "','" + status + "')", function (err, result, fields) {
                    if (err) throw err;
                    if (result.affectedRows > 0) {

                        res.send("<script>alert('Your Registration successfull and your student id is " + StudentId + "'); window.location.href ='/signup'</script>")
                    } else {
                        res.send("<script>alert('Something went wrong. Please try again'); window.location.href ='/signup'</script>")
                    }
                });
            });


        }
    }
    else {
        req.session.vercode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        res.render('signup', {
            islogin: req.session.login, vercode: req.session.vercode
        })
    }



}




const adminlogin = async (req, res) => {
    res.render('adminlogin')

}
const forgotpassword = async (req, res) => {

    if (req.method == 'POST') {
        if (req.body.vercode == '' || Number(req.body.vercode) !== req.session.vercode) {
            res.send("<script>alert('Incorrect verification code');window.location.href = '/forgotpassword';</script>")
        } else {
            email = req.body.email
            mobile = req.body.mobile
            newpassword = md5(req.body.newpassword)

            con.query("update tblstudents set Password='" + newpassword + "' where EmailId='" + email + "' and MobileNumber='" + mobile + "'", function (err, result, fields) {
                if (err) throw err;

                if (result.affectedRows > 0) {
                    res.send("<script>alert('Your Password succesfully changed'); window.location.href = '/forgotpassword';</script>")
                }
                else {
                    res.send("<script>alert('EmailId or Mobile Number is invalid');window.location.href = '/forgotpassword';</script> ")
                }

            });
        }
    }
    else {
        req.session.vercode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        res.render('forgotpassword', {
            islogin: req.session.login, vercode: req.session.vercode
        })
    }


}
const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/as');

}

const check_availability = async (req, res) => {

    if (req.method == "POST") {
        var email = req.body.emailid
        if (!validator.validate(email)) {
            res.send("<span style='color:red'>error : You did not enter a valid email.</span>")
        }
        else {
            con.query("SELECT EmailId FROM tblstudents WHERE EmailId='" + email + "'", function (err, result, fields) {
                if (err) throw err;
                if (result.length > 0) {
                    res.send("<span style='color:red'> Email already exists .</span> <script>$('#submit').prop('disabled',true);</script>")
                }
                else {
                    res.send("<span style='color:green'> Email available for Registration .</span><script>$('#submit').prop('disabled',false);</script>")
                }



            });

        }

    }
}
module.exports = {
    login,
    dashboard,
    myprofile,
    changepassword,
    issuedbooks,
    signup,
    adminlogin,
    forgotpassword,
    logout,
    check_availability,
    first,
}
