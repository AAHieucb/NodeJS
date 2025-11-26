// Integration Test: test code của ta dùng đến code khác chạy có đúng k, mô phỏng code khác bằng mock
// Ta gọi hàm total, mà total lại gọi đến hàm sum, như v muốn test total phải test cả sum, nhưng sum là code của ng khác ta k quan tâm. Khi đó ta phải mock hàm sum

jest.mock('./testFunction'); // Báo hiệu mọi import từ file này có thể được mock

const sum = require('./testFunction');
sum.sum.mockReturnValue(1); // mock sum luôn return 1

const total = require('./mockFunction');
test('works', () => {
    expect(total([1, 2, 3, 4])).toEqual(10);
})

// Mock fs read file
const fs = require('fs');
function readContent(file) {
    return fs.readFileSync(file);
}
jest.mock('fs');
// fs.readFileSync = jest.fn().mockReturnValue('foo'); //or
fs.readFileSync.mockReturnValue('foo');
test('testReadFile', () => {
    expect(readContent('./text.txt')).toEqual('foo');
})

// Mock axios
const axios = require('axios');
jest.mock('axios', () => ({ 
    get: jest.fn().mockResolvedValue({ data: { foo: 'bar' }}) // mockResolvedValue tương đương với 1 promise trả ra giá trị resolve bất đồng bộ.
})) 
// Tương tự: mockResolvedValueOnce, mockRejectedValue, mockRejectedValueOnce
test('mock axios.get', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.data).toEqual({ foo: 'bar' });
});

function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
        callback(items[index]);
    }
}
test('test foreach', () => {
    const mockCallback = jest.fn(x => 42 + x); // Hàm fn cho phép tạo 1 function mới
    forEach([0, 1], mockCallback); 
    // Test hàm tạo ra. Từ đây ta có thể lấy các thứ để kiểm tra hàm tạo ra đã được dùng như thế nào. VD ở trên hàm đc gọi 2 lần thì check như sau:
    expect(mockCallback.mock.calls.length).toBe(2); // Mock function được gọi 2 lần
    expect(mockCallback.mock.calls[0][0]).toBe(0); // Tham số thứ nhất của lần gọi đầu tiên là 0
    expect(mockCallback.mock.calls[1][0]).toBe(1); // Tham số thứ nhất của lần gọi thứ 2 là 1
    expect(mockCallback.mock.results[0].value).toBe(42); // Giá trị trả về của lần gọi đầu tiên là 42
});

// Mock hàm trả về giá trị khác nhau mỗi lần
test('test mock return value', () => {
    const filterTestFn = jest.fn();
    filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false); // trả true r false
    const result = [11, 12].filter(num => filterTestFn(num));
    console.log(result); // 11
    console.log(filterTestFn.mock.calls);
});

// jest.fn().mockImplementation(<function>) = jest.fn(<function>) chỉ là 1 cách viết định nghĩa khác nhưng ta còn có thể chỉ định nghĩa cho lần đầu tiên với mockImplementationOnce(<function>);
sum.plus.mockImplementationOnce(()=>"hello");
test('works1', () => {
    expect(sum.plus()).toEqual("hello");
    expect(sum.plus()).toEqual("hello"); // Lần này k còn đúng nx, nó quay về 1
})
