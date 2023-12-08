const Post = require('../models/postModal')
const {ObjectId} = require('mongodb')

const config = require('../config/config')
const nodemailer = require('nodemailer')


const sendCommentMail = async (name,email,post_id)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.EmailUser,
                pass:config.emailPassword
            }
        })

        const mailOption = {
            from :config.EmailUser,
            to:email,
            subject:"no-reply",
            html:'<p>Hii, '+name+' has replied on your comment , Please Click here to <a href= " http://127.0.0.1:5000/post/'+ post_id +'">Read Here Your Replies </a>'
        }
        
        transporter.sendMail(mailOption,function(error,info){
            if(error){
                console.log(error)  
            }else{
                console.log("email has been sent :- "+ info.response)
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

const loadBlog = async(req,res) =>{
    try {
        const posts = await Post.find({})
        res.render('blog',{posts:posts})

    } catch (error) {
        console.log(error.message)
    }

}

const loadPost = async (req,res) =>{
    try {
        
        const postdata = await Post.findOne({"_id":req.params.id })
        res.render('post',{post:postdata})

    } catch (error) {
        console.log(error.message)
    }
}

const addComment = async(req,res)=>{
    try {
        
        var post_id = req.body.post_id;
        var username = req.body.username;
        var email = req.body.email;
        var comment = req.body.comment;

        var commentid = new ObjectId()

        await Post.findByIdAndUpdate({ _id:post_id},{
            $push:{
                "comments":{ _id:commentid, username :username,email:email , comment:comment }
            }
        })


        res.status(200).send({ success:true,msg:"Comment added" })

    } catch (error) {

        res.status(200).send({ success:false,msg:error.message })

    }
}

const doreply = async (req,res)=>{
    try {

        const reply_id =  new ObjectId()
        await Post.updateOne({
            "_id": new ObjectId(req.body.post_id),
            "comments._id":new ObjectId(req.body.comment_id),

        },
        {
            $push:{
                "comments.$.replies":{ _id:reply_id, name:req.body.name, reply:req.body.reply }
            }
        })

        sendCommentMail(req.body.name, req.body.comment_email, req.body.post_id)

        res.status(200).send({ success:true,msg:"Replied successful!!" })

    } catch (error) {
        console.log(error.message)
        res.status(200).send({ success:false,msg:error.message })
    }
}



module.exports = {
    loadBlog,
    loadPost,
    addComment,
    doreply,

}