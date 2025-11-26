const myBeverage = {
    delicious: true,
    sour: false,
};
describe('my beverage', () => { // describe gom các test liên quan lại
    test('is delicious', () => {
        expect(myBeverage.delicious).toBeTruthy();
    });
    test('is not sour', () => {
        expect(myBeverage.sour).toBeFalsy();
    });
});

beforeAll(() => console.log('Thực hiện trước khi bắt đầu chạy các hàm ở ngoài'));
afterAll(() => console.log('Thực hiện sau khi chạy xong các hàm ở ngoài'));
beforeEach(() => console.log('Thực hiện trước khi chạy từng hàm ở ngoài'));
afterEach(() => console.log('Thực hiện sau khi chạy xong từng hàm ở ngoài'));
test('test1', () => console.log('1 HÀM Ở NGOÀI'));
describe('Hàm ở ngoài bao 1 hàm ở trong', () => {
    beforeAll(() => console.log('Thực hiện trước khi bắt đầu chạy các hàm nested ở trong'));
    afterAll(() => console.log('Thực hiện sau khi chạy xong các hàm nested ở trong'));
    beforeEach(() => console.log('Thực hiện trước khi chạy từng hàm nested ở trong'));
    afterEach(() => console.log('Thực hiện sau khi chạy xong từng hàm nested ở trong'));
    test('test2', () => console.log('1 HÀM NESTED Ở TRONG'));
});
