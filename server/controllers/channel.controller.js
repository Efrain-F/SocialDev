require("dotenv").config()

const UserSchema = require("../models/userModel")
const ChannelSchema = require("../models/chatChannel")
const swt = require("jsonwebtoken")
const validateToken = require("./validate.controlles")


module.exports = {
    CreateChannel:async (req,res)=>{
        const tokenValido = await validateToken(req)
        if(!tokenValido){
            return res.status(401).json({
                channel:false,
                message:"No puedes crear un channel de chat"
            })
        }
        const {name,describ} = req.body
        const channel = new ChannelSchema({
            nameChannel:name,
            describChannel:describ
        })
        const nameChanel = await ChannelSchema.findOne({nameChannel:name})
        if(nameChanel){
            return res.status(404).json({
                createChannel:false,
                message:"Channel Chat existente"
            });
        }
        
        // gurdamos los datos en la db
        await channel.save()
        res.json({
            channel:true,
            idChannel:channel._id
        })
    },
    UnirseChannel:async (req,res)=>{
        const tokenValido = await validateToken(req)
        if(!tokenValido){
            return res.status(401).json({
                channel:false,
                message:"No puedes ser agregado a este channel"
            })
        }
        const {idUser,idChannel} = req.body
        const nameChannel = await ChannelSchema.find({
            _id:idChannel,
            menberChannel:idUser
        },{keyChannel:0,messagesChannel:0,__v:0})
        if(nameChannel.length>0){
            return res.status(404).json({
                joinChannel:false,
                message:"user Existente"
            });
        }
        ChannelSchema.findByIdAndUpdate(idChannel,{
            $push:{
                menberChannel:idUser
            }
        },function (err, response) {
            if (err) res.json(response);
            
        })

        res.json({
            channel:true,
            message:"se pudo agregar al channel"
        })
    },
    MessagesChannel:async (req,res)=>{
        const {message,idUser,date,idChannel} = req.body
        ChannelSchema.findByIdAndUpdate(idChannel,{
            $push:{
                messagesChannel:{
                    message,
                    idUser,
                    date
                }
            }
        },(err,usr)=>{
            if(err){console.log(err)}
        })
        res.json({
            messagesChannel:true,
            message:"mensaje guardado"
        })
    },
    getMessagesChannel:async (req,res)=>{
        let {numMessage,idChannel} = req.body
        let Channel = await ChannelSchema.findById(idChannel,{messagesChannel:1})
        const lengthChannel = Channel.messagesChannel.length
        numMessage = numMessage>lengthChannel?lengthChannel:numMessage
        let UserRevisados = {}
        let channelOrdenado = []
        // para "intentar ahorrar recursos" y evitar siempre buscar en la base de datos a usuario que ya fueron buscados crearemos una especie de cache
        Channel = Channel.messagesChannel.slice(lengthChannel-numMessage,lengthChannel)
        for(i=0;i<numMessage;i++){
            let user = Channel[i]
            let idUser = user.idUser
            if(UserRevisados[idUser]){  
                channelOrdenado.push({...user,Perfil:UserRevisados[idUser]})
            }else{
                const userPerfil = await UserSchema.findById(idUser,{name:1,image:1,_id:0})
                UserRevisados[idUser] = userPerfil
                channelOrdenado.push({...user,Perfil:userPerfil})
            }
        }
        channelOrdenado = channelOrdenado.sort((a, b) => new Date(a.date).getTime() > new Date(b.date).getTime())
        res.json({
            Channel:channelOrdenado,
        })
    },
    getChannels:async (req,res)=>{
        const tokenValido = await validateToken(req)
        if(!tokenValido){
            return res.status(401).json({
                session:false,
                message:"No tienes acceso a los grupos de chat"
            })
        }
        const Channel = await ChannelSchema.find({},{nameChannel:1})
        res.json({
            Channel:Channel,
        })
    },
    getMenberChannel:async (req,res)=>{
        const tokenValido = await validateToken(req)
        if(!tokenValido){
            return res.status(401).json({
                session:false,
                message:"No tienes acceso a lo mienbros del canal"
            })
        }
        const {idChannel} = req.body
        const mienbros = await ChannelSchema.findById(idChannel,{menberChannel:1,describChannel:1})

        const obtenerPerfiles = async (lista)=>{
            const perfiles = []
            for(let idMenber in lista){
                try{
                    const perfil =  await UserSchema.findById(lista[idMenber],{name:1,image:1,_id:0})
                    perfiles.push(perfil)
                }catch(err){
                }
            }
            return perfiles
        }
        const perfiles = await obtenerPerfiles(mienbros.menberChannel)
        res.json({mienbros,perfiles:perfiles})
    },
}