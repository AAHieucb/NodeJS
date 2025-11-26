const express = require("express");
const app = express();

// Dùng morgan compression clear

const morgan = require("morgan");
const compression = require("compression");

var clear = require('clear');

app.use(compression({
    level: 6,
    threshold: 100 *1000,
    filter: (req, res) => {
        if(req.headers['x-no-compress']){
            return false;
        }
        return compression.filter(req, res);
    }
}))

app.use(
    morgan(
        ":method :url :status :response-time ms"
    )
)

app.get("/", function(req, res) {
    clear();
    setTimeout(function() {
        res.send("hello, world!".repeat(10000)); // Cho lớn để package compression nén
    }, 1000)
})
app.listen(8080);