const sum = require('./testFunction'); // require thì k cần đuôi như import

function total(values = []) {
    return values.reduce(sum.sum, 0);
}

module.exports = total;