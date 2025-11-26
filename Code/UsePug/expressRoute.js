var express = require("express");
var app = express();
var router = express.Router()

router.use(function (req, res, next) {
    console.log('Custom middleware run')
    next();
})
router.get('/', function (req, res) {
    throw new Error("Eror");
})
app.use("/", router);

function errorHandling(err, req, res, next) {
    res.status(500).send('Something broke!')
}
app.use(errorHandling);

app.listen(3000);