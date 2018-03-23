const Usermodel = require('../models/user');
const bcrypt = require('bcryptjs');

var loginpage = function (req, res) {
  res.render('index')
}

var create = function (req, res, next) {

  console.log(req.body.email)

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      console.log(hash);
      var user = new Usermodel({
        name: req.body.username,
        email: req.body.email,
        password: hash


      });

      user.saveAsync()
        .then(function (savedUser) {
          res.render('index')
        })
        .catch(function (err) {
          return res.render('404', {
            hata_kodu: err
          });
        });
    });
  });

};

var login = function (req, res, next) {

  //var logusername= req.body.username;
  var email = req.body.logemail;
  var password = req.body.logpassword;

  Usermodel.findOne({ email: email }, function (err, user) {

    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!user) {
      return res.render('404', {
        hata_kodu: err
      })
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.send(err)
      }
      if (result) {

        req.session.user = user;

        return res.redirect('/homepage');
      }
      return res.render('404');


    })

  }
  )
}

var logout = function (req, res) {
  
  req.session.user = null; 
  return res.redirect('/');


}

var homepage = function (req, res) {
    if (req.session.user != null) {
        return res.render('hp');
    }

    else {
        return res.render('index');
    }

}

exports.homepage = homepage;
exports.create = create;
exports.login = login;
exports.loginpage = loginpage;
exports.logout = logout;
