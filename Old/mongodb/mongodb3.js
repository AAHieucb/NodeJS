var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hieu:NguyenThuHieu123@cluster0.xfemg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    {useNewUrlParser: true,  useUnifiedTopology: true}
);
var db = mongoose.connection;
db.on('error', function(err) {
    if (err) console.log("Error: " + err)
});
db.once('open', async function() {
    console.log("Kết nối thành công !");
    var Schema = mongoose.Schema;
    
    var staffSchema = new Schema({
        name: {
            type: String,
            required: function() {
                this.age > 0
            }
        },
        age: Number
    });
    var Staff = mongoose.model('Staff', staffSchema);

    Staff.create({ name: 'Hello', age: 10 }, function (err, data) {
        if (err) return console.log(err);
    })
    Staff.find({ name: 'Hello' }).where('age').gt(1).exec(function(err,data) {
        console.log("Hello " + data);
    });

    console.log(await Staff.find({ name: 'Hello', age: { $gte: 9 } }));
    await Staff.find({ name: /hello/i }, null, { skip: 10 }).exec();
    
    const data = await Staff.findById("626ceba14e7bc4c037cef4be");
    console.log(data);
    Staff.deleteOne({ name: 'Hello' }, function (err) {
        if (err) return console.log(err);
    }); // Có delete, deleteById
    Staff.updateOne({ name: 'Hell' }, { name: 'T-90' }, function(err, res) {
        if (err) throw err;
        console.log(res); // Trả về có bao nhiêu cái được update,...
    });

    // Change Stream bắt sự kiện chỉ dùng khi đã kết nối với 1 MongoDB replica
    (async function run() {
        const personSchema = new mongoose.Schema({
            name: String
        });
        const Person = mongoose.model("Person", personSchema, "Person");
        Person.watch().on("change", data => console.log(new Date(), data)); // Bắt sự kiện
        // await Person.create({ name: "Axl Rose" }); // Thử thêm doc cho nó bắt
    })();

    const schema = new Schema({
        docArr: [{ name: String }],
        singleNested: new Schema({ name: String })
    });
    const Test = mongoose.model('Test', schema);
    const doc = new Test({
        docArr: [{ name: 'foo' }],
        singleNested: { name: 'bar' }
    });
    console.log("Check: ", doc.singleNested.parent() === doc); // Lấy ra schema cha của schema con
    console.log(doc.docArr[0].parent() === doc);

    const schema2 = new Schema({
        level1: new Schema({
            level2: new Schema({
                test: String
            })
        })
    });
    const Test2 = mongoose.model('Test2', schema2);
    const doc2 = new Test2({ level1: { level2: {test: "data"} } });
    console.log(doc2);
    console.log(doc2.level1.level2.parent() === doc2); // false
    console.log(doc2.level1.level2.parent() === doc2.level1); // true
    console.log(doc2.level1.level2.ownerDocument() === doc2); // true
    
    var parentSchema = new Schema({
        children: [{ name: 'string' }]
    }); // Or
    var parentSchema = new Schema({
        children: [new Schema({ name: 'string' })]
    });

    var parentSchema = new Schema(
        {
            child: { type: { name: String } } // => type: { name: String } chỉ là single nested, có thể bỏ type đi
        }
    ); // Or
    var parentSchema = new Schema({
        child: new Schema({ name: 'string' })
    });

    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        },
        occupation: { type: String, default: "talk show host"}
    });
    var Person = mongoose.model('Person1', personSchema);
    await Person.create({ 'name.last': 'Ghost', 'name.first': 'Space'});
    Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
        if (err) return console.log(err);
        console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation); // "Space Ghost is a talk show host".
    });
}); 