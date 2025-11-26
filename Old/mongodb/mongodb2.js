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
    
    const schema = new Schema({ name: String }); 
    console.log(schema.path('name') instanceof mongoose.SchemaType);
    console.log(schema.path('name') instanceof mongoose.Schema.Types.String);
    console.log(schema.path('name').instance);

    var testSchema = new Schema({
        binary:  Buffer,
        age:     { type: Number, min: 18, max: 65 },
        mixed:   Schema.Types.Mixed,
        _someId: Schema.Types.ObjectId,
        decimal: Schema.Types.Decimal128,
        array: [], 
        ofDates: [Date],
        ofBuffer: [Buffer],
        ofMixed: [Schema.Types.Mixed],
        ofObjectId: [Schema.Types.ObjectId],
        ofArrays: [[]],
        ofArrayOfNumbers: [[Number]],
        nested: {
            stuff: { type: String, lowercase: true, trim: true }
        },
        map: Map,
        mapOfString: {
            type: Map,
            of: String
        },
        details: {
            type: {
                type: String
            },
            color: String
        },
    })
    var numberSchema = new Schema({
        integerOnly: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            alias: 'i'
        }
    });

    var numberDoc = mongoose.model('Number', numberSchema);
    var doc = new numberDoc();
    doc.integerOnly = 2.001;
    console.log(doc.integerOnly); 
    console.log(doc.i);

    var schema2 = new Schema({
        test: {
            type: String,
            index: true,
            unique: true
        },
        test2: {
            type: String,
            enum: ['large', 'small'],
            uppercase: true,
            minlength: 2
        },
        test3: {
            type: Date,
            min: ['2025-12-09', "Ngày bị nhỏ quá rồi"],
            max: '2019-19-02'
        },
        phoneNumber: {
            type: String,
            validate: {
                validator: function(v) {
                    return /\d{3}-\d{3}-\d{4}/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            select: false 
        },
    });

    var Test = mongoose.model('Test', schema2);
    // Thêm document k cần dùng new
    Test.create({ test: 'small' }, function (err, small) {
        if (err) return console.log(err);
    });
    // Hoặc thêm hàng loạt
    Test.insertMany([{ test: 'medium' }, { test: "big" }], function(err) {
        if (err) return console.log(err);
    });
}); 