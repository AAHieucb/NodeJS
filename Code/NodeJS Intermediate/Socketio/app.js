// # Dùng socketio
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http); // Phải nối cả 3 cái như này để dùng socketio

app.get('/', function (req, res) { 
    res.sendFile(__dirname + '/views/index.html');
});

// Dùng app như server bth chỉ là có thêm socketio qua on thôi
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit("information", { name: "Nguyen Van A", age: 19 });
}); 
// Khi này, bất cứ khi nào có connection client vào thì server sẽ chạy hàm console bên trên.
// Gọi emit phát ra event tên là information và socket client sẽ bắt và nhận về data là object trên

http.listen(3000, function () {
    console.log('listening on port 3000');
});