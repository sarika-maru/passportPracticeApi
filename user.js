const mongoose = require('mongoose');
const passport= require('passport');
const localStrategy= require('passport-local').Strategy;
const express= require('express');
const bodyParser= require('body-parser');
const jwt=require('jsonwebtoken');
const NodeSession = require('node-session');
const parseurl = require('parseurl');

const {authenticate} = require('./middleware/authenticate');
const db = require('./config/db');
const {User}= require('./modal/user.modal');


const  app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(passport.initialize());

var nodesession = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});

function session(req, res, next){
    nodesession.startSession(req, res, next);
}

app.use(session);
passport.use(session);

/*app.use(function (req, res, next) {
    var views = req.session.get('views', {});

    // get the url pathname
    var pathname = parseurl(req).pathname.slice(1);

    // count the views
    views[pathname] = (views[pathname] || 0) + 1;

    req.session.set('views', views);

    //console.log("token" + req.session.get('_token'));


    next();


});*/


passport.use(new localStrategy(function (username,password,done) {
    User.findOne({username, password}, function (err, user) {
        if (err) {
            return done(null, false);
        }
        if (!user) {
            return done(null, false);
        }
        req.session.put('key', 'value');
        return done(null, user);

    });
}))


passport.serializeUser(function (user,done) {
   done(null,user);
});

passport.deserializeUser(function (id,done) {
    //console.log("d"+user);
    done(null,user);
});

app.post('/UserLoginForm',passport.authenticate('local',{ successRedirect : '/',
                                                    failureRedirect : '/err'}));
app.post('/user',(req,res)=>{
   var user= new User({username :req.body.username, password : req.body.password});
   user.save().then((u)=>{
      res.send(u);
   },(err)=>{
       res.send(err)
   });
});

app.get('/logout',(req,res,next)=>{
   req.session.flush();
   res.send("logout"+req.session.get('_token'));
});

app.post('/UserRegForm',(req,res)=>{
   var user = new User({username : req.body.username,password: req.body.password,gender: req.body.gender,city : req.body.city});
   user.save().then((u)=>{
       res.json("User Insert");
   },(err)=>{
       res.json("Insertion Failed");
   }).catch ((err)=>{
       res.json(err);
});
});

app.get('/',(req,res)=>{
    res.json("You are succesfully login");
});

app.get('/err',(req,res)=>{
    res.json("Login Failed");
});

app.get('/AllUser',authenticate,(req,res)=>{
    User.find().then((users,err)=>{
        if(err){
            res.send(err);
        }
       res.send(users);
    });
});



app.listen(8888,()=>{
    console.log("Connected on server at 8888");
});

module.export ={app}
