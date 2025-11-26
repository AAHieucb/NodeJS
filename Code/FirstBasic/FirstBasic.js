// Dùng yargs
var yargs = require('yargs');
// var yargs = require('yargs').demand("name"); // Dùng demand tức --name là 1 arg bắt buộc
var argv = yargs.argv;
var otherArg = yargs.argv._;
console.log(argv);
console.log(otherArg);

// VD argv khi chạy: node FirstBasic.js hieu --age=18 IT
// $0 là tên file
// --field=value lấy từ args
// _ là mảng lưu các trường truyền tách riêng
// IT và hieu là các actions

// Hàm command của yargs dùng để thiết lập các đối số truyền vào tùy khi gặp action nào.
var testCommand = yargs.command('get', '1 is action name,2 is description,3 is function to setup args passed in',
    (yargs) => {
        // Dùng demand thì action là bắt buộc, dùng command thì action k bắt buộc có
        return yargs.options({
            age: {
                require: true, // tương đương demand là bắt buộc, k có sẽ xh warning
                type: "number", // k specific type thì mặc định là boolean, có 4 loại: string, array
                alias: 'a', // alias
                default: 18, // Có cái này thì demand:true thừa
            }
        })
    }
);
console.log(testCommand.argv);
// Có chức năng help. Nếu truyền vào node json.js help thì sẽ bỏ qua mọi code của yargs và truy cập vào phần help của nó
console.log("ARGV: ", testCommand.help().argv);

// Dùng node-persist tạo local store
var vault = require("node-persist");
vault.initSync({
    dir: "eraseFolder/student"
})
function getStudents(){
    var res = vault.getItemSync('students');
    if(typeof res == "undefined")
        return [];
    return res;
}
function getStudentViaID(studentID){
    var students = getStudents();
    var res = null;
    for(var i = 0; i < students.length; i++)
    {
        if(students[i].id == studentID)
        {
            res = students[i];
            break;
        }
    }
    return res;
}
function addAStudent(id, name)
{
    var students = getStudents();
    students.push({
        id: id,
        name: name
    })
    vault.setItemSync("students", students);
}
function deleteStudent(id)
{
    var students = getStudents();
    for(var i = 0; i < students.length; i++)
    {
        if(students[i].id == id)
        {
            students.splice(i,1);
        }
    }
    vault.setItemSync("students", students);
}
function editStudent(id, name)
{
    var students = getStudents();
    for(var i = 0; i < students.length; i++)
    {
        if(students[i].id == id)
        {
            students[i].name = name;
        }
    }
    vault.setItemSync("students", students);
}
function showAll()
{
    var students = getStudents();
    for(var i = 0; i < students.length; i++)
    {
        console.log(students[i].id, " ", students[i].name);
    }
}
var yargs = require("yargs");
var appArgv = yargs.command("list","Get list", function(yargs){})
                    .command("edit","Edit",(yargs) => {
                                return yargs.options({
                                    id: {
                                        type: "number",
                                        demand: true
                                    },
                                    name: {
                                        type: "string",
                                        demand: true
                                    }
                                })
                            })
                    .command("delete", "Delete", (yargs) => {
                                return yargs.options({
                                    id: {
                                        type: "number",
                                        demand: true
                                    }
                                })
                            })
                    .command("add","Add",(yargs) => {
                                return yargs.options({
                                    id: {
                                        type: "number",
                                        demand: true
                                    },
                                    name: {
                                        type: "string",
                                        demand: true
                                    }
                                })
                            })
                    .command("clear","Clear", (yargs) => {}).argv;
if(appArgv._[0] == "list"){ 
    showAll();
}else if(appArgv._[0] == "clear"){
    vault.clearSync();
}else if(appArgv._[0] == "add"){
    addAStudent(appArgv.id, appArgv.name);
}else if(appArgv._[0] == "delete"){
    // VD node FirstBasic.js delete --id=<> có thể dùng nhiều action kết hợp, mỗi action có nhiều args
    deleteStudent(appArgv.id);
}else if(appArgv._[0] == "edit"){
    editStudent(appArgv.id, appArgv.name);
}

// Dùng crypto-js có vô số kiểu mã hoá
var crypto = require("crypto-js");
var message = crypto.AES.encrypt("Content to encrypt", "1801");
console.log("Encrypted String: ", message.toString());
var bytes = crypto.AES.decrypt(message, "1801");
console.log("Decrypted: ", bytes);
console.log("Decrypted String: ", bytes.toString(crypto.enc.Utf8));

// Dùng buffer
var buf1 = Buffer.from("This is a test", "hex"); // Sai kiểu encode, k hiện
console.log(buf1);
buf1 = Buffer.from("This is a test", "UTF-8"); // Hợp lệ, encode sang số unicode và lưu vào buffer
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');
console.log(buf2);
console.log(buf1);

const buf3 = Buffer.alloc(11,'aGVsbG8gd29ybGQ=','base64'); // alloc giúp khai báo bao nhiêu ô nhớ, thay thế allocUnsafe
// 2 là fill default, 3 là kiểu encode của tham số 2, default 3 là utf8
console.log(buf3);

const buf4 = Buffer.from([100, 50, 100, 200, 255]);
console.log(buf4);
console.log(buf4.toString()); // Mỗi số 0-255 là 1 ký tự, toString sẽ convert sang ký tự rồi in ra
const buf5 = Buffer.alloc(11);
var size = buf5.write("Test", 0, 4, "utf-8"); // 2 default là 0 là vị trí bắt đầu ghi, 3 là size of buffer
buf5.write("Hello", 2, 2);
console.log(size + " " + buf5);
console.log(buf5.toString("utf-8", 2, 4)); // Lấy phần tử từ 2 đến 4

// Uint16Array tạo mảng int 16 bit có cung thêm các thao tác với từng byte. Tương tự Uint32Array, Float32Array, Float64Array ít dùng
const arr = new Uint16Array(3);
arr[0] = 5000;
arr[1] = 4000;
console.log(arr.buffer);
let buf9 = Buffer.from(arr.buffer, 0, 4); // Tạo buffer từ array buffer, 2 là index bắt đầu, 3 là lấy bao nhiêu phần tử
console.log(buf9);
arr[2] = 100; // Sửa array ảnh hưởng buffer
console.log(arr.buffer);

var buf6 = Buffer.from("hello "); // Kích thước buffer fit nội dung
var buf7 = Buffer.from("world");
var buf8 = Buffer.concat([buf6, buf7]);
console.log(buf8.toString());

console.log(buf6.compare(buf7));
console.log(buf6.length);
console.log(buf6.copy(buf7));
console.log(buf6.equals(buf7));
console.log(buf6.fill("Hi"));
buf6 = Buffer.from(buf7);
console.log(buf6);

buf6.write("1"); // Chỉ đổi phần tử đầu của buf6 thành 1
console.log(buf6.indexOf("1"));

console.log(Buffer.isBuffer(buf6));
console.log(Buffer.isEncoding(buf6));

var immediateID = setImmediate(() => console.log("Set immediate")); // setImmediate chạy async ngay nên gặp clearImmediate phát dừng luôn
clearImmediate(immediateID);

// Dùng events
const events = require('events');
// require('events').EventEmitter.defaultMaxListeners = 15; // nếu muốn setDefault cho mọi event
const eventEmitter = new events.EventEmitter(); // Tạo emitter
const connectHandler = function connected() {  
    console.log('Kết nối sự kiện connection.'); 
    eventEmitter.emit('data_received');  
}
const connectHandler2 = function connected() {  
    console.log('Kết nối sự kiện connection 2.'); 
}
eventEmitter.on('connection', connectHandler);
eventEmitter.on('connection', connectHandler2);
eventEmitter.on('data_received', function(){  
    console.log('Kết nối sự kiện data_received.');  
});  
eventEmitter.emit('connection');
// Còn có once, removeAllListeners(<event>), listeners(event) trả ra mảng các listener
// setMaxListeners(n) tránh memory leak, để 0 thì vô hạn

const streamFile = require("fs");
var eventFile = streamFile.createReadStream("./test.txt");
eventFile.on('open', function() { // Tạo stream đọc file thì phát "open" event luôn r
    console.log('File opened!');
});
