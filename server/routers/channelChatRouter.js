const channelChatRouter = require("express").Router()

// CONTROLES
const {CreateChannel,UnirseChannel,MessagesChannel,getMessagesChannel,getChannels,getMenberChannel} = require("../controllers/channel.controller") 

// peticiones a canal de chat
channelChatRouter.post("/createChannel",CreateChannel)
channelChatRouter.post("/joinChannel",UnirseChannel)
channelChatRouter.post("/messageChannel",MessagesChannel)
// obtener mensages
channelChatRouter.post("/getMessageChannel",getMessagesChannel)
// obtener lo canales de chat
channelChatRouter.get("/getChannels",getChannels)
// obtener mienbros de un canal
channelChatRouter.post("/getMenberChannels",getMenberChannel)

module.exports = channelChatRouter;


