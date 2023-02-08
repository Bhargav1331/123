const session = require("express-session")
const md5 = require('md5')
const { con } = require('../db/db')

const admins = async (req, res) => {
    req.session.a_vercode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    res.render('adminlogin', {
        islogin: req.session.a_login, a_vercode: req.session.a_vercode
    })

}


const alogin = async (req, res) => {

    if (req.body.vercode == '' || Number(req.body.vercode) !== req.session.a_vercode) {
        res.send("<script>alert('Incorrect verification code');window.location.href = '/admin';</script>")
    }
    else {
        var username = req.body.username;
        var password = md5(req.body.password);

        con.query("SELECT UserName,Password FROM admin WHERE UserName='" + username + "' and Password='" + password + "'", function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                req.session.a_login = result[0].UserName
                res.send("<script type='text/javascript'> document.location = 'admin/dashboard'; </script>")
            }
            else {

                res.send("<script>alert('Invalid Details');window.location.href = '/admin';</script>")

            }
        });

    }
}


const dashboard = async (req, res) => {

    con.query("SELECT COUNT(*) as count FROM `tblbooks` WHERE 1;", function (err, result, fields) {
        if (err) throw err;
        var Books_Listed = result[0].count;

        con.query("SELECT COUNT(*) as count FROM `tblissuedbookdetails` WHERE 1;", function (err, result, fields) {
            if (err) throw err;
            var Times_Book_Issued = result[0].count;
            var status = 1;
            con.query("SELECT COUNT(*) as count from tblissuedbookdetails where RetrunStatus='" + status + "'", function (err, result, fields) {
                if (err) throw err;
                var Times_Books_Returned = result[0].count;
                con.query("SELECT COUNT(*) as count FROM `tblstudents`;", function (err, result, fields) {
                    if (err) throw err;
                    var Registered_Users = result[0].count;



                    con.query("SELECT COUNT(*) as count FROM `tblauthors`", function (err, result, fields) {
                        if (err) throw err;
                        var Authors_Listed = result[0].count;
                        con.query("SELECT COUNT(*) as count FROM `tblcategory`", function (err, result, fields) {
                            if (err) throw err;
                            var Listed_Categories = result[0].count;

                            res.render('admin/dashboard', {
                                Books_Listed: Books_Listed,
                                Times_Book_Issued: Times_Book_Issued,
                                Times_Books_Returned: Times_Books_Returned,
                                Registered_Users: Registered_Users,
                                Authors_Listed: Authors_Listed,
                                Listed_Categories: Listed_Categories,
                            })


                        });
                    });



                });

            });
        });
    });
}


const addcategory = async (req, res) => {

    if (req.method == "POST") {

        var category = req.body.category
        var status = req.body.status
        con.query("INSERT INTO  tblcategory(CategoryName, Status) VALUES('" + category + "', '" + status + "')", function (err, result, fields) {
            if (err) throw err;

            if (result.insertId) {
                req.session.msg = "Brand Listed successfully";
                res.send("<script>window.location.href = 'manage-categories';</script>")
            }
            else {
                req.session.error = "Something went wrong. Please try again";
                res.send("<script>window.location.href = 'manage-categories';</script>")
            }


        });


    }
    else {
        res.render('admin/add-category')
    }




}


const managecategories = async (req, res) => {
    if (req.query.del) {
        var id = req.query.del;
        con.query("delete from tblcategory WHERE id='" + id + "'", function (err, result, fields) {
            if (err) throw err;

            if (result.affectedRows > 0) {
                req.session.delmsg = "Category deleted scuccessfully"
            }
            req.session.error = ''
            req.session.msg = ''
            req.session.updatemsg = ''
        });
    }

    con.query("SELECT * from  tblcategory", function (err, result, fields) {
        if (err) throw err;

        var msg = req.session.msg;
        var error = req.session.error;
        var delmsg = req.session.delmsg;
        var updatemsg = req.session.updatemsg;
        req.session.delmsg = ''
        req.session.error = ''
        req.session.msg = ''
        req.session.updatemsg = ''
        res.render('admin/manage-categories', {
            error: error, msg: msg, result: result, delmsg: delmsg, updatemsg: updatemsg
        })
    });


}


const addauthor = async (req, res) => {
    if (req.method == 'POST') {
        var author = req.body.author;

        con.query("INSERT INTO  tblauthors(AuthorName) VALUES('" + author + "')", function (err, result, fields) {
            if (err) throw err;
            if (result.insertId) {
                req.session.msg = "Author Listed successfully";
                res.send("<script>window.location.href = 'manage-authors';</script>")

            } else {
                req.session.error = "Something went wrong. Please try again";
                res.send("<script>window.location.href = 'manage-authors';</script>")

            }


        });

    }
    else {
        res.render('admin/add-author')

    }



}


const manageauthors = async (req, res) => {


    if (req.query.del) {
        var id = req.query.del;
        con.query("delete from tblauthors WHERE id='" + id + "'", function (err, result, fields) {
            if (err) throw err;

            if (result.affectedRows > 0) {
                req.session.delmsg = "Authors deleted scuccessfully"
            }
            req.session.error = ''
            req.session.msg = ''
            req.session.updatemsg = ''
        });
    }

    con.query("SELECT * from  tblauthors", function (err, result, fields) {
        if (err) throw err;
        var msg = req.session.msg
        var error = req.session.error
        var delmsg = req.session.delmsg
        var updatemsg = req.session.updatemsg
        req.session.delmsg = ''
        req.session.error = ''
        req.session.msg = ''
        req.session.updatemsg = ''

        res.render('admin/manage-authors', {
            error: error, msg: msg, result: result, delmsg: delmsg, updatemsg: updatemsg
        })
    });


}


const addbook = async (req, res) => {

    if (req.method == 'POST') {
        var bookname = req.body.bookname;
        var category = req.body.category;
        var author = req.body.author;
        var isbn = req.body.isbn;
        var price = req.body.price;

        con.query("INSERT INTO  tblbooks(BookName,CatId,AuthorId,ISBNNumber,BookPrice) VALUES('" + bookname + "','" + category + "','" + author + "','" + isbn + "','" + price + "')", function (err, result, fields) {
            if (err) throw err;
            if (result.insertId) {
                req.session.msg = "Book Listed successfully";
                res.redirect('manage-books')
            }
            else {
                req.session.error = "Something went wrong. Please try again";
                res.redirect('manage-books')
            }

        });
    }
    else {
        con.query("SELECT * from  tblcategory where Status='1'", function (err, result, fields) {
            if (err) throw err;

            con.query("SELECT * from  tblauthors", function (errs, results, fields) {
                if (err) throw err;
                res.render('admin/add-book', {
                    result: result, results: results
                })
            });
        });
    }

}


const managebooks = async (req, res) => {

    if (req.query.del) {
        var id = req.query.del;
        con.query("delete from tblbooks  WHERE id='" + id + "'", function (err, result, fields) {
            if (err) throw err;
            if (result.affectedRows > 0) {
                req.session.delmsg = "Books deleted scuccessfully ";
            }

            res.redirect('manage-books')
        });
    }
    else {
        var msg = req.session.msg;
        var error = req.session.error
        var delmsg = req.session.delmsg
        var updatemsg = req.session.updatemsg
        req.session.msg = ''
        req.session.error = ''
        req.session.delmsg = ''
        req.session.updatemsg = ''
        con.query("SELECT tblbooks.BookName,tblcategory.CategoryName,tblauthors.AuthorName,tblbooks.ISBNNumber,tblbooks.BookPrice,tblbooks.id as bookid from  tblbooks join tblcategory on tblcategory.id=tblbooks.CatId join tblauthors on tblauthors.id=tblbooks.AuthorId", function (err, result, fields) {
            if (err) throw err;

            res.render('admin/manage-books', {
                msg: msg, error: error, updatemsg: updatemsg, delmsg: delmsg, result: result
            })
        });
    }




}


const issuebook = async (req, res) => {
    if (req.method == 'POST') {
        var studentid = req.body.studentid;
        var bookid = req.body.bookdetails;

        con.query("INSERT INTO  tblissuedbookdetails(StudentID,BookId) VALUES('" + studentid + "','" + bookid + "')", function (err, result, fields) {
            if (err) throw err;

            if (result.insertId) {
                req.session.msg = "Book issued successfully";
                res.redirect('manage-issued-books');
            } else {
                req.session.error = "Something went wrong. Please try again";
                res.redirect('manage-issued-books');
            }
        });


    }
    else {
        res.render('admin/issue-book')
    }


}


const manageissuedbooks = async (req, res) => {

    var msg = req.session.msg
    var error = req.session.error
    var delmsg = req.session.delmsg
    req.session.msg = ""
    req.session.error = ""
    req.session.delmsg = ""

    con.query("SELECT tblstudents.FullName,tblbooks.BookName,tblbooks.ISBNNumber,tblissuedbookdetails.IssuesDate,tblissuedbookdetails.ReturnDate,tblissuedbookdetails.id as rid from  tblissuedbookdetails join tblstudents on tblstudents.StudentId=tblissuedbookdetails.StudentId join tblbooks on tblbooks.id=tblissuedbookdetails.BookId order by tblissuedbookdetails.id desc", function (err, result, fields) {
        if (err) throw err;

        res.render('admin/manage-issued-books', {
            result: result, msg: msg, error: error, delmsg: delmsg,
        })
    });


}


const regstudents = async (req, res) => {

    if (req.query.inid) {
        var id = req.query.inid;
        var status = 0;

        con.query("update tblstudents set Status='" + status + "'  WHERE id='" + id + "'", function (err, result, fields) {
            if (err) throw err;
            res.redirect('reg-students')
        });

    }
    if (req.query.id) {
        var id = req.query.id;
        var status = 1;

        con.query("update tblstudents set Status='" + status + "'  WHERE id='" + id + "'", function (err, result, fields) {
            if (err) throw err;
            res.redirect('reg-students')
        });

    }
    else {
        con.query("SELECT * from tblstudents", function (err, result, fields) {
            if (err) throw err;
            res.render('admin/reg-students', {
                result: result
            })
        });
    }


}


const changepassword = async (req, res) => {

    if (req.method == 'POST') {
        var password = md5(req.body.password);
        var newpassword = md5(req.body.newpassword);
        var username = req.session.a_login

        con.query("update admin set Password='" + newpassword + "' where UserName='" + username + "' and Password='" + password + "'", function (err, result, fields) {
            if (err) throw err;
            if (result.affectedRows > 0) {
                var msg = "Your Password succesfully changed";
            } else {
                var error = "Your current password is wrong";
            }
            res.render('admin/change-password', {
                msg: msg, error: error
            })


        });
    }
    else {
        res.render('admin/change-password')

    }

}


const editcategory = async (req, res) => {
    if (req.method == "POST") {
        var category = req.body.category;
        var status = req.body.status;
        var catid = req.query.catid;

        con.query("update  tblcategory set CategoryName='" + category + "',Status='" + status + "' where id='" + catid + "'", function (err, result, fields) {
            if (err) throw err;
            req.session.delmsg = '';
            req.session.error = ''
            req.session.msg = ''
            req.session.updatemsg = "Brand updated successfully";
            res.redirect('manage-categories')
        });

    }
    else {
        if (req.query.catid) {
            catid = req.query.catid;
            con.query("SELECT * from tblcategory where id='" + catid + "'", function (err, result, fields) {
                if (err) throw err;

                res.render('admin/edit-category', {
                    result: result
                })


            });

        }
        else {
            res.redirect('admin/manage-category')
        }
    }
}


const editauthor = async (req, res) => {
    if (req.method == "POST") {

        var athrid = req.query.athrid;
        var author = req.body.author;

        con.query("update  tblauthors set AuthorName='" + author + "' where id='" + athrid + "'", function (err, result, fields) {
            if (err) throw err;
            req.session.delmsg = '';
            req.session.error = ''
            req.session.msg = ''
            req.session.updatemsg = "Author info updated successfully";
            res.redirect('manage-authors')
        });

    }
    else {

        if (req.query.athrid) {
            athrid = req.query.athrid;
            con.query("SELECT * from tblauthors where id='" + athrid + "'", function (err, result, fields) {
                if (err) throw err;

                res.render('admin/edit-author', {
                    result: result
                })


            });

        }
        else {
            res.redirect('manage-authors')
        }
    }
}


const editbook = async (req, res) => {
    if (req.method == 'POST') {
        var bookname = req.body.bookname;
        var category = req.body.category;
        var author = req.body.author;
        var isbn = req.body.isbn;
        var price = req.body.price;
        var bookid = req.query.bookid;


        con.query("update  tblbooks set BookName='" + bookname + "',CatId='" + category + "',AuthorId='" + author + "',ISBNNumber='" + isbn + "',BookPrice='" + price + "' where id='" + bookid + "'", function (err, result, fields) {
            if (err) throw err;

            req.session.msg = "Book info updated successfully";
            res.redirect('manage-books')

        });


    }
    else {
        if (req.query.bookid) {

            var bookid = req.query.bookid;


            con.query("SELECT tblbooks.BookName,tblcategory.CategoryName,tblcategory.id as cid,tblauthors.AuthorName,tblauthors.id as athrid,tblbooks.ISBNNumber,tblbooks.BookPrice,tblbooks.id as bookid from  tblbooks join tblcategory on tblcategory.id=tblbooks.CatId join tblauthors on tblauthors.id=tblbooks.AuthorId where tblbooks.id='" + bookid + "'", function (err, result, fields) {
                if (err) throw err;

                var status = 1;
                con.query("SELECT * from  tblcategory where Status='" + status + "'", function (err, result1, fields) {
                    if (err) throw err;

                    con.query("SELECT * from  tblauthors", function (err, result2, fields) {
                        if (err) throw err;

                        res.render('admin/edit-book', {
                            result: result, result1: result1, result2: result2,
                        })

                    });
                })

            });
        }
        else {
            res.render('admin/edit-book')
        }
    }
}


const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/admin')

}

const getstudent = async (req, res) => {

    if (req.body.studentid) {
        var studentid = req.body.studentid;

        con.query("SELECT FullName,Status FROM tblstudents WHERE StudentId='" + studentid + "'", function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                result.forEach(function (element) {

                    if (element.Status == 0) {
                        res.send("<span style='color:red'> Student ID Blocked </span><br/><b>Student Name-</b>" + element.FullName + "<script>$('#submit').prop('disabled',true);</script>")
                    }
                    else {
                        res.send(element.FullName + "<script>$('#submit').prop('disabled',false);</script>");
                    }
                });
            }
            else {
                res.send("<span style='color:red'> Invaid Student Id. Please Enter Valid Student id .</span><script>$('#submit').prop('disabled',true);</script>");
            }


        });
    }

}


const getbook = async (req, res) => {
    if (req.body.bookid) {
        var bookid = req.body.bookid;

        con.query("SELECT BookName,id FROM tblbooks WHERE (ISBNNumber='" + bookid + "')", function (err, result, fields) {
            if (err) throw err;

            if (result.length > 0) {
                result.forEach(function (element) {
                    res.send("<option value='" + element.id + "'>" + element.BookName + "</option><b>Book Name :</b>" + element.BookName + "<script>$('#submit').prop('disabled',false);</script>");

                });
            }
            else {
                res.send("<option class='others'> Invalid ISBN Number</option><script>$('#submit').prop('disabled',true);</script>");
            }

        });
    }

}
const updateissuebookdeails = async (req, res) => {
    if (req.method = "POST") {
        var rid = req.query.rid;
        var fine = req.body.fine
        var rstatus = 1;

        con.query("update tblissuedbookdetails set fine='" + fine + "',RetrunStatus='" + rstatus + "' where id='" + rid + "'", function (err, result, fields) {
            if (err) throw err;
            req.session.msg = "Book Returned successfully";
            res.redirect('manage-issued-books')

        });


    }
    else {
        if (req.query.rid) {
            var rid = req.query.rid;

            con.query("SELECT tblstudents.FullName,tblbooks.BookName,tblbooks.ISBNNumber,tblissuedbookdetails.IssuesDate,tblissuedbookdetails.ReturnDate,tblissuedbookdetails.id as rid,tblissuedbookdetails.fine,tblissuedbookdetails.RetrunStatus from  tblissuedbookdetails join tblstudents on tblstudents.StudentId=tblissuedbookdetails.StudentId join tblbooks on tblbooks.id=tblissuedbookdetails.BookId where tblissuedbookdetails.id='" + rid + "'", function (err, result, fields) {
                if (err) throw err;

                res.render('admin/update-issue-bookdeails', {
                    result: result,
                })
            });

        }
        else {
            res.redirect('manage-issued-books')
        }
    }

}
module.exports = {
    admins,
    alogin,
    dashboard,
    addcategory,
    managecategories,
    addauthor,
    manageauthors,
    addbook,
    managebooks,
    issuebook,
    manageissuedbooks,
    regstudents,
    changepassword,
    logout,
    editcategory,
    editauthor,
    editbook,
    getstudent,
    getbook,
    updateissuebookdeails,

}

