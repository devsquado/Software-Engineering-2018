const express = require('express');
const userRoutes = require('./routes/route')
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const ejs = require('ejs');
const routes = require('./routes/api');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const async = require('async');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const bcrypt = require('bcryptjs');
const socket = require('socket.io')

const app = express();

var server = app.listen(process.env.port || 1234, function () {
    console.log("Working!")
})



mongoose.connect('mongodb://localhost/usergo');

Promise.promisifyAll(mongoose);

app.use(express.static(__dirname + '/views'));

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

  
  
var io = socket(server);

io.on('connection', (socket) => {
    console.log('made socket connection',socket.id);
  
    socket.on('chat', function(data){
      io.sockets.emit('chat', data);
  });
    socket.on('typing', function(data){
      socket.broadcast.emit('typing', data);
  });
});
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json());

app.use(session({ secret: 'ui2sajhsadaytrop', name: 'melih', resave: false, saveUninitialized: true, cookie: { httpOnly: true, expires: new Date(Date.now() + (40000000)) } }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', routes);

app.get('/', function () {

})



