var express = require('express')
var app = express();
const a = 1;

app.use(function (req, res, next) {
    console.log("Run middleware use");
    res.header("Access-Control-Allow-Origin", "*"); // Mọi domain được quyền truy cập website
    // res.header("Access-Control-Allow-Origin", "https://freetuts.net"); // VD cors sẽ chỉ cho phép mỗi domain này
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Middleware trên chạy trước middleware test
const test = (req, res, next) => {
    console.log("Run middleware test");
    next();
}

app.get('/products/:id', test, function (req, res, next) {
    res.json({
        msg: 'This is CORS-enabled '
    })
})

app.listen(3000, function () {
    console.log('web server listening on port 3000')
})