const express = require('express');
const Messagerouter = express.Router();
const { sendMessage , getMessages } = require('../Controllers/MessageControllers');
const { protectedRoute } = require('../middleware/ProtectedRoute');

Messagerouter.post('/send/:id' , sendMessage);
Messagerouter.get('/getMessages/:id/:user' , getMessages);

module.exports = Messagerouter;