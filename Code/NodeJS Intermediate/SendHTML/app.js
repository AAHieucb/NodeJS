const express = require("express");
const app = express();
const multer = require("multer");

// # Dùng multer 
// Lưu ảnh trong ổ đĩa bth
const storage = multer.diskStorage({ // diskStorage xđ store file ở local system như nào
    destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads"); // Đường dẫn upload ảnh là nơi lưu ảnh
    },
    filename: (req, file, cb) => { 
        cb(null, Date.now() + "_" + file.originalname); // File cần lưu sẽ có tên là gì
    }
});
const upload = multer({
    storage: storage
});

// Dùng pug
app.use(express.static('./uploads')); // Khai báo static folder
app.set("views", "./viewsTest"); // Khai báo đường dẫn đến thư mục chứa các template
app.set("view engine", "pug"); // Khai báo templateEngine sử dụng
app.use(express.json()); // Cho phép parsing application/json
app.use(express.urlencoded({ extended: true })); // Cho phép parsing application/xwww

// Các middleware view engine / Dùng pug
app.get("/", (req, res) => {
    res.render("form"); // Tìm trong thư mục viewsTest render form.pug thành html và gửi
});

// Nếu k gửi ảnh nó tự bỏ qua middleware multer, k cần phải lo
app.post("/", upload.single("avatar"), (req, res) => {
    const { body, file } = req;
    console.log(file);
    res.render("info", { body, file });
});

app.listen(8080);