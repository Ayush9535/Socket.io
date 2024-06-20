const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'messages',
        required: true,
        default: []
    }]  
}, {timestamps: true});

const ConversationModel = mongoose.model('conversations', ConversationSchema);

module.exports = {ConversationModel};