const {Schema,model} = require("mongoose")


const ChannelSchema = new Schema({
    nameChannel:{
        type:String,
        required:true
    },
    describChannel:{
        type:String,
        required:true
    },
    keyChannel:{
        type:String
    },
    menberChannel:{
        type:Array
    },
    messagesChannel:{
        type:Array
    },
})



module.exports = model("ChannelChats",ChannelSchema)


