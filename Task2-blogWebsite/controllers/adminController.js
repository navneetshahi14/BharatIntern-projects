const BlogSetting = require('../models/BlogSettingmodel')
const Usermodels = require('../models/userModel')
const bcrypt = require('bcrypt')
const Post = require('../models/postModal')

const securePassword = async(password) => {
    try {
        
        const passwordhash = await bcrypt.hash(password,10)
        return passwordhash

    } catch (error) {
        
    }
}


const BlogSetup = async(req,res) =>{
    try {
        var blogSetting = await BlogSetting.find({})

        if(blogSetting.length >0){
            res.redirect('/login')
        }
        else{
            res.render('blogsetup')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const BlogSetupSave = async(req,res) => {
    try {
        const blog_title = req.body.blog_title
        const blog_image = req.file.filename
        const description = req.body.description
        const name = req.body.name
        const email = req.body.email
        const password = await securePassword(req.body.password)

        const blogSetting = new BlogSetting({
            blog_title : blog_title,
            blog_logo : blog_image,
            description : description
        })

        await blogSetting.save()

        const user = new Usermodels({
            name:name,
            email:email,
            password:password,
            is_admin:1
        })
        const userData = await user.save()
        if(userData){
            res.redirect('/login')
        }
        else{
            res.redirect('blogstep',{message:'Blog not setup properly'}) 
        }

    } catch (error) {
        console.log(error.message)
    }
}

const dashboard = async (req,res) =>{
    try{

        const allPost = await Post.find({})
        res.render('admin/dashboard',{posts:allPost})
    }catch(error){
        console.log(error.message)
    }
}

const loadPostDashboard = async (req,res) =>{
    try {
        res.render('admin/postDashboard');
    } catch (error) {
        console.log(error.message)
    }
}

const addPost = async (req,res) =>{
    try {
        
        var image =""

        if(req.body.image !== undefined){
            image = req.body.image
        }

        const post = new Post({
            title:req.body.Title,
            content:req.body.Content,
            image:image

        })

        const postData = await post.save()

        // res.send({ success:true,msg:"post added successfully"})

        res.render('admin/postDashboard',{message:"post added successfully"})

    } catch (error) {
        res.send({success:false,msg:error.message})
    }
}


const uploadpostimage = async(req,res)=>{
    try {
        
        let imagePath = "/images"
        imagePath  = imagePath+'/'+req.file.filename
        res.send({success:true,msg:"image upload successfully",path:imagePath})

    } catch (error) {
        console.log(error.message)
        res.send({success:false,msg:error.message})
    }
}

const Deletepost = async (req,res) =>{
    try {

        await Post.deleteOne({_id:req.body.id})
        res.status(200).send({success:true,msg:"post deleted successfully"})
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

const loadEditPost = async(req,res) =>{
    try{

        const postData = await Post.findOne({_id:req.params.id})

        res.render("admin/editPost",{ post: postData})
        
    }catch(error){
        console.log(error.message)
    }
}

const updatePost = async (req,res) =>{
    try {

        await Post.findByIdAndUpdate({_id:req.body.id},{
            $set:{
                title:req.body.Title,
                content:req.body.Content,
                image:req.body.image
            }
        })

        res.status(200).send({success:true,msg:"post updated successfully!!!"})
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}

module.exports = {
    BlogSetup,
    BlogSetupSave,
    dashboard,
    loadPostDashboard,
    addPost,
    securePassword,
    uploadpostimage,
    Deletepost,
    loadEditPost,
    updatePost,


}