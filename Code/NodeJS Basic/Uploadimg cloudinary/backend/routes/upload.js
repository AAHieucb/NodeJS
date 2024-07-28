// # Dùng multer cloudinary

const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');

router.post('/cloudinary-upload', 
    fileUploader.single('testname'), // Dùng single khi muốn lấy 1 file thôi, truyền vào tên trường mà ta xác định trong FormData ở frontend
    (req, res, next) => {
        console.log(req.file);
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }
        console.log(req.body.title);
        console.log(req.file?.path); 
        res.json({ secure_url: req.file?.path }); // Trả ra URL của file đã upload lên cloud để hiển thị trên trình duyệt
    }
);

module.exports = router;