var http = require('http');
var dt = require('./server');

var url = require('url');

// Dùng url
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    // Cách lấy data query ez nhất
    var q = url.parse(req.url, true).query; // true là chơi parse query string thành object.
    var txt = q.name + " live in " + q.address + ". Now is " + dt.myDateTime();

    res.end(txt);
}).listen(8080);

// VD vào: http://localhost:8080/?name=tam&address=DN