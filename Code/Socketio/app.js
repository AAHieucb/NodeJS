var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) { 
    res.sendFile(__dirname + '/views/index.html');
});

// Dùng server bth nhưng có thêm socketio
io.on('connection', function (socket) { // Cứ có client connect vào là chạy
    console.log('a user connected');
    socket.emit("information", { name: "Nguyen Van A", age: 19 }); // socket client sẽ bắt và nhận object
}); 

http.listen(3000, function () {
    console.log('listening on port 3000');
});