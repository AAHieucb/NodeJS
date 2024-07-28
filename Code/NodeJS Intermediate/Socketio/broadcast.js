var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {    
    res.sendFile(__dirname + "/views/broadcast.html");
});

// Mỗi 1 client mới xuất hiện là 1 socket client mới đc tạo ra. Socket trong function dưới là của 1 client, như là 1 eventEmitter bth và hàm emit sẽ chỉ có mình nó nhận được
// Nhưng đb là tất cả socket client bắt mọi sự kiện từ socket server. Socket của server là io
var clients = 0;
io.on("connection", function (socket) {
    clients++;
    socket.emit("new msg", {
        msg: `Hiện tại có ${clients} đang kết nối !!`
    });
    socket.broadcast.emit("new noti", { // Gửi cho tất cả client khác trừ người gửi
        msg: "Một người vừa mới tham gia ! "
    });
    socket.on("disconnect", function () { // Signal có sẵn là disconnect, thao tác trước khi tắt
        clients--;
        socket.broadcast.emit("new noti", {
            msg: "Một người vừa mới rời đi! "
        });
    });
});

http.listen(3000, function () {
    console.log("listening on *:3000");
});