const blogSetting = require('../models/BlogSettingmodel')

const isBlog = async (req,res,next) =>{
    try{
        const BlogSet = await blogSetting.find({})
        if(BlogSet.length == 0 && req.originalUrl != "/blog-setup"){
            res.redirect('/blog-setup')
        }
        else{
            next();
        }
    }catch(error){
        console.log(error.message)
    }
}

module.exports = {
    isBlog
}