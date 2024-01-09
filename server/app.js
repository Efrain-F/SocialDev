const express = require('express');

const cors = require("cors")

const app= express()
// Midelware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const listaWebs = ["http://localhost:3000"]
app.use(express.static("imagenesPerfil"))

app.use(cors({origin:listaWebs}))

// Routers
const sessionRouter = require("./routers/sessionRouter")
const channelChatRouter = require("./routers/channelChatRouter")

app.use(sessionRouter)
app.use(channelChatRouter)

module.exports = app
