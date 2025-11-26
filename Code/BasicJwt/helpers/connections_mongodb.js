const mongoose = require("mongoose");
require("dotenv").config();

const conn = mongoose.createConnection(process.env.URI_MONGODB_NEW);

conn.on("connected", function() {
  console.log(`Mongodb:: connected ${this.name}`);
});

conn.on("disconnected", function(){
  console.log(`Mongodb:: disconnected::${this.name}`);
})

conn.on("error", function(error){
  console.log(`Mongodb:: error::${JSON.stringify(error)}`);
})

process.on("SIGINT", async() => {
  await conn.close();
  process.exit(0);
})

module.exports = conn;