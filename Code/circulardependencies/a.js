// Tránh circular dependencies

// TH1:
// var b = require('./b');
// console.log(b);
// module.exports = {
//     getThisName : getThisName,
//     getOtherModuleName : getOtherModuleName,
//     name : getName
// }

//TH2: k lỗi vì k gọi hàm lồng nhau
var b = require('./b');
console.log(b);
const getThisName = () => {
    return b.getOtherModuleName()
}
const getOtherModuleName = () => {
    return b.getThisName();
}
const getName = () => {
    return 'moduleA is OK'
}
exports.getThisName = getThisName;
exports.getOtherModuleName = getOtherModuleName;
exports.name = getName;

// Sự khác biệt khi dùng module.exports 1 cục và exports từng cái: bth k khác gì nhau nhưng chỉ ở circular này thì nó mới khác nhau gây lỗi. Xét TH C require A, A require B, B require A và chạy file C thì khi chạy từ trên xuống của file B nó dùng var a = require("./a.js"); nhưng k được vì file A chưa chạy từ trên xuống nên bỏ qua, thực ra nó k bỏ qua mà nó lưu như 1 instance của A trong file b.js và chờ nếu như module a.js mà định nghĩa thêm các thuộc tính gì thì nó sẽ tự lưu vào instance này. Thực ra mỗi file đều có 1 biến số global gọi là module.exports mà có thể viết gọn là exports, các file khác khi require file này thực ra là lấy đúng cái biến này. Khi ta dùng biến module.exports của a.js, thay đổi giá trị của biến global module.exports (file A) k được đồng bộ với biến instance a của file B mà biến instance này chỉ chờ bắt thay đổi thuộc tính thôi. Còn dùng exports.name = getName tức là thêm 1 thuộc tính name cho biến exports thì tất cả các instance của file A trong các file khác đều bắt được và lúc này instance a trong file B sẽ có thêm attr name = getName luôn.
