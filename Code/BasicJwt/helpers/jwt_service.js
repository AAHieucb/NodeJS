const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../helpers/connections_redis");

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1m",
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if(err) reject(err);
      resolve(token);
    })
  })
};

const verifyAccessToken = (req, res, next) => {
  if(!req.headers["authorization"]){
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if(err){
      if(err.name == "JsonWebTokenError"){
        return next(createError.Unauthorized());
      }
      return next(createError.Unauthorized(err.message));
    }
    req.payload = payload;
    next();
  })
}

const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
    };
    JWT.sign(payload, secret, options, async (err, token) => {
      if(err) return reject(err);
      const res = await client.set(userId.toString(), token, {
        EX: 365*24*60*60
      });
      if(res == null){ 
        console.error("Redis set refresh token error");
        reject(createError.InternalServerError());
      } else {
        resolve(token);
      }
    })
  })
};

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
      if(err) return reject(err);
      const token = await client.get(payload.userId);
      if(token == null){
        return reject(createError.Unauthorized());
      }
      if(token == refreshToken){
        return resolve(payload); 
      }
      return reject(createError.Unauthorized());
    });
  })
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};