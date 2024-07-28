var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/chat.html");
});

io.on("connection", function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});
// => Quanh quẩn io.on/emit và socket.on/emit mà thôi.

// Mỗi client kết nối vào server sẽ có 1 cái socket đính vào nó và socket đó chính là tham số của hàm là đối số 2.
// Ở client ta chỉ có thể cho socket on or emit cái gì. Ở server ta dùng io để on/emit cho mọi client bắt. Bên cạnh io của server thì socket trong tham số của callback chính là socket của riêng 1 cái client gửi đến. Bên trên socket là ta tương tác với 1 client đó mà thôi

http.listen(3000, function () {
    console.log("listening on *:3000");
});