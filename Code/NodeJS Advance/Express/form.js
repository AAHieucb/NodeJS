var express = require('express');
var multer = require('multer');
var app = express();

// # Dùng multer lưu trong ổ đĩa bth
// diskStorage xác định nơi lưu file vào đĩa. Ta phải set 1 object có destination là hàm số có req, file, cb với req là request gửi tới. file là object lưu thông tin về ảnh. cb là 1 thứ mà multer cung cấp nhận vào 1 là error, 2 là url trên ổ đĩa xác định để lưu ảnh vào
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads"); // Đường dẫn upload ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" +  file.originalname); // File lúc này sẽ được lưu vào vùng nhớ tạm thời
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
    res.render("form"); // Tìm trong ./views
});

// app.use(upload.array()); // Lấy files từ req được 1 mảng ở mọi route. VD cho 1 cái choose file nhưng multiple files thì phải dùng array
app.post("/", upload.array("avatar", 2), (req, res) => { // Bắt form trường có field name là avatar, max là 2 file
    const { body, files } = req;
    console.log(files);
    res.render("info", { body, files }); 
    // render ra cái info.pug với tham số truyền vào pug là body và files. Truyền cả mảng files vào thì bên trong pug lấy được files[1] như bth
});
// Để dùng từ frontend chỉ cần tạo form POST vào "/" với enctype="multipart/form-data" và bên trong form có trường input là type="file", name="avatar"

app.listen(3000);
