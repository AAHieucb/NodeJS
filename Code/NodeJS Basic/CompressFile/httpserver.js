// SSR
const http = require("http");
const qs = require('querystring');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    // Nếu người dùng tới trang web lần đầu nó sẽ gửi giao thức GET -> ta cho người dùng nhập thông tin form
    // Khi ng dùng post thì ta hiển thị cái khác ra thay thế cho cái form 
    if (req.url === '/' && req.method === 'GET') {
        const formHTML = `
            <form method="POST" action="/">
                <input type="text" name="fullName" placeholder="Full Name"> 
                <input type="number" name="age" placeholder="Age"> 
                <button type="submit">Send</button>
            </form>
            ` 
        res.write(formHTML); // Server gửi html cho client. Nó tự tạo body và thêm phần html này vào
        res.end();
    }

    if (req.url === '/' && req.method === 'POST') {
        let body = "";
        req.on("data", function(data) {
            body += data; // Dùng event để đọc dữ liệu kiểu stream khi request có 1 lượng lớn data
        });
        req.on("end", function() {
            let postData = qs.parse(body);
            console.log(postData);
            res.write(`Full Name: ${postData.fullName} <br>
                Age: ${postData.age}`); // Chỉ gửi được string đi, nếu kp là html mà chỉ muốn gửi 1 dữ liệu object(dạng string) thì client phải xử lý điều đó
            res.end();
        });
    }
}).listen(3002);
