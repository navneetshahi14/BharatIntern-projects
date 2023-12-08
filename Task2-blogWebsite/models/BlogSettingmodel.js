const mongoose = require('mongoose')

const BlogSettingSchema = new mongoose.Schema({
    blog_title:{
        type:String,
        required:true
    },
    blog_logo:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const BlogSetting = mongoose.model('BlogSetting',BlogSettingSchema)
module.exports = BlogSetting