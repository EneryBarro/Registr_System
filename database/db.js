const mysql = require('mysql2')
const bcrypt = require('bcrypt')

const connection = mysql.createPool({
    host: 'localhost',
    user: 'bdienin',
    database: 'ucode_web',
    password: 'securepass'
})

module.exports.db = { 
    save: function(login, password, req, res) {
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(Number(10)));

    connection.query("INSERT INTO users (login, password) VALUES (?,?)", [login, password], function (err) {
      if (err !== null) {
        if (err.errno === 1062) {
          return res.render("registr", {
            error: `${login} already exists`,
          });
        }
      } else if (err === null) {
        return res.render('index', {
            error: 'registration is successfull'
        })
      } else {
        return res.render("registr", {
          error: "please try again",
        });
      }
    });
    }, 

    check : function(login, password, req, res) {
    connection.query(
      "SELECT * FROM users WHERE login=?",
      [login] ,
      function (err, rows) {
        if (err) {
          return res.render("index", {
            error: "ERROR",
          });
        }
        if (rows[0] === undefined) {
          return res.render("index", {
            error: "User does not exist.",
          });
        } else if (!bcrypt.compareSync(password, rows[0].password)) {
          return res.render("index", {
            error: "Incorrect password.",
          });
        } else {
          return res.render('index.html');
        }
      }
    );
  }
}
