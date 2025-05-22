const https = require("https");
const fs = require("fs");

// Đọc chứng chỉ
const options = {
  key: fs.readFileSync("server-key.pem"),
  cert: fs.readFileSync("server-cert.pem"),
  ca: fs.readFileSync("ca-cert.pem"), // Tin cậy CA
  requestCert: true, // Yêu cầu client cung cấp chứng chỉ

  rejectUnauthorized: true, // Từ chối client không có chứng chỉ hợp lệ. Có thể set ở client và server. Self-sign sẽ hiện ra trang cảnh báo, ấn continue chính là set rejectUnauthorized false để bỏ qua việc check mà vẫn tạo TLS connection bth.
  // Nếu server set rejectUnauthorized false thì client không cần gửi cert cũng được, server k cần có chứng chỉ CA để check nữa, request vẫn được server xử lý bình thường, kết nối TLS vẫn được thiết lập kể cả cert k hợp lệ. Khi đó client có thể bị giả mạo và tạo kết nối tới server.
  // Nếu client set rejectUnauthorized false thì client cũng k check cert đến từ server và server có thể bị giả mạo. Nhưng lưu ý là server vẫn phải gửi cert tới client, nếu k sẽ k thiết lập được connection TLS. Server luôn phải có cert để tạo TLS, k thì phải quay về http.
};

const server = https.createServer(options, (req, res) => {
  console.log("XXX");
  if (!req.socket.authorized) { // trường check xem client có chứng chỉ hợp lệ hay không.
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
