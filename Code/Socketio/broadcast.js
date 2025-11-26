var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {    
    res.sendFile(__dirname + "/views/broadcast.html");
});

var clients = 0;
io.on("connection", function (socket) {
    // socket này là của 1 client, hàm emit được gọi sẽ chỉ mình nó phía client nhận được. io là socket của server
    clients++;
    socket.emit("new msg", {
        msg: `Hiện tại có ${clients} đang kết nối !!`
    });
    socket.broadcast.emit("new noti", { // Socket client này gửi cho tất cả client khác trừ chính người gửi
        msg: "Một người vừa mới tham gia ! "
    });
    socket.on("disconnect", function () { // Thao tác trước khi tắt
        clients--;
        socket.broadcast.emit("new noti", {
            msg: "Một người vừa mới rời đi! "
        });
    });
});

http.listen(3000, function () {
    console.log("listening on *:3000");
});