var mysql = require('mysql');

/* var con = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12594614",
    password: "4a45ceNFVh",
    database: "sql12594614"
}); */
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "library"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("DataBase Connected!");

});

module.exports = {
    con,
}