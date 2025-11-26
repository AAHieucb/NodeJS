const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("server-key.pem"),
  cert: fs.readFileSync("server-cert.pem"),
  ca: fs.readFileSync("ca-cert.pem"), // Tin CA
  requestCert: true, // Yêu cầu client cung cấp chứng chỉ

  rejectUnauthorized: true, // Từ chối client không có chứng chỉ hợp lệ. Có thể set cả client server
  // Nếu server set rejectUnauthorized false thì client không cần gửi cert, server k cần có chứng chỉ CA để check nữa, request vẫn được server xử lý bình thường, kết nối TLS vẫn được thiết lập kể cả cert k hợp lệ. Chấp nhận việc client có thể bị giả mạo.
  // Nếu client set rejectUnauthorized false thì client cũng k check cert đến từ server và server có thể bị giả mạo. Nhưng lưu ý là server vẫn phải gửi cert tới client, nếu k sẽ k thiết lập được connection TLS, k thì phải quay về http.
};

const server = https.createServer(options, (req, res) => {
  if (!req.socket.authorized) { // trường check client có chứng chỉ hợp lệ không.
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
