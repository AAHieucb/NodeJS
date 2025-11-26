const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');

const viewFormUpload = fs.readFileSync('./upload.html')

http.createServer(function (req, res) {
    if (req.url == '/upload' && req.method == 'POST') {

        const options = {
            encoding: "UTF-8", // Default 
        }
        const form = new formidable.IncomingForm(options); 

        var files = [];
        var fields = [];

        // Với mỗi trường từ form nhận được
        form.on('field', function(field, value) {
            fields.push([field, value]);
        })
        // Với mỗi file nhận được
        form.on('file', function(field, file) {
            files.push([field, file]);
            console.log("Z", files[0][1].path);
        })
        // Mỗi lần có form tới thì nếu gửi file sẽ bắt signal file, nếu gửi form text sẽ phát signal field

        form.parse(req, function (err) { 
            console.log("X: ", fields);
            console.log("Y: ", files);
            for(var i = 0; i < files.length; i++) {
                let oldPath = files[i][1].path; // Đường dẫn tạm thời của file khi upload lên sẽ lưu trong cache RAM
                let newPath = __dirname + '/uploads/' + files[i][1].name; // Đường dẫn mới lưu file vào

                console.log("Get from: " + oldPath);
                console.log("Save to: " + newPath);

                // Có thể move bằng cách rename file tạm thời thành đường dẫn file mới với fs: fs.rename(oldPath, newPath, (err) => {}); 
                // Dùng package mv move file k bị hạn chế quyền
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
