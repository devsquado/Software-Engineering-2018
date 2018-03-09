const express = require('express');
const userRoutes = require('./routes/route')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/api');
const Promise = require('bluebird');

const app = express();

mongoose.connect('mongodb://localhost/usergo');
    
Promise.promisifyAll(mongoose);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(routes);

app.get('/',function(){

})

app.listen(process.env.port || 1234,function(){
    console.log("Working!")
})