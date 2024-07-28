// Dùng yargs
var yargs = require('yargs');
// var yargs = require('yargs').demand("name"); // Dùng demand là bắt buộc có args trường nào. VD ở đây thì --name là 1 args buộc có
var argv = yargs.argv;
var otherArg = yargs.argv._;
console.log(argv);
console.log(otherArg);
// Các tham số đều đc lưu trong thuộc tính argv:
// $0 là tên file chạy trong lệnh
// Các trường truyền vào bằng --field=value sẽ lấy được thành trường riêng gọi là args
// Các trường truyền tách riêng k có giá trị được lưu trong mảng của _ và gọi là action
// VD: chạy node FirstBasic.js hieu --age=18 IT => IT và hieu là action, age là args

// Check 1 thuộc tính có tồn tại hay k bằng typeof yargs.argv.<key>== "undefined"

// Hàm command của yargs dùng để thiết lập các đối số truyền vào tùy khi gặp action nào.
var testCommand = yargs.command('get', '1 is action name,2 is description,3 is function to setup args passed in',
    (yargs)=>{
        // Dùng demand thì action là bắt buộc, dùng command thì action k bắt buộc có. Mỗi action có nhiều args khác nhau
        // K dùng demand hay command gì hết thì sẽ k có action, mọi thứ truyền vào đều là args chung lấy ra đc hết
        return yargs.options({ // Đối số nào muốn có options thì nhét làm thuộc tính object này
            age: {
                require: true,// = require = demand: là bắt buộc truyền vào, nếu k sẽ xh warning
                type: "number", // k specific type thì mặc định sẽ là boolean true. Có 4 loại: string, array
                alias: 'a', // Định danh alias, có thể truyền vào a mà k cần viết là age(cx sinh thêm attribute tên đó)
                // default: 18, // có cái này thì demand:true thừa
            }
            // Ở đây đã truyền action get thì phải có args --age, nếu không có action get thì là TH bth 
        })
    }
);
console.log(testCommand.argv); // Lấy từ biến lưu giá trị trả về cho kết quả đúng hơn
// Nếu args là 1 ký tự thì chỉ cần - còn nếu là string thì mới dùng --
// Khi dùng action, action sẽ là 1 tp trong mảng _ => tức truyền giá trị chính là truyền các action làm giá trị đó

// Dùng api có thể dùng đến chức năng help. Biến trả về của testCommand or testCommand.help() là 1
// Nếu truyền vào node json.js help thì sẽ bỏ qua mọi code của yargs và truy cập vào phần help của nó
// console.log("COMMAND: ", testCommand);
// console.log("HELP: ", testCommand.help());
console.log("ARGV: ", testCommand.help().argv);



// Dùng node-persist / Dùng yargs 
// Ứng dụng
var vault = require("node-persist");
vault.initSync({
    dir: "eraseFolder/student"
})
function getStudents(){
    var res = vault.getItemSync('students');
    if(typeof res == "undefined")
        return [];
    return res;
    // Chú ý k đc kiểm tra == undefined luôn mà phải dùng typeof == 'undefined' để so sánh string
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
    vault.setItemSync("students", students); // Mỗi thao tác là 1 lần set lại chứ k update add thêm
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
if(appArgv._[0] == "list"){ // in ra là biết 
    showAll();
}else if(appArgv._[0] == "clear"){
    vault.clearSync();
}else if(appArgv._[0] == "add"){
    addAStudent(appArgv.id, appArgv.name);
}else if(appArgv._[0] == "delete"){
    deleteStudent(appArgv.id);
}else if(appArgv._[0] == "edit"){
    editStudent(appArgv.id, appArgv.name);
}
// Nó kiểu chia ra ý. VD: node FirstBasic.js delete --id=<> thì dùng nhiều action kết hợp, xong mỗi action có nhiều args trong 1 câu lệnh tuỳ ý chỉnh sửa



// Dùng crypto-js
var crypto = require("crypto-js");
var message = crypto.AES.encrypt("Content to encrypt", "1801");
// console.log("Encrypted: ", message); // object lớn
console.log("Encrypted String: ", message.toString());
var bytes = crypto.AES.decrypt(message, "1801");
console.log("Decrypted: ", bytes);
console.log("Decrypted String: ", bytes.toString(crypto.enc.Utf8));
// encrypt và decrypt nó trả ra object to vl nhưng ta có thể convert nó về string cơ bản nv
// CryptoJS.lib.CipherParams nhận vào 1 formatter, còn decrypt xong dùng của CryptoJS.lib.WordArray nhận 1 encoder
// crypto.enc.Utf8 trả ra encoder UTF-8
// Thư viện này còn vô số cách mã hóa khác chưa dùng tới


// Dùng buffer
var buf1 = Buffer.from("This is a test", "hex"); // Sai kiểu encode, k hiện
console.log(buf1);
buf1 = Buffer.from("This is a test", "UTF-8"); // Hợp lệ text thì phải là utf-8 
// => Dữ liệu này sẽ được lưu trong buffer dưới dạng mảng các số nguyên(encode ký tự sang số unicode rồi)
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex'); // Đối số 2 ý bảo là 1 đc encode theo hex rồi
console.log(buf2);
console.log(buf1);

// alloc giúp khai báo bao nhiêu ô nhớ
const buf3 = Buffer.alloc(11,'aGVsbG8gd29ybGQ=','base64'); 
// 2 là fill default cái gì(string/buffer/integer), 3 chỉ đối số 2 đã là kiểu encoded base64. 3 default là utf8.
// Giống allocUnsafe(<size>) tạo buffer có kích thước size và các giá trị theo địa chỉ của nó, còn alloc(<size>) gán tất cả là default toàn 0 => nên dùng full alloc
console.log(buf3);

const buf4 = Buffer.from([100, 50, 100, 200, 255]); 
// Array từ 0-255 biểu diễn ký tự vì buffer lưu ký tự, k lưu kiểu bth có thể coi dữ liệu sau khi vào buffer là 1 dạng encode thành số k thể đọc bth đc
console.log(buf4);
console.log(buf4.toString()); // Các số trong mảng chuyển thành ký tự theo thứ tự r in ra
const buf5 = Buffer.alloc(11); // Sau đó nếu dùng nhiều hơn alloc sẽ lỗi 
var size = buf5.write("Test", 0, 4, "utf-8"); 
// 2 mặc định là 0, 3 mặc định là size of buffer, 4 default là utf-8, tức ghi vào buffer cái gì từ vị trí nào và bao nhiêu phần tử được ghi
buf5.write("Hello", 2, 2);
console.log(size + " " + buf5);
console.log(buf5.toString("utf-8", 2, 4)); // Chỉ lấy phần tử từ 2 đến 4

// Kiểu Uint16Array tạo mảng int 16 bit nhưng cung thêm các thao tác với từng byte như attribute buffer
const arr = new Uint16Array(3);
arr[0] = 5000;
arr[1] = 4000;
console.log(arr.buffer);
let buf9 = Buffer.from(arr.buffer, 0, 4); // Shared memory with Uint16Array, lấy ra thành biến buffer
console.log(buf9);
arr[2] = 100; // Sửa array ảnh hưởng đến buffer của nó
console.log(arr.buffer);
// Tương tự cũng có các kiểu Uint32Array, Float32Array, Float64Array nhưng ít dùng
// from thì buộc khai báo từ 1 cái khác(chuỗi ký tự or 1 buffer khác, mảng số), 2 là lấy từ index nào, 3 là bao nhiêu ptu

// Các operator của buffer
var buf6 = Buffer.from("hello "); // Sẽ tự khai báo buffer kích thước fit nội dung, cx chỉ là 1 cách khởi tạo TT thôi
var buf7 = Buffer.from("world"); // Ta có thể lấy data buffer từ bất cứ đâu
var buf8 = Buffer.concat([buf6, buf7]);
console.log(buf8.toString());

console.log(buf6.compare(buf7));
console.log(buf6.length);
console.log(buf6.copy(buf7));
console.log(buf6.equals(buf7));
console.log(buf6.fill("Hi")); // Đổi trực tiếp chứ kp chỉ return đâu
buf6 = Buffer.from(buf7); // Copy hết nhé
console.log(buf6);

buf6.write("1"); // Chỉ đổi phần tử đầu tiên của buf6 thành 1 thôi
console.log(buf6.indexOf("1")); // Chú ý nó chỉ chơi với string, write dạng số 1 vào k ra đâu, index cx v

console.log(Buffer.isBuffer(buf6));
console.log(Buffer.isEncoding(buf6)); // Có hỗ trợ kiểu encoding của buffer này thì là true



// # Event loop của NodeJS
var immediateID = setImmediate(() => console.log("Set immediate"));
clearImmediate(immediateID);
// Hàm của setImmediate sẽ chạy ngay, nhưng gần như song song với bên dưới gặp clear nên dừng luôn vì nó async



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
eventEmitter.on('connection', connectHandler); // Tạo sự kiện
eventEmitter.on('connection', connectHandler2); // on y hệt addEventListener, thêm 1 call back vào cuối event
eventEmitter.on('data_received', function(){  
    console.log('Kết nối sự kiện data_received.');  
});  
eventEmitter.emit('connection');
// Ngoài ra: once giải quyết chỉ muốn gọi 1 lần khi sự kiện xảy ra sau đó bị loại bỏ khỏi list hàm của event.
// removeListener, removeAllListeners(<event>)
// setMaxListeners(n) số lượng listener > 10 sẽ cảnh báo. Giúp khắc phục lỗi memory leak khi 1 sự kiện lại làm quá nhiều thứ -> đặt là 0 nếu muốn vô hạn
// listeners(event) trả ra mảng các listener
// Hàm emit(<event>,[args]) có nhiều listener cùng lắng nghe 1 event thì sẽ thực hiện lần lượt với [args] truyền vào. Nó tự căn chỉnh nếu listener thiếu args thì bỏ các args truyền vào thừa đi. Tất cả các args đó sẽ truyền lần lượt vào từng listener

const streamFile = require("fs");
var eventFile = streamFile.createReadStream("./test.txt");
eventFile.on('open', function() {
    console.log('File opened!');
});
// createReadStream tạo ra 1 luồng read, luồng ở đây cũng chính là 1 biến event emitter. Ở đây nó nó thực hiện luôn callback của sự kiện open vì nó ngầm emit sự kiện open khi gọi createReadStream đọc file r
