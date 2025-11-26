// Dùng chalk figlet marked marked-terminal minimist

import("chalk").then((chalk) => {
    chalk = chalk.default;
    console.log(chalk.blue("this is lit"))
    console.log(chalk.blue.bgRed.bold("Blue & Bold on Red"))
    console.log(chalk.blue.bgRed("Regular Blue on Red"))
    console.log(chalk.blue("Blue") + " Default" + chalk.red(" Red"))
    console.log(chalk.red("There is an ", chalk.underline("Error")))
    console.log(chalk.rgb(127, 255, 0).bold("Custom green"))
})

var figlet = require('figlet');
figlet('Hello World!!', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    console.dir("h"); // dir in ra trong cặp ngoặc '' dạng url
});

var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
marked.setOptions({
    renderer: new TerminalRenderer()
});
// marked.setOptions({
//     renderer: new TerminalRenderer({
//         codespan: chalk.underline.magenta, // Kết hợp chalk
//     })
// });
console.log(marked.marked('# Hello \n This is **markdown** printed in the `terminal`'));
// Cái marked-terminal có mặc định kiểu trong `` sẽ là vàng, trong **** sẽ là trắng, dòng có # sẽ gạch chân màu hồng

process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
})

// minimist phân tích cú pháp
const args = require('minimist')(process.argv.slice(2))
console.log(args)
// VD: node index.js test1 --name=hieu test2
// minimist sẽ lấy thành: { _: [ 'test', 'test2' ], name: 'flavio' }
