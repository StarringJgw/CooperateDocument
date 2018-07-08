var express = require("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.listen(1109);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.get('/getText', function (req, res) {
    fs.readFile('test1.txt', 'utf-8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.send(data);
        }
    });

})
app.post('/submit', function (req, res) {
    fs.writeFile('test1.txt', req.body.content, function (err) {
        if (err) {
            console.log(err);
        }
    });
    console.log(req.body.content);
    res.send('ok');
})