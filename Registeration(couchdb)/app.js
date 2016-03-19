var express = require('express');
var app = express();
var path = require('path');

console.log("test")
// viewed at http://localhost:8080
app.get('/', function(req, res) {
  app.use(express.static(path.join(__dirname, 'www')));

});

app.listen(8080);

console.log("app running in localhost")