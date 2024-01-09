
const {Server} = require("socket.io")
const UserSchema = require("../models/userModel")

// para abandonar todas las salas para que este solo en una
function leaveAllRooms(socket) {
    socket.rooms.forEach(room => {
        socket.leave(room);
    });
}
const conexionSocket = (server)=>{
    const io = new Server(server,{
        cors:{
            origin:"http://localhost:3000",
            methods:["GET","POST"]
        }
    })
    io.on("connection",(socket)=>{
        socket.on("conexion:conectarChannel",({channel,idUser})=>{
            leaveAllRooms(socket)
            socket.join(channel)
        }) // evento al conectar a un canal


        async function PerfilUser ({message,channel,idUser,fecha}){
            const userPerfil = await UserSchema.findById(idUser,{name:1,image:1,_id:0})
            const mensaje = {
                Perfil:userPerfil,
                date:fecha,
                message:message
            }
            socket.to(channel).emit("message:recibirMessage",{mensaje})
        }

        socket.on("mensaje:enviarMessage",PerfilUser) // evento al enviar un mensaje a un canal
    })
}



module.exports = conexionSocket




