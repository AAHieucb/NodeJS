// Đọc file với read stream
const fs = require("fs");
let data = '';
const readerStream = fs.createReadStream('input.txt');
readerStream.setEncoding('UTF8');
readerStream.on('data', function(chunk) {
    console.log("HELELO");
    data += chunk;
});
readerStream.on('end',function(){
    console.log(data)
});
readerStream.on('error', function(err){
    console.log(err.stack);
});

// Viết vào file với write stream
const writtenData = "This is text to write";
const writerStream = fs.createWriteStream('output.txt');
writerStream.write(writtenData);
writerStream.end(); // Viết EOF vào cuối file.
writerStream.on('finish', function() {
    console.log("Write done.");
});
writerStream.on('error', function(err){
    console.log(err.stack);
});

// Piping dữ liệu giữa các stream
let writerStream1 = fs.createWriteStream('output1.txt');
readerStream.pipe(writerStream1);

// Dùng zlib có sẵn để nén với stream
const zlib = require('zlib');
const gzip = zlib.createGzip();
const writeStream1 = fs.createWriteStream('output.zip');
readerStream.pipe(gzip).pipe(writeStream1);

// Dùng dotenv-expand
const myEnv = require('dotenv').config();
console.log(process.env.DB_USERNAME, process.env.DB_PWD);
console.log("1: " + process.env);
require('dotenv-expand').expand(myEnv);
console.log("2: " + process.env);

const dotenv = {
    parsed: {
        BASIC: 'basic',
        BASIC_EXPAND: '${BASIC}',
        BASIC_EXPAND_SIMPLE: '$BASIC'
    }
};
const obj = require('dotenv-expand').expand(dotenv); // Tự thêm vào process.env
console.log(obj);
console.log(process.env);

const dotenv2 = {
    ignoreProcessEnv: true, // chặn thêm vào process.env global, chỉ dùng trong phạm vi object local
    parsed: {
        SHOULD_NOT_EXIST: 'testing'
    }
}
const obj2 = require('dotenv-expand').expand(dotenv2).parsed
console.log(obj2.SHOULD_NOT_EXIST) // testing
console.log(process.env.SHOULD_NOT_EXIST) // undefined


