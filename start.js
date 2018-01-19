var express= require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var server=express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var cookieParser=require('cookie-parser');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://annobot:badalhr@ds119736.mlab.com:19736/chat',{useMongoClient: true});
//schema
var chat= new mongoose.Schema({
  room:String,
  name:String,
  msg:String

});

var Chat =mongoose.model('Chat',chat);
var log= new mongoose.Schema({
  user:String,
  pass:String

});

var Log =mongoose.model('Log',log);


server.set('view engine','ejs');
//server.use(upload());
server.use(cookieParser());
server.use(bodyParser.json());

server.get('/te/:room',function(req,res){
var di=Chat.find({'room':req.params.room},function(err,data){
if(err) console.log(err);
data.sort( {"_id.$old":1} );
console.log(data);
res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));

});
});


server.post('/dr',urlencodedParser,function(req,res){
  console.log(req.body);
  var dat=req.body;


    var regex = /(<([^>]+)>)/ig;


    dat.room= dat.room.replace(regex, "");

    dat.msg= dat.msg.replace(regex, "");

  var pone=Chat({room:dat.room,name:req.cookies.secret,msg:dat.msg}).save(
  function(err){
    if(err) console.log(err);
    console.log('done');});

res.send(dat);
console.log(dat.name);
});

server.get('/',function(req,res){
 if(!req.cookies.secret){

   res.render('login');

 }
 else {
console.log('already in');

   res.render('test',qs={name:req.cookies.secret});
 }
});
server.post('/check',urlencodedParser,function(req,res){
  res.setHeader('Cache-Control', 'no-cache');
if(!req.cookies.secret){
  console.log('not in');
  var dat=req.body;
  if(dat.user==""){res.render('login');}else{
    var di=Log.find({"user":dat.user},function(err,data){
    if(err) console.log(err);

    if (data[0]) {

    if(data[0].pass==dat.pass){
      console.log(dat.pass);
      console.log(data[0].pass);
console.log('success');
console.log(data[0].user);
res.setHeader('Cache-Control', 'no-cache');
res.cookie('secret',data[0].user);
      res.render('test',qs={name:req.cookies.secret});

    }

else{res.render('login');}}
else{res.render('login');}
});
}}
else{console.log(req.cookies);
res.setHeader('Cache-Control', 'no-cache');
  res.render('test',qs={name:req.cookies.secret});}
});
server.get('\start.js',function(req,res){
  res.render('test');

});
server.get('/lg',function(req,res){
var a=req.cookies.secret;
  console.log(a);

res.clearCookie('secret',a);
  res.redirect('/');
});
server.post('/new',urlencodedParser,function(req,res){

var dat=req.body;
console.log(dat);
  var regex = /(<([^>]+)>)/ig;


  dat.pass= dat.pass.replace(regex, "");

  var ab= dat.user;
  ab= ab.replace('<', "");
  ab= ab.replace('>', "");
  ab= ab.replace('/', "");
  ab= ab.replace('.', "");
  ab= ab.replace('(', "");
  ab= ab.replace(')', "");
  ab= ab.replace(';', "");
  console.log('lol :'+ab);
  console.log('work bitch');
if(dat.user==ab){
  if(dat.pass1==dat.pass){
  var pone=Log({user:dat.user,pass:dat.pass}).save(
  function(err){
    if(err) console.log(err);
    console.log('done');});
res.cookie('secret',dat.user);
res.render('test',qs={name:dat.user});}
else{
console.log('pass unmatch');
  res.render('login');
}}
else{res.redirect('/');}
});
server.get('/start.js',function(req,res){
  res.render('test');

});


server.listen(process.env.PORT || 3000);
console.log('made it');
