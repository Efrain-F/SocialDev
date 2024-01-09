
const sessionRouter = require("express").Router()
// CONTROLES
const {CreateSession,StartSession,MeSession,EditSession} = require("../controllers/session.controller") 

const multer = require("multer")

//const upload = multer({dest:"imagenesPerfil/"})
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"imagenesPerfil")
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})

// crear cuanta
sessionRouter.post("/signup",CreateSession)
// iniciar session
sessionRouter.post("/signin",StartSession)
// editar perfil del usuario
sessionRouter.post("/editSession",upload.single("image"),EditSession)
// validar si el token es correcto
sessionRouter.post("/validateToken",MeSession)
// obtener informacion del usuario
sessionRouter.get("/getUser",MeSession)

module.exports = sessionRouter;


