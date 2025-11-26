const https = require("https");
const fs = require("fs");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/",
  method: "GET",
  key: fs.readFileSync("client-key.pem"),
  cert: fs.readFileSync("client-cert.pem"),
  ca: fs.readFileSync("ca-cert.pem"), // Tin CA của server
  passphrase: "mypassword", // Mật khẩu của file pfx (nếu có)
};

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("Response from server:", data);
  });
});

req.on("error", (err) => {
  console.error("Error:", err.message);
});

req.end();
