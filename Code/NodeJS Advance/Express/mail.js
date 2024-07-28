const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const formidableMiddleware = require("express-formidable"); 

// # Dùng dotenv
require("dotenv").config();
// VD: dotenv.config({ path: path.join(__dirname, "../../.env") }); khi k cùng thư mục phải specific, or đổi tên file .env cũng được

app.set("views", "./views");
app.set("view engine", "pug");



// # Dùng nodemailer express-formidable
app.use(
    formidableMiddleware({
        // Multiple k set thì chỉ đc 1 file
        multiples: true // => req.files sẽ là 1 array,
    })
);
// Tức là bth cái req của ta k nhận file truyền vào, nhưng nhờ express-formidable mà ta dùng như này nên req sẽ có thêm trường nx là file

app.get("/", (req, res) => {
    res.render("mail");
});

app.post("/sendMail", async (req, res) => {
    var attachments; 
    console.log(req.files.fileSend);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        // pool: true, // Ta phải create mỗi connection cho từng email. Pool hữu dụng khi ta có 1 lượng lớn message muốn gửi
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    // Trường hợp nếu có nhiều file được gửi về ta sẽ tạo ra 1 mảng attachment, Th có 1 file nó là 1 object
    console.log(req.files.fileSend.length);
    console.log(req.files.fileSend.size);
    if (req.files.fileSend.length > 0) {
        attachments = await req.files.fileSend.map(file => { // lấy attachment
            return {
                filename: file.name,
                path: file.path
            };
        });
    }

    // Nếu chỉ có 1 file và tồn tại
    if (req.files.fileSend.size > 0) {
        // Gán giá trị vào biến attachments
        attachments = [{
            filename: req.files.fileSend.name,
            path: req.files.fileSend.path
        }];
    }
    let {
        to,
        subject,
        text
    } = req.fields;
    let mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        attachments,
        text,
    };

    const sendMail = new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject({
                    msg: error,
                    type: "danger"
                });
            } else {
                resolve({
                    msg: "Email sent: " + info.response,
                    type: "success"
                });
            }
        });
    });

    // Tiến hành trả về thông báo 
    sendMail
        .then(result => {
            res.render("mail", result);
            transporter.close(); // Phải đóng luồng gửi sau khi gửi hết tất cả
        })
        .catch(err => {
            res.render("mail", err);
            transporter.close()
        });
});
app.listen(process.env.PORT || 8080);