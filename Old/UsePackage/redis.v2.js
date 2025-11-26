const express = require('express');
const app = express();

const {get, set, setnx, incrby, exists, connect} = require("./model.redis");

app.get('/order', async (req,res) => {
    const time = new Date().getTime();
    console.log('Time request:::' + time);
    
    const slTonKho = 10;
    const keyName = 'IPhone13';

    const slMua = 1;

    const getKey = parseInt(await get(keyName));
    if(!getKey) {
        await set(keyName, 0);
    }

    var slBan = parseInt(await get(keyName));
    slBan = await incrby(keyName, slMua);
    if(slBan > slTonKho){
        console.log("Het hang");
        return res.json({
            status: 'error',
            msg: 'HET HANG',
            time
        })
    }

    console.log("Hooray!! So luong request hien tai la: " + slBan);
    // Đảm bảo kết quả chỉ có 10 người nhận được thông báo này, số còn lại toàn hiện hết hàng. Có thể chạy với ab test thử
    return res.json({
        status: 'success',
        msg: 'OK',
        time
    })
})

app.listen(3000, () => {
    connect();
    console.log('The server is running at 3000');
})