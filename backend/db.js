const mongoose = require("mongoose")
require("dotenv").config()

let connectToDb = async () =>{
    try{
        await mongoose.connect(process.env.URI)
        console.log("Connected to Database Successfully..!!")
    }catch(err){
        console.log(err)
    }
}

let isConnected = () =>{
    return mongoose.connection.readyState == 1? true : false
}

module.exports = {
    connectToDb , isConnected
}