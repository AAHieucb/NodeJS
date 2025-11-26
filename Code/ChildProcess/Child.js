console.log('In Child.js');
if(process.send) {
    process.send("Hello, this is child process.");
    setTimeout((function() {
        return process.send("This was send after 1 second.");
    }), 1000);
    setTimeout((function() {
        return process.send("This was send after 2 seconds.");
    }), 2000);
    setTimeout((function() {
        return process.send("This was send after 3 seconds.");
    }), 3000); 
}
// Dùng fork sẽ thiết lập kênh IPC (Inter-process communication), rồi dùng process.send để gửi từ process con sang cha, là TH đặc biệt của spawn.