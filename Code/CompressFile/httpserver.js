const http = require("http");
const qs = require('querystring');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url === '/' && req.method === 'GET') {
        const formHTML = `
            <form method="POST" action="/">
                <input type="text" name="fullName" placeholder="Full Name"> 
                <input type="number" name="age" placeholder="Age"> 
                <button type="submit">Send</button>
            </form>
            ` 
        res.write(formHTML);
        res.end();
    }
    if (req.url === '/' && req.method === 'POST') {
        let body = "";
        req.on("data", function(data) {
            body += data; // Đọc bằng stream event
        });
        req.on("end", function() {
            let postData = qs.parse(body);
            console.log(postData);
            res.write(`Full Name: ${postData.fullName} <br> Age: ${postData.age}`);
            res.end();
        });
    }
}).listen(3002);
