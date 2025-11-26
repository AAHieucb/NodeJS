const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require("path");
const PORT = 3443;
const app = express();

// Cản CSRF với CSRK token
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })
app.use(cookieParser());
app.get('/form', csrfProtection, function (req, res) {
    res.render('send', { csrfToken: req.csrfToken() });
})
app.post('/process', csrfProtection, function (req, res) {
    res.send('data is being processed');
})
/* 
GET thì send csrfToken đi trong cookie, POST lấy về check khớp mới pass
VD FE: <form action="/process" method="POST">
    <input type="hidden" name="_csrf" value="{{csrfToken}}">
    Favorite color: <input type="text" name="favoriteColor">
    <button type="submit">Submit</button>
</form> 
*/

// Dùng xss-filters
const xssFilters = require('xss-filters');
console.log(xssFilters("&lt;"));
app.get('/', (req, res) => {
    let firstname = req.query.firstname; // an untrusted input
    res.send('<h1> Hello, '
        + xssFilters.inHTMLData(firstname)
        + '!</h1>');
});
app.listen(3000);

// TLS SSL httpserver có sẵn
app.use("/", (req,res) => {
    res.send("Hello");
})
https.createServer({
    key: fs.readFileSync(path.join(__dirname + '/key.pem')),
    cert: fs.readFileSync(path.join(__dirname + '/cert.pem')),
    passphrase: "hieucuopbien123"
}, app).listen(PORT, () => {console.log("Hello")});

if (NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') { // vào http tự sang https
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}
