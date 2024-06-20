const { ConversationModel } = require('../Model/ConversationModel.js')
const { UserModel } = require('../Model/UserModel.js')

const getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.params.id;
        const conversations = await UserModel.find({ _id: { $ne: loggedInUserId } })
        if (!conversations) return res.status(200).json([])

        res.status(200).json(conversations)
    } catch (error) {
        console.log("Error in getConversations", error.message)
        res.status(500).json({ message: "Error in getting conversations"})
    }
}

module.exports = { getConversations }