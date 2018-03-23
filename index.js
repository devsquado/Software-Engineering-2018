const express = require('express');
const userRoutes = require('./routes/route')
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const ejs = require('ejs');
const routes = require('./routes/api');
const Promise = require('bluebird');


const app = express();

mongoose.connect('mongodb://localhost/usergo');

Promise.promisifyAll(mongoose);

app.use(express.static(__dirname + '/views'));

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);



app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json());

app.use(session({ secret: 'ui2sajhsadaytrop', name: 'melih', resave: false, saveUninitialized: true, cookie: { httpOnly: true, expires: new Date(Date.now() + (40000000)) } }));


app.use('/', routes);

app.get('/', function () {

})



app.listen(process.env.port || 1234, function () {
    console.log("Working!")
})
