const fs = require("fs")
const data = fs.watch("child-process.js", (eventType, filename) => {
    console.log("\nThe file ", filename, " was modified!");
    console.log("The type of change was: ", eventType);
});
console.log(data);

// spawn và exec của child_process giúp tạo subprocess
const {
    spawn, exec, fork
} = require("child_process")

// spawn chạy 1 chương trình nodejs trả ra 1 streaming interface có thể truy cập vào stdout/in/err
const testSpawn = spawn("node", ["support.js"]);
testSpawn.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`); // Nếu chạy được có kết quả in ra thì bắt nó và hiện ra stdout
});
testSpawn.stderr.on('data', (data) => {
    console.error(`STDERR: ${data}`);
});
testSpawn.on('error', (error) => {
    console.error(`error: ${error.message}`);
});
testSpawn.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});

// exec mở 1 subshell và chạy lệnh gì trên subshell đó ở 1 process riêng.
const ls = exec('pwd', function (error, stdout, stderr) {
    if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
    }
    console.log('Child Process STDOUT: '+stdout);
    console.log('Child Process STDERR: '+stderr);
});
ls.on('exit', function (code) {
    console.log('Child process exited with exit code '+code);
});

// éxecFile execute external app và thành công thì trả ra buffer.
const execFile = require('child_process').execFile;
execFile('pwd', ['--version'], (error, stdout, stderr) => { 
    if (error) {
        console.error('stderr', stderr);
        throw error;
    }
    console.log('stdout', stdout);
});