const express = require('express');
const userCtrl = require('../controllers/user');
const app=express();
const router = express.Router();

module.exports = (function() {

  router.post('/register', userCtrl.create);
  //router.get('/usersList', userCtrl.reguser);
  router.post('/login', userCtrl.login);
  router.get('/loginpage', userCtrl.loginpage);
  router.get('/logout',userCtrl.logout);
  //router.get('/chat', userCtrl.chat);

  return router })();
