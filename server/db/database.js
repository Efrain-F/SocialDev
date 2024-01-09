const mongoose = require("mongoose")


const MongoDb_URL = "mongodb://localhost:27017/projectSession"

mongoose.connect(MongoDb_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(db=>{
    console.log("base de datos conectado")
})

