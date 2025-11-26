const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dùng express-mongo-sanitize
app.use(
    mongoSanitize({
        allowDots: true, // cho phép .
        replaceWith: '_', // thế $ thành _
    }),
);

app.use(
    mongoSanitize({
        dryRun: true, // Chạy chế độ dry run = testing
        onSanitize: ({ req, key }) => { // Call mỗi khi input được sanitize
            console.warn(`This request[${key}] is sanitized`, req);
        },
    }),
);

// Default thì req.body, req.params, req.headers, req.query bị loại bỏ $ và . từ user input
app.use(mongoSanitize());

// VD bắt key có $
const payload = {"username": {"$gt": ""}};
const hasProhibited = mongoSanitize.has(payload);
console.log(hasProhibited);
console.log(payload);
console.log(mongoSanitize.sanitize(payload, {
    replaceWith: '_'
}));
console.log(payload);
