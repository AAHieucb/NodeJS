var fs = require('fs');
fs.readFile("test-file.txt", function() {
    setTimeout(function(){
        console.log("SETTIMEOUT1");
    });
    setImmediate(function(){ // IO/callback luôn thực hiện immediate trước
        console.log("SETIMMEDIATE1");
    });
});

// May rủi 1 trong 2 thực hiẹn trước
setTimeout(function(){
    console.log("SETTIMEOUT2");
});
setImmediate(function(){
    console.log("SETIMMEDIATE2");
});