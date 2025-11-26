const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
require('dotenv').config();

// Test dùng bcrypt làm nặng tác vụ của server, nên dùng crypto có sẵn của nodejs
app.get("/", async (req,res) => {
    const hasPassword = await bcrypt.hash("This is a password", 10);
    // Đối số 2 là number of rounds mà salt được sinh ra dựa vào nó, càng lớn càng khó. VD để 30 thì server crash luôn vì mã hóa quá nặng
    res.send(hasPassword);
})

app.listen(process.env.PORT | 5000, () => {
    console.log('Server is running at port 5000');
})
