// Dùng Jest

// Khi dùng asynchronous thì test k chờ. VD ta dùng hàm promise, muốn chờ ta phải cho test return hàm promise mới được. 
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
