var express = require("express");
var app = express();
var router = express.Router()

// Dùng express
// 1 function(req,res,next){} đã được gọi là 1 middleware của nodejs r
router.use(function (req, res, next) {
    console.log('middleware run')
    next();
})
router.get('/', function (req, res) {
    throw new Error("Eror");
})
app.use("/", router);

// Error middleware là vòng catch ngoài cùng sẽ bắt cả lỗi ta throw
function errorHandling(err, req, res, next) {
    res.status(500).send('Something broke!')
}
app.use(errorHandling);


app.listen(3000);