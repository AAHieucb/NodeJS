const express = require("express")
const app = express();
const rateLimit = require('express-rate-limit');
const Joi = require("joi");
const status = require('http-status');
var jwt = require('jsonwebtoken');
var timeout = require("connect-timeout");

// Dùng connect-timeout sẽ forward biến timedout vào req. Timeout thì dừng lại nhưng các thao tác đã thực hiện k tự bị revert.
// app.use(timeout("5s"));
app.post('/save', timeout('5s'), haltOnTimedout, function (req, res, next) {
    savePost(req.body, function (err, id) {
        if (err) return next(err)
        if (req.timedout) return;
        res.send('saved as id ' + id)
    })
})
function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
}
function savePost (post, cb) {
    setTimeout(function () {
      cb(null, ((Math.random() * 40000) >>> 0))
    }, (Math.random() * 7000) >>> 0)
}

var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
console.log(token);
jwt.verify(token, 'shhhhh', function(err, decoded) {
    console.log(decoded.foo)
});
console.log(jwt.verify(token, 'shhhhh'));

// Dùng jsonwebtoken kết hợp passport, passport-jwt là 1 strategy của passport
// passport như 1 middleware xử lý sẵn các công đoạn authen
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require("passport-jwt");
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'), // fromAuthHeaderAsBearerToken là request phải có header "Authorization" value là "Bearer <token>"
    secretOrKey: "shhhhh"
}, (payload, done) => {
    try{
        console.log("payload: ", payload)
        done(null, payload); // Trả ra payload + nhảy middleware tiếp theo
    }catch (err) {
        done(error, false) // Trả lỗi
    }
}))
app.get('/checkjwt', passport.authenticate('jwt', {
    session: false, // Authen thành công thì passport sẽ thiết lập 1 session login liên tục sẽ tốt nếu đăng nhập cùng 1 trình duyệt, thg k dùng
    failureRedirect: '/fail',
    successRedirect: '/',
}));

// Dùng Joi
const schema = Joi.object({
    username: Joi.string()
        .alphanum() // Chỉ chữ or số
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: Joi.ref('password'),
    access_token: [
        Joi.string(),
        Joi.number() 
    ],
    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) // email có 2 phần, phần sau phải là .com or .net
})
.with('username', 'birth_year') // Có username thì buộc có birth_year
.xor('password', 'access_token') // Chỉ có 1 trong 2
.with('password', 'repeat_password');
console.log(schema.validate({username: 'abc', birth_year: 1994}));
console.log(schema.validate({}));

const definition = ['key', 5, { a: true, b: [/^a/, 'boom'] }];
const schema2 = Joi.compile(definition); // Sinh ra type schema để check
const schema1 = Joi.alternatives().try( // là 1 trong các giá trị bên dưới
    Joi.string().valid('key'), // là string và buộc là "key"
    Joi.number().valid(5),
    Joi.object({
        a: Joi.boolean().valid(true),
        b: Joi.alternatives().try(
            Joi.string().pattern(/^a/),
            Joi.string().valid('boom')
        )
    })
);
console.log(schema1.validate("key")); 

const schemaForObject = Joi.object().keys({
    a: Joi.any()
})
const schemaForObjectExtended = schemaForObject.keys({
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().description("Mongo DB url")
}).unknown()
console.log(schemaForObjectExtended.prefs({ errors: { label: "key" } }).validate({ b: 12})); // kqtr

// Dùng http-status
console.info(status.INTERNAL_SERVER_ERROR);
console.info(status[500]);
console.info(status['500_NAME']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_NAME`]); 
console.info(status['500_MESSAGE']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_MESSAGE`]);
console.info(status['500_CLASS']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_CLASS`]);
console.log(status.classes.SUCCESSFUL);

// Dùng validator chống xss
var validator = require('validator');
console.log(validator.isEmail('foo@bar.com'));
let stringX = "\"><script>alert(1234);</script>";
let sanitized_string = validator.escape(stringX);
console.log(" \n The input string is: ", stringX);
console.log("The sanitized string is: ", sanitized_string)

// Dùng express-rate-limit
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 20, // 1 IP max 20 request per window per 15p
    skipSuccessfulRequests: true, // Là true thì request thành công sẽ k được đếm vào số lượt rate-limit
});
app.use('/', authLimiter);
app.get("/", function(req, res) {
    res.send("Hello World")
});
app.listen(8080);

