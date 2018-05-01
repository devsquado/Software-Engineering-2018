const express = require('express');
const userCtrl = require('../controllers/user');
const app=express();
const router = express.Router();

module.exports = (function() {

  router.post('/register', userCtrl.create);
  router.get('/homepage', userCtrl.homepage);
  router.post('/login', userCtrl.login);
  router.get('/loginpage', userCtrl.loginpage);
  router.get('/logout',userCtrl.logout);
  router.get('/profile', userCtrl.profile);
  router.get('/account_settings', userCtrl.account_settings);
  router.get('/profile_settings', userCtrl.profile_settings);
  router.get('/contact', userCtrl.contact);
  router.get('/main', userCtrl.main);
  router.get('/topic', userCtrl.main);
  

  return router })();
