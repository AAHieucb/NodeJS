const https = require("https");
const fs = require("fs");

// Đọc chứng chỉ
const options = {
  key: fs.readFileSync("server-key.pem"),
  cert: fs.readFileSync("server-cert.pem"),
  ca: fs.readFileSync("ca-cert.pem"), // Tin cậy CA
  requestCert: true, // Yêu cầu client cung cấp chứng chỉ
  rejectUnauthorized: true, // Từ chối client không có chứng chỉ hợp lệ
};

const server = https.createServer(options, (req, res) => {
  console.log("XXX");
  if (!req.socket.authorized) {
    res.writeHead(401);
    res.end("Unauthorized");
    return;
  }

  res.writeHead(200);
  res.end("Hello from Secure Server!");
});

server.listen(3000, () => {
  console.log("Server running on https://localhost:3000");
});
