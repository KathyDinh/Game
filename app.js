var express = require('express');
var app = express();
var path = require("path");

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(express.static(__dirname));
app.listen(5000, function () {
  console.log('App listening on port 5000!');
});
