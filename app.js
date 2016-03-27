var express = require('express');
var app = express();
var path = require('path');
var mongodb = require('./mongo_client');
var oodb = require('./Oodb.js');
var bodyParser = require('body-parser')
var _oodb = new oodb();  
var url = 'mongodb://localhost:27017/test';


// Use connect method to connect to the Server
mongodb.connect(url, function(err, db) {
  if (err) return
  	console.log("mongo server connected...!!!!!")
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));


app.get('/', function(req, res) {
  app.use(express.static(path.join(__dirname, 'www')));

});

app.post('/registerUser', function(req, res) {
		var query = {
			tableName : "users",
			filter : {},
			option :{},
			value : req.body
		};
		_oodb.save(query,function(response){
			if(response.status==200){
				console.log(response.data)		
				res.send({status:200, response: response.data})
				res.status(200)
			}else{
				res.send({status:500, msg: response.msg})
				res.status(500)
				console.log(response.msg)
				console.log("test")
			}			
		});
		// _oodb.get(query,function(response){
		// 	if(response.status==200){
		// 		console.log(response.data)		
		// 		res.send({status:200, response: response.data})
		// 		res.status(200)
		// 	}else{
		// 		res.send({status:500, msg: response.msg})
		// 		res.status(500)
		// 		console.log(response.msg)
		// 	}			
		// });
})

app.listen(8080,'192.168.56.1');

console.log("app running in localhost")