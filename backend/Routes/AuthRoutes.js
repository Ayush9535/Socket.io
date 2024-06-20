const express = require('express');
const { LoginController, RegisterController } = require('../Controllers/AuthControllers.js');
const AuthRouter = express.Router();

AuthRouter.post('/login' , LoginController)
AuthRouter.post('/register' , RegisterController)

module.exports = AuthRouter;