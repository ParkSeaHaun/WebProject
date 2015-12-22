var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect("mongodb://parkseahaun:psh11080@ds035385.mongolab.com:35385/psh001");
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

var data={count:0};
app.get('/', function (req, res) {
  data.count++;
  res.render('Web_EJS',data);
});
app.get('/reset', function (req, res) {
  data.count=0;
  res.render('Web_EJS',data);
});
app.get('/set/count', function (req, res) {
  if(req.query.count) data.count=req.query.count;
  res.render('Web_EJS',data);
});
app.get('/set/:num', function (req, res) {
  data.count=count=req.params.num;
  res.render('Web_EJS');
});

app.listen(3000, function() {
  console.log('Server On!');
});
