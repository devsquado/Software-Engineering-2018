const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Topic = require('../models/topic');



router.get('/users',function(req, res, next){
    User.find({}).then(function(users){
        res.send(users);
    })
});

router.post('/users',function(req, res, next){
    User.create(req.body).then(function(user){
        res.send(user);
    }).catch(next);
    
});

router.put('/users/:id',function(req, res, next){
    User.findByIdAndUpdate({_id: req.params.id},req.body).then(function(user){
      User.findOne({_id: req.params.id}).then(function(user){
        res.send(user);
      })
        
    })
});

router.delete('/users/:id',function(req, res, next){
    User.findByIdAndRemove({_id:req.params.id}).then(function(user){
        res.send(user);
    });
});

module.exports = router;
