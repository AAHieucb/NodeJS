// Dùng events

// Readable Stream đọc từ file
const fs = require("fs");
let data = '';
const readerStream = fs.createReadStream('input.txt'); // Đọc file bằng streams với createReadStream
readerStream.setEncoding('UTF8'); // Mặc định mã hóa dùng trong file cũng là UTF8, có thể set nhiều thuộc tính khác
readerStream.on('data', function(chunk) { // Sự kiện khi đọc data, nhận vào từng chunk
    console.log("HELELO");
    data += chunk;
    // Cứ được 1 phần dữ liệu thì xử lý xong lại xử lý tiếp, nó tự tách ra 1 cách tự động từng chunk 1 như v
    // thích hợp cho vc đọc file lớn vài GB
});
readerStream.on('end',function(){ // Khi kết thúc đọc data thì in ra
    console.log(data) // chỉ dùng được content biến data này trong stream
});
readerStream.on('error', function(err){ // Khi xảy ra lỗi in ra lỗi
    console.log(err.stack);
});

// Writeable stream
const writtenData = "This is text to write";
const writerStream = fs.createWriteStream('output.txt');
writerStream.write(writtenData);
writerStream.end(); // đánh dấu đây là cuối file, tức viết thêm vào ký tự EOF và k thể viết thêm vào sau, k có vẫn đc.
writerStream.on('finish', function() {
    console.log("Write done.");
});
writerStream.on('error', function(err){
    console.log(err.stack);
});
// Nếu ta cứ đọc và ghi file như v thì file lớn mấy cx đọc được

// Piping chuyển dữ liệu giữa các stream
let writerStream1 = fs.createWriteStream('output1.txt');
readerStream.pipe(writerStream1); // Đầu ra của readerStream làm giá trị đầu vào của writerStream



// Dùng zlib
const zlib = require('zlib'); // Có sẵn trong nodejs
const gzip = zlib.createGzip(); // Phương thức có nhiệm vụ nén file, nó là 1 stream
const writeStream1 = fs.createWriteStream('output.zip');
readerStream.pipe(gzip).pipe(writeStream1); 
// Ở đây pipe cái readstream vào cái gzip là 1 stream lưu dữ liệu gzip nén, lại pipe lưu dữ liệu của nó cho 1 stream write để ghi vào file
// Đặt tên file zip sẽ ảnh hưởng kết quả khi giải nén. Đặt là output.txt.gz giải nén sẽ ra output.txt nhưng đặt là output.zip thì giải nén chỉ ra output thôi



// # Dùng dotenv dotenv-expand
const myEnv = require('dotenv').config();
console.log(process.env.DB_USERNAME, process.env.DB_PWD);
console.log("1: " + process.env); // DB_PASS sai
require('dotenv-expand').expand(myEnv);
console.log("2: " + process.env); // DB_PASS thành đúng

// Thêm biến môi trường dạng object vào biến MT global process.env 
const dotenv = {
    parsed: {
        BASIC: 'basic',
        BASIC_EXPAND: '${BASIC}',
        BASIC_EXPAND_SIMPLE: '$BASIC' // thế nào cũng được
    }
};
const obj = require('dotenv-expand').expand(dotenv); // Tự thêm vào process.env luôn
console.log(obj);
console.log(process.env);

// Hoặc ta chỉ muốn tái sử dụng trong phạm vi object local mà k thêm vào biến MT ok
const dotenv2 = {
    ignoreProcessEnv: true, // chặn thêm vào process.env global
    parsed: {
        SHOULD_NOT_EXIST: 'testing'
    }
}
const obj2 = require('dotenv-expand').expand(dotenv2).parsed
console.log(obj2.SHOULD_NOT_EXIST) // testing
console.log(process.env.SHOULD_NOT_EXIST) // undefined


