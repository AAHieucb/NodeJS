// Ví dụ hàm thực hiện theo ý ta trong 5 turn r quay lại ban đầu 10 turn xong lại theo ý ta thì spyOn ms làm đc. Còn dùng jest.mock 1 file nào đó thì module file đó thành undefined hết và buộc phải định nghĩa lại giá trị trả ra của tất cả. Do đó dùng spyOn chỉ tác động vào 1 hàm sẽ tốt hơn.
var sum = require('./testFunction');
test('use spy',() => {
    const addMock = jest.spyOn(sum, "add"); // Mock hàm add
    addMock.mockImplementation(() => "mock");
    expect(sum.add(1, 2)).toEqual("mock");
    addMock.mockRestore(); // Cho hàm add quay lại ban đầu
    expect(sum.add(1, 2)).toEqual(3);

    // Cách khác k dùng spyOn bằng cách ta lưu lại r gán về như cũ
    const saveAdd = sum.add;
    sum.add = jest.fn(saveAdd);
    sum.add.mockImplementation(() => "mock");
    expect(sum.add(1, 2)).toEqual("mock");
    sum.add = saveAdd;
    expect(sum.add(1, 2)).toEqual(3);
})