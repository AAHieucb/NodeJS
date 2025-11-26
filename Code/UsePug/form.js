var express = require('express');
var multer = require('multer');
var app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" +  file.originalname);
    }
});
const upload = multer({ storage: storage });

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ // parsing application/xwww-form-urlencoded
    extended: true
}));
app.use(express.static("uploads")); 

app.get("/", (req, res) => {
    res.render("form");
});

app.post("/", upload.array("avatar", 2), (req, res) => { // upload.array như là 1 middleware dùng mỗi route này thôi
    const { body, files } = req;
    console.log(files);
    res.render("info", { body, files }); // Tìm info.pug trong /views render ra với tham số truyền vào là body và files.
});
// VD: Để dùng từ FE cần tạo form POST vào "/" với enctype="multipart/form-data" và bên trong form có trường input là type="file", name="avatar"

app.listen(3000);
