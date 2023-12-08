const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
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
    is_admin:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:""
    }
})

const User = mongoose.model('users',UserSchema)
module.exports = User