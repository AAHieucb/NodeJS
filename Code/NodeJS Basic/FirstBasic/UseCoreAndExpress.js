var express = require('express');
var cors = require('cors');
var app = express();

// Dùng cors
// Ta chỉ cho phép ng ta lấy thông tin cors ở 1 đường dẫn bất kỳ thì dùng như này:
// app.get('/products/:id', cors(), function (req, res, next) {
//     res.json({
//         msg: 'This is CORS-enabled for a Single Route'
//     })
// })

/* Tổng quát dùng nhiều domain */
var whitelist = ['', 'https://example2.com']
var corsOptions2 = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            // Dùng !origin sẽ cho phép các origin undefined truy cập, VD vào web bằng browser bình thường tức ta k gọi từ 1 website khác thì origin là undefined đó
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS nha'))
        }
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
} 
// corsOptions sẽ có 2 attribute: 
// 1 là origin: link tới web or 1 function(origin, callback) và gọi hàm callback như trên
// 2 là optionsSuccessStatus trả ra status success.

// Dùng cors thêm ở từng route
app.get('/products/:id', cors(corsOptions2), function (req, res, next) {
    res.json({
        msg: 'This is CORS-enabled '
    })
})

app.listen(3000, function () {
    console.log('web server listening on port 3000')
})