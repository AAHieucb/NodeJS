const redis = require("redis");
const client = redis.createClient({
  port: 1,
  host: "127.0.0.1",
});


client.on("connect", async function() {
  try{
    console.log(await client.ping());
  } catch(err){
    console.log("Err init redis:: ", err);
  }
});

client.on("ready", function() {
  console.log("Redis is ready");
});

async function connectRedis() {
  await client.connect();
}
connectRedis();

module.exports = client;