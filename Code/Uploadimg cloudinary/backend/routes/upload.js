const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');

router.post('/cloudinary-upload', 
    fileUploader.single('testname'), // single lấy 1 file thôi, truyền vào tên lưu file trong FormData
    (req, res, next) => {
        console.log(req.file);
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }
        console.log(req.body.title);
        console.log(req.file?.path); 
        res.json({ secure_url: req.file?.path }); // Trả ra URL của file đã upload lên cloud
    }
);

module.exports = router;