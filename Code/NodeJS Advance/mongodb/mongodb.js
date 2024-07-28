// Dùng mongoose

var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://hieu:NguyenThuHieu123@cluster0.xfemg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser: true,  useUnifiedTopology: true} 
);

var db = mongoose.connection;

db.on('error', function(err) { 
    if (err) console.log("Error: " + err)
});
// db.on('error', console.error.bind(console, 'connection error:')); 

db.once('open', async function() { 
    console.log("Kết nối thành công !");

    // Thao tác với Schema SchemaTypes
    var Schema = mongoose.Schema; 
    var blogSchema = new Schema({
        title:  String,
        author: String,
        body:   String,
        hidden: {
            type: Boolean,
            required: true
        },
        comments: [{
            body: String,
            date: Date
        }],
        date: {
            type: Date,
            default: Date.now
        }
    });
    blogSchema.add({
        meta: {
            votes: Number,
            favs: Number
        }
    });

    // Thêm static function và methods cho schema
    blogSchema.methods.showMessages = function() {
        // Dùng methods hay method đều đc. K dùng arrow function vì hỏng biến this.
        // Hàm này được gọi bởi mỗi document của schema này thì cái this là từng document sau khi đã gán hết mọi thứ. Thg truyền thêm callback để gọi ở đây
        console.log(this.model("Blog").find({title: "Lập"}).mongooseCollection.name);
        // this là document này, nhưng this.model('<tên model>'); để truy cập sâu vào Model của cả database tên là Blog rồi trong list các document của model lấy ra 1 object có tính chất là title: "Lập"
        console.log(`Đã thêm Blog mới có tên "${this.title}"`);
    }
    // Cái trên là instance methods xử lý cấp document. Để xử lý tác vụ ở cấp Model thì dùng static method
    blogSchema.statics.findByTitle = function(title) {
        return this.find({ title: new RegExp(title, "i") }); // Ở cấp model thao tác lấy các document có tính chất title chứa title truyền vào hàm incasesensitive
    }; // or
    blogSchema.static("findByAuthor", function(author) {
        return this.find({ author }); // Tìm các document có {author: author} với truyền vào author
    });

    var Blog = mongoose.model('Blog', blogSchema);
    var dataInsert = {
        title:  'Lập trình NodeJS căn bản', 
        author: 'Freetuts.net',
        body:   'Nội dung lập trình NodeJS căn bản',
        hidden: false,
        meta: {
            votes: 1,
            favs: 2
        }
    }
    let blogs = await Blog.findByTitle("Lập");
    blogs = blogs.concat(await Blog.findByAuthor("Free")); // Static gọi lúc nào cx đc
    console.log("Blogs list: ");
    console.log(blogs);
    
    var blogCollections = new Blog(dataInsert); // Tạo 1 collection cho model và collection có data đầu tiên
    console.log("Check");
    console.log(blogCollections.isNew);
    blogCollections.save(function (err, data) {
        if (err) return console.error(err);
        blogCollections.showMessages()
    });

    var animalSchema = new Schema({
        name:  String,
        date: {
            type: Date,
            default: Date.now
        }
    });
    // Query giúp mở rộng các câu truy vấn
    animalSchema.query.byName = function(name) {
        // Chỉ query khi name trùng với name truyền vào hàm
        return this.where({ name: new RegExp(name, 'i') });
    };
    var Animal = mongoose.model('Animal', animalSchema);
    Animal.create({ name: 'fido'}, function (err, small) {
        if (err) return console.log(err);
    });
    Animal.find().byName('fido').exec(function(err, animals) {
        console.log("Find animal: " + animals); // Tìm các animals có tên fido và in ra
    });
    Animal.findOne().byName('fido').exec(function(err, animal) { 
        console.log("Find one animal: " + animal);
    });

    // Thao tác với virtual
    // Virtual ảo hóa giúp kết hợp nhiều giá trị thành 1 giá trị mà k phải thêm gì vào database, như JOIN của SQL ấy
    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        }
    });
    personSchema.virtual('fullName').get(function () { // Virtual phải khai báo ngay sau khi tạo schema
        return this.name.first + ' ' + this.name.last;
    });
    var Person = mongoose.model('Person', personSchema); // Đưa nó vào một Model dựa theo schema
    var axl = new Person({ // Tạo môt document
        name: { first: 'Nguyen', last: 'Rose' }
    });
    var personDocument = new Person(axl); // Tạo 1 document cho model
    personDocument.save(function (err, data) {
        if (err) return console.error(err);
        console.log(data);
    });
    console.log("Data: ");
    console.log(axl.fullName);
    // virtual đã định nghĩa ra 1 thuộc tính mới cho schema là fullName, có thể lấy trực tiếp
});
