var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send("Hello world!");
});
app.post('/hello', function (req, res) {
    res.send("Ban vua gui yeu cau bang phuong thuc POST toi dia chi /hello");
});

var userRouters = require('./userRouter');
app.use('/user', userRouters); 

app.get('/admin', function (req, res) { 
    res.send('Admin Page');
});

// Middleware động
app.get('/users/:userId/books/:bookId', function (req, res) { // VD: http://localhost:3000/users/34/books/8989
    res.send(req.params)
})
app.get('/things/:id([0-9]{5})', function (req, res) { 
    res.send('id: ' + req.params.id); // Nó là 1 object lưu các tham số trên url
});
app.get('/ab?cd', function (req, res) { // acd, abcd
    res.send('ab?cd')
})
app.get('/ab+cd', function (req, res) { // abcd, abbcd,..
    res.send('ab+cd')
})
app.get('/ab*cd', function (req, res) { // ab<string bất kỳ>cd
    res.send('ab*cd')
})
app.get('/ab(cd)?e', function (req, res) { // abe, abcde
    res.send('ab(cd)?e')
})
app.get(/a/, function (req, res) { // Chỉ match mỗi a
    res.send('/a/')
})
app.get('/phonenumbers/((09|03|07|08|05)+([0-9]{8}))', function (req, res) {
    res.send(req.params); // Object là các cụm () của regexp
});

app.listen(3000);