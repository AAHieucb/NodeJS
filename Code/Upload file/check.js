var fs = require("fs");
fs.rename(".\\up.html",".\\upload.html", (err) => {
    console.log(err);
});
console.log("CHECK");