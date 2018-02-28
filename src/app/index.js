import ReactDOM from 'react-dom';
import React from 'react';
const express = require('express');
const routes = require('./route/route')
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost/usergo',{
    useMongoClient: true });
    
Promise.promisifyAll(mongoose);

app.use(bodyParser.json());

app.use(routes);

export default class LogPage extends React.Component {
    render(){
       return(
               logpage
        )}
}

ReactDOM.render(<LogPage />, document.getElementById('log-page'));
