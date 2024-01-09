// variables de entorno
require("dotenv").config()
// conectarte a la base de datos
require("./db/database")

const conexionSocket = require("./socketCon")

const app = require("./app")

app.set("port",process.env.PORT||4000)

const server = require("http").Server(app)

async function startApp(){
    // servidor escucha en el puerto designado
    await server.listen(app.get("port"),()=>{
        console.log("servidor iniciado")
    })
    // funcion donde alamacenamos los la funcionalidad del socket
    conexionSocket(server)
}

startApp()





