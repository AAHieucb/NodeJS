const express = require('express');
const app = express();

// Dùng cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser({
    "Name": "Hieu"
}));
// cookieParser(secret, options); 1 là secret để sign cookie. 2 là options object thêm vào cookieParse.

app.get('/cookie', function (req, res) {
    res.cookie('name', 'freetuts.net', {
        expires: new Date(Date.now() + 900000)
    });
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('authorNe', 'thehalfheart@gmail.com'); // Gửi thêm thông tin k cần thiết vào header đc
    res.setHeader('blog', 'freetuts.netsadfafkfjs');
    res.send("success");
    // res.redirect(404, "/getCookie"); // Ttrang web sẽ hiện hỏi có muốn chuyển sang getCookie k
    // Hàm res.write và res.send khác gì nhau: send là send cả cục dữ liệu, write là stream write vào từng chunk nối tiếp nhau
    // Hàm redirect sẽ chuyển hướng gửi 1 req get tới url nào, nó đồng nghĩa với vc thực hiện 1 req mới. Nên nhớ mỗi req đều có 1 res và mỗi req và res đều có 1 header.
    // 1 request chỉ có 1 response, k thể send xong r redirect tiếp được
});
// res.cookie(name, value, [options]) với options là 1 object có:
// domain(string domain của cookie), encode(function), expires(Date thời gian cookie hết hạn, k set or bằng 0 thì nó tạo ra session cookie tạm thời trong bộ nhớ và tự xóa khi hết phiên), httpOnly(bool), maxAge (number thời gian cookie hết hạn so với thời điểm đặt tính bằng ms), path(string mặc định là "/"), secure(bool) đánh dấu cookie chỉ dùng được ở https, signed(bool) đánh dấu cookie nên được signed, sameSite(bool/string) là sameSite của thuộc tính set cookie

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