const express = require('express')
const user_router = express.Router()

const user_controller = require("../controllers/user");

user_router.get("/", user_controller.index)
user_router.get('/create', user_controller.getCreate)
user_router.post('/create', user_controller.postCreate)
user_router.get('/search', user_controller.search)

user_router.get('/:id', user_controller.getId)

module.exports = user_router;