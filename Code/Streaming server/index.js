const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Dựng streaming server
app.get("/video", function (req, res) {
  const range = req.headers.range;
  const videoPath = "a.mp4";
  const videoSize = fs.statSync("a.mp4").size;

  if (!range) {
    // Gọi bằng video player html5 tự có trường range trong header
    res.status(400).send("Requires Range header");
  }
  
  // Tính điểm bắt đầu và kết thúc byte gửi. Ở đây ta gửi lại 1MB mỗi request
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range?.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1); // byte tính từ 0 nên max là videoSize - 1
  const contentLength = end - start + 1;

  // Format response phải chuẩn
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);

  // Stream phải pite vào response để gửi trả 
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});