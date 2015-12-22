var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect(process.env.MonGo_DB);
var db = mongoose.connection;
db.once("open", function () {
  console.log("DB Connected!");
});
db.on("error", function (err) {
  console.log("DB ERROR :", err);
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});
var Data = mongoose.model('data',dataSchema);
Data.findOne({name:"MyData"}, function(err,data){
  if(err) return console.log("Data ERROR:",err);
  if(!data){
    Data.create({name:"MyData",count:0},function (err,data) {
      if(err) return console.log("Data ERROR:",err);
      console.log("Counter Initialized :",data);
    });
  }
});

app.set("view engine", 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  Data.findOne({name:"MyData"}, function(err,data){
    if(err) return console.log("Data ERROR:",err);
    data.count++;
    data.save(function (err) {
      if(err) return console.log("Data ERROR:",err);
      res.render('Web_EJS',data);
    });
  });
});
app.get('/reset', function (req, res) {
  setCounter(res,0);
});
app.get('/set/count', function (req, res) {
  if(req.query.count) setCounter(res,req.query.count);
  else getCounter(res);
});
app.get('/set/:num', function (req, res) {
  if(req.query.count) setCounter(res,req.params.count);
  else getCounter(res);
});

function setCounter(res,num) {
  console.log("setCounter!");
  Data.findOne({name:"MyData"}, function(err,data){
    if(err) return console.log("Data ERROR:",err);
    data.count=num;
    data.save(function (err) {
        if(err) return console.log("Data ERROR:",err);
        res.render('Web_EJS',data);
    });
  });
}

function detCounter(res) {
  console.log("getCounter!");
  Data.findOne({name:"MyData"}, function(err,data){
    if(err) return console.log("Data ERROR:",err);
        res.render('Web_EJS',data);
    });
}

app.listen(8000, function() {
  console.log('Server On!');
});
