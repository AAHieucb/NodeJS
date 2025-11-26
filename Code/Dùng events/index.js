const fs = require("fs");
fs.writeFile('./text.txt', "This", data => {console.log("end")});
fs.writeFileSync('./text.txt', "This");
fs.close(0)

const openVar = fs.promises.open;
let filehandle;
async function testFsPromise(){
    try {
        filehandle = await openVar('text.txt', 'r');
        console.log(filehandle.readFile().then((data) => console.log(data.toString())));
    } finally {
        await filehandle?.close();
    }
}
testFsPromise();

const events = require("events");
const eventEmitter = new events.EventEmitter();
eventEmitter.on('connection', () => console.log('Kết nối sự kiện connection'));
function callback() {
    console.log('Kết nối sự kiện connection 2');
}
eventEmitter.on('connection', callback);
eventEmitter.emit("connection");

eventEmitter.once("addAuthorTitle", function(author, title) { 
    console.log("Added Author and Title " + author + " - " + title);
});
eventEmitter.emit("addAuthorTitle", "Slim Shady", "The real Slim Shady");
eventEmitter.emit("addAuthorTitle", "Slim Shady", "The real Slim Shady"); // Lần 2 k bắt nữa

var data = events.once(eventEmitter, "event2").then((data) => console.log(data));
eventEmitter.emit("event2", 7);

eventEmitter.setMaxListeners(10); // default 
console.log(eventEmitter.getMaxListeners());
console.log(eventEmitter.listeners("connection"));

// Mọi kiểu class đều có thể dùng đc event bằng cách cho nó kế thừa EventEmitter
class MyClass extends events.EventEmitter{ }
var instanceOfClass = new MyClass();
instanceOfClass.on("test",(data) => console.log(data));
instanceOfClass.emit("test", "Fucked");


