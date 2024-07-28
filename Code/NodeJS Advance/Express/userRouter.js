var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('Ban da truy cap dia chi /user bang phuong thuc GET');
});
router.post('/', function (req, res) {
    res.send('Ban da truy cap dia chi /user bang phuong thuc POST');
});

module.exports = router;