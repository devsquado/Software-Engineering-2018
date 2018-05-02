const Usermodel = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const async = require('async');
const passport = require('passport');
const nodemailer = require('nodemailer');
const index = require('../index');




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

var forgot = function (req,res,next){

  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      
      Usermodel.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.render('forgot_pass');
          
        }
        
        
        
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 360000000; // 1 hour
   
       

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
     
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'devsquad556@gmail.com',
          pass: 'devsqu123'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    
    res.render('forgot_pass');
  });
};



var homepage = function (req, res) {
    if (req.session.user != null) {
        return res.render('hp');
    }

    else {
        return res.render('index');
    }

}

var reset = function(req,res){
  Usermodel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.render('forgot_pass');
  }
  console.log(req.params.token);

  res.render('new_pass', {
    user: req.user,    

  });
});
};

var newpass = function(req,res){
  token = req.body.token
  async.waterfall([
    function(done) {

      console.log(Date.now());
        console.log(token);

      Usermodel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        
        
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/homepage');
        }


        
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
          user.password = hash;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.saveAsync()
        .then(function (savedUser) {
          
          res.render('index')
        })
        .catch(function (err) {
          return res.render('404', {
            hata_kodu: err
          });
        });
        })
      });

        

        

        user.save(function(err) {
          req.logIn(user, function(err) {
            return res.redirect('/homepage');
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
          user: 'devsquad556@gmail.com',
          pass: 'devsqu123'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
};

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

var main = function (req, res) {
  var name = req.session.user.name;
  Usermodel.findOne({ name:name }, function(err, user) {
    if (user) {
      return res.render('main', {
        pname : user.name
      });
    }
  })  
}

var topic = function (req, res) {
  var name = req.session.user.name;
  Usermodel.findOne({ name:name }, function(err, user) {
    if (user) {
      return res.render('topic', {
        pname : user.name
      });
    }
  })  
}

var chat = function(req,res){
  var name = req.session.user.name;
  Usermodel.findOne({ name:name }, function(err, user) {
    if (user) {
      return res.render('chat2', {
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
exports.forgot = forgot;
exports.reset = reset;
exports.newpass = newpass;
exports.account_settings = account_settings;
exports.contact = contact;
exports.profile_settings = profile_settings;
exports.main = main;
exports.topic = topic;
exports.chat = chat;