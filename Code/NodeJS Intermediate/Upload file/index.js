const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');

const viewFormUpload = fs.readFileSync('./upload.html')

// Dùng formidable mv
http.createServer(function (req, res) {
    if (req.url == '/upload' && req.method == 'POST') {

        const options = {
            encoding: "UTF-8", // Default => mấy cái options khác éo chạy
        }
        const form = new formidable.IncomingForm(options); // Khởi tạo form

        var files = [];
        var fields = [];

        // Với mỗi trường bình thường từ form nhận được
        form.on('field', function(field, value) {
            fields.push([field, value]);
        })
        // Với mỗi file nhận được
        form.on('file', function(field, file) {
            files.push([field, file]); // file ở đây là mảng 1 phần tử là 1 object phức tạp
            console.log("Z", files[0][1].path);
        })
        // Đây là cách bắt multiple files, mỗi lần có form tới thì nếu gửi file sẽ bắt signal file, nếu là form text bth sẽ phát signal field

        // Sau khi nhận được nội dung của form xong thì parse form
        form.parse(req, function (err) { 
            console.log("X: ", fields);
            console.log("Y: ", files);
            for(var i = 0; i < files.length; i++) {
                // Lấy đường dẫn tạm thời của file khi upload lên đây sẽ lưu trong bộ nhớ cache là RAM ở ổ C
                let oldPath = files[i][1].path; 
                // Lấy đường dẫn mới sẽ lưu file này vào
                let newPath = __dirname + '/uploads/' + files[i][1].name; // __dirname là đường dẫn thư mục hiện tại

                console.log("Get from: " + oldPath);
                console.log("Save to: " + newPath);

                // Tiến hành move bằng cách rename file tạm thời thành đường dẫn file mới với fs: fs.rename(oldPath, newPath, (err) => {}); 
                // Có thể xóa file async với: fs.unlink(link to file, callback);
                // Bị lỗi k truy cập đc vào 1 vài file trong ổ C, đặc biệt là các file ở vùng đệm vì bị hạn chế bởi quyền => package mv giải quyết vấn đề đó
                mv(oldPath, newPath, function (err) {
                    if (err) return res.end(err)
                })
            }
            return res.end('<h1 style="color: green;">Upload success !</h1>')
        })

    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        return res.end(viewFormUpload);
    }
}).listen(6969);
