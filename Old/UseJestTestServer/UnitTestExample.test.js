const sum = require('./testFunction');

// Nếu chỉ muốn chạy 1 cái gì đó thì thêm .only vào, nếu có nh .only sẽ chạy tất cả các hàm có only.
test.only('adds 1 plus 2 to equal 3', () => { // 1 là tên case trong test suite, 1 là hàm chạy test
    expect(sum(1, 2)).toBe(3); // or toEqual
});

test.only('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
    // toBeGreaterThan, toBeLessThanOrEqual
    // float k thể ss bằng mà dùng toBeCloseTo
    // string dùng toMatch(/regexp/)
    // Iterable dùng toContain()
    // exception dùng expect(<function>).toThrow(<error>/(<expect nó throw bất cứ kiểu gì>));
});
