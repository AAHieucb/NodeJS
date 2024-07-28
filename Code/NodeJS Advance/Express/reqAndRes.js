var express = require('express');
var app = express();

app.use(express.urlencoded({
    extended: true
}));

// Dùng cURL
// VD: curl -d "username='admin&password=1234" -X POST "http://localhost:3000/user/123?userID=123&action=changeProfile" 
app.post('/user/:userid', (req, res) => {
    console.log(req.params.userid) // "123"
    console.log(req.query.userID) // "123"
    console.log(req.query.action) // "changeProfile"
    console.log(req.body.username); //admin
    console.log(req.body.password); //1234
    console.log(req.protocol)
    console.log(req.hostname)
    console.log(req.path)
    console.log(req.originalUrl)
    console.log(req.subdomains)
    // subdomain là tên miền phụ. Ví dụ: mysite.com là tên miền của 1 website chính, nhưng ta muốn tạo 1 web forum cho web đó thì mua 1 tên miền mới sẽ tốn chi phí, thay vì v ta tạo ra forum.mysite.com thì vừa có sự liên kết mà k mất thêm tiền. 

    console.log(req.header('Content-Type')) // Lấy các thông tin header gửi đi
    console.log(req.header('Content-Length')) // Đây là các thông tin phổ biến tự có
    console.log(req.header('user-agent')) // User sử dụng cái gì để gửi đi, VD curl
    console.log(req.header('Authorization'))

    // Lấy cookie
    console.log(req.cookies);
})

app.get("/", function (req, res) {
    // res.send({ web: ['freetuts', '.net', 'laptrinh'] }) // Gửi object sẽ tự động chuyển về dạng json
    res.send('<h1>Freetuts</h1>') // Trả về html
    // res.send('normal text') // Trả về text thông thường
})

app.get("/testjson", function (req, res) {
    res.status(302);
    res.json({
        web: ['freetuts', '.net', 'laptrinh']
    })
})

app.get("/redirect", function (req, res) {
    res.redirect('/'); // Có thể dùng cụ thể http://localhost:3000/
    res.end()
})

app.listen(3000);