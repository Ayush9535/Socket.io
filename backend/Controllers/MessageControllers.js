const { MessageModel } = require('../Model/MessagesModel');
const { ConversationModel } = require("../Model/ConversationModel")
const { io , userSocketID } = require("../Socket/socket.js")

const sendMessage = async (req,res) =>{
    try {
        let { message , senderId} = req.body
        let { id:receiverId } = req.params

        let conversation = await ConversationModel.findOne({members : {$all : [senderId,receiverId]}})
        if(!conversation){
            conversation = new ConversationModel({
                members : [senderId,receiverId]
            })
        }
        
        let newMessage = new MessageModel({
            senderId,
            receiverId,
            message,
        })

        await newMessage.save()
        
        if (newMessage){
            conversation.messages.push(newMessage._id)
        }
        await conversation.save()
        
        io.to(userSocketID[receiverId]).emit("new-message" , newMessage)

        res.status(200).json(newMessage)

    } catch (error) {
        console.log("Error while sending message..!!",error)
        res.status(500).json({message:"Error while sending message..!!"})
    }
}

const getMessages = async (req,res)=>{
    try {
        let { id:senderId , user:receiverId} = req.params

        let conversation = await ConversationModel.findOne({members : {$all : [senderId,receiverId]}}).populate("messages")

        if(!conversation){
            return res.status(200).send([])
        }

        res.status(200).json(conversation.messages)

    } catch (error) {
        console.log("Error while getting messages..!!")
        res.send(500).json({message:"Error while getting messages..!!"})
    }
}

module.exports = { sendMessage , getMessages}