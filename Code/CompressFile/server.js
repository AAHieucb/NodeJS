var http = require("http");
var fs = require("fs");

var server = http.createServer(function (request, response) {    
    // req là read stream đọc request của client, res là writeStream ghi result
    if (request.url == '/about.html') {
        response.writeHead(200, {
            "Context-type": "text/html"
        });
        fs.createReadStream('./about.html').pipe(response);
    }
    else {
        response.setHeader('Context-type', 'text/plain'); 
        response.setHeader('author', 'thehalfheart@gmail.com');
        response.setHeader('blog', 'freetuts.netsadfafkfjs');
        response.writeHead(404, { // đè setHeader nếu trùng
            "blog": "freetuts.net"
        });
        response.write('404 Not Found ' + request.url);
        response.end();
    }
});

server.listen(3000, function () {
    console.log('Connected Successfull!');
});