var http = require("http");
var fs = require("fs");

var server = http.createServer(function (request, response) {    
    // req là read stream đọc từ request của client, res vẫn là writeStream ghi vào client 
    if (request.url == '/about.html') {
        response.writeHead(200, {
            "Context-type": "text/html"
        });
        fs.createReadStream('./about.html').pipe(response);
    }
    else {
        response.setHeader('Context-type', 'text/plain'); 
        // setHeader và writeHead tương tự nhau và writeHead sẽ đè lên setHeader nếu trùng. 
        response.setHeader('author', 'thehalfheart@gmail.com');
        response.setHeader('blog', 'freetuts.netsadfafkfjs'); // bị đè
        response.writeHead(404, {
            "blog": "freetuts.net" // Mấy cái thêm vao sau k thấy xuất hiện
        });
        response.write('404 Not Found ' + request.url);
        response.end();
    }
});

server.listen(3000, function () {
    console.log('Connected Successfull!');
});