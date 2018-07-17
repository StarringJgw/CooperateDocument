var express = require("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
var current;
String.prototype.insert = function (index, content) {
    return this.slice(0, index - 1) + content + this.slice(index - 1);
}
Object.prototype.followSet = function (changeSet2) {
    changeSet2.action.forEach(step2 => {
        this.followChain(step2);
    });
}

Object.prototype.followChain = function (step2) {
    //this.action = this.action.map(i => 1);
    this.action = this.action.map(step1 => {
        var temp1, temp2;
        temp1 = followStep(step1, step2); //左
        temp2 = followStep(step2, step1); //右
        step1 = temp2;
        step2 = temp1;
        return step1;
    });
}
//传入两个元操作对象
function followStep(step1, step2) {
    if (step1 === null || step2 === null) {
        return step2;
    } else if (step1.type === "i" && step2.type === "i") {
        if (step1.index <= step2.index) {
            step2.index++;
        } else {

        }
        return step2;
    } else if (step1.type === "d" && step2.type === "d") {
        if (step1.index < step2.index) {
            step2.index--;
        } else if (step1.index > step2.index) {

        } else {
            step2 = null;
        }
        return step2;
    } else if (step1.type === "d" && step2.type === "i") {
        if (step1.index < step2.index) {
            step2.index--;
        } else {

        }
        return step2;
    } else if (step1.type === "i" && step2.type === "d") {
        if (step1.index <= step2.index) {
            step2.index++;
        } else {

        }
        return step2;
    }
}
//返回一个转化过 先step1 再step2 的元操作
function initText(name) {
    var x = new Array();
    x[0] = new Object();
    fs.readFile(name, 'utf-8', function (err, data) {
        x[0].version = 0;
        x[0].text = data;
    })

    return x;
}
test = initText("./test1.txt");
app.use(bodyParser.json());
app.listen(1109);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/test.html');
})
app.get('/getText', function (req, res) {
    res.send(test[test.length - 1]);
})

function apply(base, changeSet) {
    changeSet.action.forEach(element => {
        if (element.type === "i") {
            if (element.content == null) {
                base = base.insert(element.index, "\n")
            } else {
                base = base.insert(element.index, element.content)
            }
        }
        if (element.type === "d") {
            base = base.slice(0, element.index) + base.slice(element.index + 1);
        }
        console.log(base);
        return base
    });
}
app.post('/submit', function (req, res) {
    // fs.writeFile('test1.txt', req.body.content, function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // });.
    console.log(req.body);
    if (req.body.length != 0) {
        var i = req.body.version + 1;
        for (; i <= test.length - 1; i++) {
            req.body.followSet(test[i].changeSet);
        }
        var next = {
            version: test.length,
            text: apply(test[test.length - 1], req.body),
            changeSet: req.body
        }
        test.push(next);
        console.log(test);
    }
    res.send('ok');
    fs.writeFile('test1.txt', current, (err) => {
        if (err) {
            console.log(err);
        }
    });
})