const express = require('express');
const { getConversations } = require('../Controllers/ConversationControllers.js');
const { protectedRoute } = require('../middleware/ProtectedRoute.js');
const ConversationRouter = express.Router();

ConversationRouter.get("/getconversations/:id", getConversations)

module.exports = ConversationRouter