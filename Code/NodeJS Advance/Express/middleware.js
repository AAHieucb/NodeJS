var express = require('express');
var app = express();

// Tự tạo middleware
var myLogger = function (req, res, next) {
    console.log('Middleware chạy ở route có url ' + req.url + ' và method là ' + req.method)
    next();
}
app.use(myLogger)

app.get("/", function (req, res, next) { 
    res.send('Response');
    console.log("Run to main");
    next()
}, function (req, res, next) {
    console.log("Hello from middleware 2")
    next()
});

app.listen(3000);