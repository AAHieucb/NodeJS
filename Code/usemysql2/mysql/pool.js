const express = require("express");
const app = express();
const PORT = 4444;
const mysql = require("mysql2");

// Dùng mysql2
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "testuser",
  password: "testpass",
  database: "aliconcon",
  connectionLimit: 10 // max 10 connections
})

app.get("/pool", (req, res) => {
  pool.execute("select * from user limit 10", (error, records, fields) => {
    if(err){
      console.error("error: ", err);
      res.send(err);
      return;
    }
    console.log("records[0]:1111::", records);
    res.send(records[0]);
    pool.end();
  })
});

app.get("/connectionpool", (req, res) => {
  pool.getConnection(function(err, conn) {
    if(err){
      console.log("error::", err);
    }
    conn.query("select * from user limit 10", (error, records, field) => {
      if(error) {
        console.log("error::", error);
        res.send(error);
        return;
      }
      console.log("records[0]::3333::", records);
      res.send(records[0]);
    })
    pool.releaseConnection(conn);
  })
});

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
