var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/room.html");
});

var freetuts = io.of("/freetuts"); // Khởi tạo namespace tên "/freetuts", io default dùng namespace mặc định "/"

// Còn có thể tạo nhiều namespace và trong namespace có nhiều phòng
freetuts.on("connection", function (socket) {
    console.log("Một người vừa kết nối.");
    socket.on("join room", function (data) {
        socket.join("freetutsRoom"); // join vào 1 phòng

        // Phát cho chính người vào phòng
        socket.emit("notification", "Bạn đã tham gia vào phòng");

        // Phát thông báo cho tất cả mn trong phòng
        freetuts.to("freetutsRoom").emit("notification", "Một người đã vào phòng.");
    });

    socket.on("leave room", function (data) {
        socket.leave("freetutsRoom");
        socket.emit("notification", "Bạn đã rời phòng");
        freetuts.to("freetutsRoom").emit("notification", "Một người đã rời phòng.");
    });
});

http.listen(3000, function () {
    console.log("listening on *:3000");
});