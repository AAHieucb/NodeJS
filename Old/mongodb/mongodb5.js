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
    
    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        },
        occupation: { type: String, default: "talk show host"}
    });
    var Person = mongoose.model('Person1', personSchema);

    // Tạo 1 query với 1 JSON doc
    Person. find({
        occupation: /host/,
        'name.last': 'Ghost',
        age: { $gt: 17, $lt: 66 },
        likes: { $in: ['vaporizing', 'talking'] }
    }).limit(10).sort({ occupation: -1 }) // Sort giảm dần occupation
    .select({ name: 1, occupation: 1 }).exec(function(err, data) {
        if(err) console.log(err);
        console.log(data);
    });
    // Tạo 1 query builder
    Person.find({ occupation: /host/ })
    .where('name.last').equals('Ghos')
    .where('age').gt(17).lt(66)
    .where('likes').in(['vaporizing', 'talking']).limit(10).sort('-occupation')
    .select('name occupation').exec(function(err, data) {
        if(err) console.log(err);
        console.log(data);
    });
    // Nếu gặp data mà k có trường age chẳng hạn thì nó coi là thỏa mãn và vẫn lấy

    const q = Person.updateMany({'name.last': "Ghost"}, {'name.last': "Ghos"});
    await q.then(() => console.log('Update 2')); // Chỉ được thực hiện 1 lần, nếu q.then 2 lần là sai. Nó k cho lưu query vào biến mà gọi liên tiếp.

    // Dùng cursor thao tác event với 1 list các document thoả mãn điều kiện
    var cursor = Person.find({ occupation: /host/ }).cursor();
    cursor.on('data', function(doc) {
        console.log("Có thể được gọi ở bất cứ document nào: " + doc);
    });
    cursor.on('close', function() {
        console.log("Gọi xong"); // Được gọi khi đã hoàn tất
    });

    // Dùng aggregation
    const docs = await Person.aggregate([{ $match: { 'name.last': 'Ghos' } }]);
    console.log(docs[0] instanceof mongoose.Document); // false
    console.log(docs);
    const doc = await Person.findOne();
    const idString = doc._id.toString();
    const queryRes = await Person.findOne({ _id: idString }); // Ok vì tự cast string sang ObjectId của MongoDB
    const aggRes = await Person.aggregate([{ $match: { _id: idString } }]); // K tự cast nên k tìm thấy id ra mảng rỗng
    console.log(queryRes);
    console.log(aggRes);

    // Validation
    var catSchema = new Schema({
        name: {
            type: String,
            required: [true, "Phai co name"] // Ghi đè message
        }
    });
    var Cat = db.model('Cat', catSchema);
    var cat = new Cat(); // Thiếu tên
    cat.save(function(error) {
        console.log("Error1: " + error); // Ra lỗi thiếu tên
        error = cat.validateSync();
        console.log("Error2: " + error); // Ra lỗi thiếu tên
    });

    // Asynchronous Validation
    const userSchema = new Schema({
        name: {
            type: String,
            validate: () => Promise.reject(new Error('Oops!'))
        },
        email: {
            type: String,
            // Dùng hàm validator trả ra chỉ khi trả ra true mói không lỗi. Nó dùng validate bất đồng bộ
            // VD ở dưới resolve(true) sẽ k lỗi, resolve false vẫn lỗi
            validate: {
                validator: () => Promise.resolve(false),
                message: 'Không thể xác minh email'
            }
        }
    });
    const User = db.model('User', userSchema);
    const user = new User();
    user.email = 'test@test.co';
    user.name = 'test';
    user.validate().catch(error => {
        if(error.errors['name']) // error xảy ra ở trường name
            console.log(error.errors['name'].message);
        if(error.errors['email'])
            console.log(error.errors['email'].message);
    });

    // Dùng middleware: 1 middleware lỗi kéo hàng loạt middleware sau dừng lại.
    userSchema.pre('save', function(next) {
        const err = new Error('something went wrong');
        next(err);
    });
    userSchema.pre('save', function() {
        return new Promise((resolve, reject) => {
            reject(new Error('something went wrong'));
        });
    });
    userSchema.pre('save', function() {
        throw new Error('something went wrong');
    });
    userSchema.post('init', function(doc) {
        console.log('%s đã được bắt đầu', doc._id);
    });
    userSchema.post('validate', function(doc) {
        console.log('%s đã được validate (nhưng chưa luư )', doc._id);
    });
    userSchema.post('save', function(doc) {
        console.log('%s Đã được lưu', doc._id);
    });
    userSchema.post('remove', function(doc) {
        console.log('%s Đã được remove', doc._id);
    });

    // Khi có nhiều post hook cùng tên nó sẽ gọi lần lượt. Ở đây sẽ thực hiện middleware này đầu tiên
    userSchema.post('save', function(doc, next) {
        setTimeout(function() {
            console.log('post1');
            next();
        }, 10);
    });
    // Sau đó đợi middleware trên gọi next() thì middleware này mới chạy
    userSchema.post('save', function(doc, next) {
        console.log('post2');
        next();
    });
    // Error handling middleware là 1 loại riêng có 3 tham số là middleware chuyên bắt lỗi
    userSchema.post('save', function(error, doc, next) {
        if (error.name === 'MongoError' && error.code === 11000) {
            next(new Error('There was a duplicate key error'));
        } else {
            next();
        }
    });

    catSchema.pre('remove', { document: true }, function() { // trước khi document gọi remove
        console.log('Removing doc!');
    });
    catSchema.pre('remove', { query: true }, function() { // trước khi gọi query để remove
        console.log('Removing!');
    });
    const Cat2 = db.model('Cat2', catSchema);
    const cat2 = new Cat2({name: "Hieu"});
    await cat2.save();
    Cat2.remove({name: "Hieu"}, function (err, result) {
        if (err){
            console.log(err)
        }else{
            console.log("Result :", result) 
        }
    });
}); 