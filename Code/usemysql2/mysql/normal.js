const express = require("express");
const app = express();
const PORT = 4444;
const mysql = require("mysql2");

function getConnection() {
  return mysql.createConnection({
    host: "127.0.0.1",
    user: "testuser",
    password: "testpass",
    database: "aliconcon",
    insecureAuth: true,
  })
}

app.get("/normal", (req, res) => {
  const conn = getConnection();
  conn.connect(err => {
    if(err){
      console.error("error connecting: ", err);
      return;
    }
    conn.query("select * from user limit 10", (error, records, fields) => {
      if(err) throw error;

      console.log("records[0]:::", records);
      res.send(records[0]);
      conn.end(); // K dùng connection pool, buộc đóng thủ công connection ở đây
    })
  })
});

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
