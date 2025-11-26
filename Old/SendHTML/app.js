const express = require("express");
const app = express();
const multer = require("multer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer lưu ảnh ổ đĩa
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads");
    },
    filename: (req, file, cb) => { 
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const upload = multer({
    storage: storage
});

// Dùng pug
app.use(express.static('./uploads')); // static folder
app.set("views", "./viewsTest"); // folder chứa template
app.set("view engine", "pug"); // templateEngine sử dụng

app.get("/", (req, res) => {
    res.render("form"); // Tìm trong viewsTest render form.pug thành html và gửi
});

// Nếu k gửi ảnh sẽ tự bỏ qua middleware multer
app.post("/", upload.single("avatar"), (req, res) => {
    const { body, file } = req;
    console.log(file);
    res.render("info", { body, file });
});

app.listen(8080);