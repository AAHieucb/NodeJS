// Dùng module-alias

require('module-alias/register')
const express = require("express");
const app = express();
const createError = require("http-errors");
require("dotenv").config();
const UserRoute = require("@routers/User.route.js");
require("@/helpers/connections_mongodb");
const client = require("./helpers/connections_redis.js");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3002;

app.get("/", async (req, res, next) => {
  res.send(await client.get("foo"));
});

app.use("/user", UserRoute);

app.use((req, res, next) => {
  next(createError.NotFound("This route doesn't exist"));
})
app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})