// Dùng Jest

// Khi dùng asynchronous thì test nó k chờ đâu. VD ta dùng hàm promise, muốn chờ ta phải cho test return hàm promise thì nó mới chờ như dưới. Nếu promise reject, test sẽ tự động thất bại nhưng ta bắt theo kiểu dưới là kiểm tra message chứ k kiểm tra promise thành công hay k là đc. Test function checkIsAdult tạo ra
function checkIsAdult(age) {
    return new Promise((resolve, reject) => {
        if (age >= 18) resolve('Da tren 18, an ngon nhoe');
        else reject('Chua an duoc, can than boc lich');
    });
}
test('kiem tra truong thanh thanh cong', () => {
    return checkIsAdult(20).then(data => {
        expect(data).toBe('Da tren 18, an ngon nhoe');
    });
});
test('kiem tra async truong thanh that bai', async () => {
    expect.assertions(1);
    try {
        await checkIsAdult(13);
    } catch (e) {
        expect(e).toMatch('Chua an duoc, can than boc lich');
    }
});
