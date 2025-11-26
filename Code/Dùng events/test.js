var http = require('http');
var dt = require('./server');

var url = require('url');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var q = url.parse(req.url, true).query; // true là parse thủ công query string thành object
    var txt = q.name + " live in " + q.address + ". Now is " + dt.myDateTime();

    res.end(txt);
}).listen(8080);
