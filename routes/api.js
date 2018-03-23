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
  

  return router })();
