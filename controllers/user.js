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


var profile = function (req, res) {
  var name = req.session.user.name;
  Usermodel.findOne({ name:name }, function(err, user) {
    if (user) {
      return res.render('profile_about', {
        pname : user.name
      });
    }
  })  
}




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

var account_settings = function (req, res) {
  var name = req.session.user.name;
  Usermodel.findOne({ name:name }, function(err, user) {
    if (user) {
      return res.render('account_settings', {
        pname : user.name
      });
    }
  })  
}

var contact = function (req, res) {
  var name = req.session.user.name;
  Usermodel.findOne({ name:name }, function(err, user) {
    if (user) {
      return res.render('profile_contact', {
        pname : user.name
      });
    }
  })  
}

var profile_settings = function (req, res) {
  var name = req.session.user.name;
  Usermodel.findOne({ name:name }, function(err, user) {
    if (user) {
      return res.render('profile_settings', {
        pname : user.name
      });
    }
  })  
}

exports.homepage = homepage;
exports.profile = profile;
exports.create = create;
exports.login = login;
exports.loginpage = loginpage;
exports.logout = logout;
exports.account_settings = account_settings;
exports.contact = contact;
exports.profile_settings = profile_settings;
