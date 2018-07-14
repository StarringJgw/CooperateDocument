var express = require("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
var current;
String.prototype.insert = function (index, content) {
    return this.slice(0, index - 1) + content + this.slice(index - 1);
}
app.use(bodyParser.json());
app.listen(1109);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/test.html');
})
app.get('/getText', function (req, res) {
    fs.readFile('test1.txt', 'utf-8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.send({
                content: data
            });
        }
        current = data;
    });

})
app.post('/submit', function (req, res) {
    // fs.writeFile('test1.txt', req.body.content, function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    console.log(req.body);
    res.send('ok');
    req.body.action.forEach(element => {
        if (element.type === "i") {
            if (element.content == null) {
                current = current.insert(element.index, "\n")
            } else {
                current = current.insert(element.index, element.content)
            }
        }
        if (element.type === "d") {
            current = current.slice(0, element.index) + current.slice(element.index + 1);
        }
        console.log(current);
        fs.writeFile('test1.txt', current, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
})