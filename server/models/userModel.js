
const {Schema,model} = require("mongoose")

const bcrypt = require("bcryptjs")


const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        default:""
    },
    about:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:"default.jpg"
    }
})

UserSchema.methods.incriptarPassword = async function (password){
    // para poder incripatar
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt) // incriptamos
}
UserSchema.methods.validarPassword = function (password){
    // password es la contraseña que nos dieron.
    // el this.password es el rigistro que tiene la contrase imcriptada
    return bcrypt.compare(password,this.password)
}


module.exports = model("Users",UserSchema)








