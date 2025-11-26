const express = require('express');
const app = express();

// Dùng localtunnel
const localtunnel = require('localtunnel');

(async () => {
    const tunnel = await localtunnel({ port: 3001, subdomain: "nguyenthuhieu" });

    console.log(tunnel.url);

    tunnel.on('close', () => {
        console.log("close tunnel");
    });
})();

const configData = require("config");
const configurationData = configData.get("database");

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