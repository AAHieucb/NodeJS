const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/cookie', function (req, res) {
    res.cookie('name', 'freetuts.net', {
        expires: new Date(Date.now() + 900000)
    });
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('authorNe', 'thehalfheart@gmail.com');
    res.setHeader('blog', 'freetuts.netsadfafkfjs');
    res.send("success");
    // res.redirect(404, "/getCookie"); // Trang web sẽ hiện hỏi có muốn chuyển sang getCookie k
});

app.get('/getCookie', function (req, res) {
    if (req.cookies.name)
        res.send(`Cookie name co gia tri la ${req.cookies.name}`)
    else res.send('Khong the tim lay cookie co ten la name')
});

app.get('/deleteCookie', function (req, res) {
    res.clearCookie('name'); // 1 là tên cookie, 2 là options
    res.send('Da xoa cookie')
});

app.listen(3000);