require("dotenv").config()

const UserSchema = require("../models/userModel")
const swt = require("jsonwebtoken")
const validateToken = require("./validate.controlles")


module.exports = {
    CreateSession:async (req,res)=>{
        const {name,email,password} = req.body
        const user = new UserSchema({name,email,password})
        // buscamos el usuario atravez del email
        const emailUser = await UserSchema.findOne({email})
        // si existe un usuario en la db para no tener dos cuentas iguales
        if(emailUser){
            return res.status(404).json({session:false,message:"Usuario existente"});
        }
        // guardaremos con la contraseña incriptada para mas seguridad
        user.password = await user.incriptarPassword(user.password)
        // gurdamos los datos en la db
        await user.save()
        // creamos token
        const token = swt.sign({id:user._id},process.env.GENERATE_TOKEN_SECRET,{
            expiresIn:60*60*12
        })
        // retornamo el token para que lo guarde y validar que todo esta correcto
        res.json({
            session:true,
            token
        })
    },
    StartSession:async (req,res)=>{
        const {email,password} = req.body
        // buscamos el usuario atravez del email
        const emailUser = await UserSchema.findOne({email})
        // si no encontro el usuario en la db
        if(!emailUser){
            return res.status(404).json({session:false,message:"Usuario no encontrado"});
        }
        // validar con la contraseña que me dio y la original
        const validate = await emailUser.validarPassword(password)
        if(!validate){
            return res.status(401).json({session:false,message:"Contraseña incorrecta"});
        }
        const token = swt.sign({id:emailUser._id},process.env.GENERATE_TOKEN_SECRET,{
            expiresIn:60*60*12
        })
        res.json({session:true,token})
    },
    MeSession:async (req,res)=>{
        // validemos que el token es correcto desde el Header
        const tokenValido = await validateToken(req)
        if(!tokenValido){
            return res.status(401).json({
                session:false,
                message:"No tienes acceso",
                user:tokenValido
            })
        }
        return res.json({
            session:true,
            message:"Tienes acceso",
            user:tokenValido
        })
    },
    EditSession:async (req,res)=>{
        const tokenValido = await validateToken(req)
        const photo = req.file?req.file.filename:tokenValido.image
        const {name,email,phone,about} = req.body
        UserSchema.findByIdAndUpdate(tokenValido._id,{
            name:name?name:tokenValido.name,
            email:email?email:tokenValido.email,
            phone:phone?phone:tokenValido.phone,
            about:about?about:tokenValido.about,
            image:photo
        },(err,usr)=>{
            if(err){
                console.log(err)
            }
        })
        res.redirect("http://localhost:3000/Me")
    },
    ValidateToken:async (req,res)=>{
        const tokenValido = await validateToken(req)
        if(!tokenValido){
            return res.status(401).json({
                session:false,
                message:"No tienes acceso"
            })
        }
        return res.json({
            session:true,
            message:"Tienes acceso"
        })
    }
}