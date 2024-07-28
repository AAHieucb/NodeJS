const express = require('express');
const app = express();

// Dùng localtunnel
const localtunnel = require('localtunnel');

(async () => {
    const tunnel = await localtunnel({ port: 3001, subdomain: "nguyenthuhieu" });

    // The assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    console.log(tunnel.url);

    tunnel.on('close', () => {
        console.log("close tunnel");
    });
})();



// Dùng cross-env 
const configData = require("config"); // Có thể require 1 thư mục cùng cấp là config ntn với file json
const configurationData = configData.get("database");
// Package cross-env sẽ cho biến process.env.NODE_ENV. Package config dùng kết hợp khi dùng require sẽ tìm vào thư mục config cùng cấp với thư mục hiện tại
// Bên trong nó sẽ tìm file có tên: <process.env.NODE_ENV>.js tùy MT hiện tại là gì mà nó tìm file tương ứng, thêm vào đó nó cho phép ta lấy ra luôn 1 object có content là file json mà ta có thể lấy từng trường qua hàm get như trên

// Có thể dùng thuần như này
var config = {
    name: "dev",
    id: 1
};
if(process.env.NODE_ENV === "production"){
    config = {
        name: "prod",
        id: 2
    }
}
console.log(config.name + " " + config.id);
console.log(configurationData);

app.listen(3001, () => {
    console.log('The server is running at 3001 in mode: ' + process.env.NODE_ENV);
})