const redis = require('redis');
const client = redis.createClient();
const express = require('express');
const app = express();

const connectRedis = async () => {
  await client.connect();
}
connectRedis();

client.configSet('notify-keyspace-events', 'Ex'); 
client.subscribe('__keyevent@0__:expired', (message) => { // Or: await client.pSubscribe('__keyspace@*__:*');
  console.log("message::", message);
});

app.listen( process.env.PORT || 3010, async () => {
  console.log(`EventListener is running 3010`);
})
