var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hieu:NguyenThuHieu123@cluster0.xfemg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    {useNewUrlParser: true,  useUnifiedTopology: true}
);
var db = mongoose.connection;
db.on('error', function(err) {
    if (err) console.log("Error: " + err)
});
db.once('open', async function() {
    var Schema = mongoose.Schema;
    const MyModel = mongoose.model('Test', new Schema({ name: String }));
    var doc = await MyModel.findOne();
    var doc = new MyModel();
    console.log(doc instanceof MyModel); // true
    console.log(doc instanceof mongoose.Model); // true
    console.log(doc instanceof mongoose.Document); // true

    doc.name = 'foo'; // Update trực tiếp tương đương với updateOne({ _id: doc._id }, { $set: { name: 'foo' } })
    await doc.save();

    var doc = await MyModel.findOne();
    await MyModel.deleteOne({ _id: doc._id });

    const schema = new Schema({ name: String, age: { type: Number, min: 0 } });
    const Student = mongoose.model('Student', schema);
    let p = new Student({ name: 'foo', age: 'bar' });
    let p2 = new Student({ name: 'foo', age: -1 });
    let p3 = new Student({ name: 'foo', age: 100 });
    await p.validate(function(err) {
        console.log("Err1 " + err);
    });
    const err = p2.validateSync(); // Post lên db cũng tự check validatation, ta có thể yêu cầu check thủ công như này.
    if (err) {
        console.log("Err2 " + err);
    }
    // Có 2 cách để ghi đè
    var doc = await Student.findOne({});
    doc.overwrite({ name: 'Freetuts.net' });
    await doc.save(); // overwrite phải có save()

    await Student.replaceOne({}, { name: 'Freetut.net' });

    // Thao tác với subdocuments: cx chỉ là schema con bên trong
    var childSchema = new Schema({ name: 'string' });
    var parentSchema = new Schema({
        children: [childSchema], 
        child: childSchema,
        children2: [{ // children và children2 là như nhau nhưng dùng childSchema riêng có lợi riêng
            name: String
        }]
    });
    var Parent = mongoose.model("Parent", parentSchema);
    var parent = new Parent({
        children2: [{ name: "Freetuts.net" }, { name: "Hoc lap trinh" }]
    });
    console.log(parent.children2[0].name);
    parent.children2[1].name = "Node.js";
    parent.save(function (err, data) {
        if (err) return console.error(err);
        console.log(data);
    });
    
    // subdocument k tự lưu khi có sự thay đổi mà phải đợi document cha lưu trước.
    // Khi gọi vào middleware như save, validate,.. của cha thì cũng gọi vào tất cả thứ đó của con trước.
    childSchema.pre('save', function (next) {
        return next(new Error('#sadpanda'));
    });
    var parent = new Parent({ children: [{ name: 'invalid' }] });
    await parent.save(function (err) {
        if(err) console.log(err.message) // #sadpanda
    });

    // Con gọi trước r đến cha
    var childSchema1 = new mongoose.Schema({ name: "string" });
    childSchema1.pre("validate", function(next) {
        console.log("childSchema validate.");
        next();
    });
    // gọi next sẽ chuyển sang middleware tiếp theo nhưng vẫn chạy các câu lệnh bên dưới của middleware hiện tại. 
    childSchema1.pre("save", function(next) {
        console.log("childSchema save.");
        next();
    });
    var parentSchema1 = new mongoose.Schema({
        child1: [childSchema1]
    });
    parentSchema1.pre("validate", function(next) {
        console.log("parentSchema validate");
        next();
    });
    parentSchema1.pre("save", function(next) {
        console.log("parentSchema save");
        next();
    });
    var Parent1 = mongoose.model('Parent1', parentSchema1);
    var parent1 = new Parent1({child1: [{name: 'Freetuts.net'}, {name: 'Lap trinh NodeJS'}]})
    parent1.save();
    
    var parent2 = new Parent1;
    parent2.child1.push({ name: 'Freetuts.net' }, {name: "K bi xoa"});
    var subdoc = parent2.child1[0];
    console.log(subdoc.isNew); // true vì mới tạo bên trên
    await parent2.save(function (err) { if (err) console.log(err)});
    parent2.child1.id(subdoc._id).remove();

    var parent2 = new Parent1;
    parent2.child1.push({ name: 'Freetuts.net' }, {name: "K bi xoa"});
    await parent2.save();
    parent2.child1 = null; // Cách xóa tất cả con (phải có save). Ở đây database sẽ chứa cha bên trong có con là null
    await parent2.save();
}); 