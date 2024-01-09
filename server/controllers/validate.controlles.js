const UserSchema = require("../models/userModel")
const swt = require("jsonwebtoken")
require("dotenv").config()

validateToken = async (req)=>{
    const token = req.headers["x-access-token"] || req.body.token
    if(!token) return false
    try{
        const decodedToken = await swt.verify(token,process.env.GENERATE_TOKEN_SECRET)
        const user = await UserSchema.findById(decodedToken.id,{password:0,__v:0})
        if(!user) return false
        return user
    }
    catch(e){
        return false
    }

}
module.exports = validateToken







