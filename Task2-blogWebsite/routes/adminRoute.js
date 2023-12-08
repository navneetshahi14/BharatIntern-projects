const express = require('express')
const admin_Router = express()
const bodyParser = require('body-parser')
admin_Router.use(bodyParser.json())
admin_Router.use(bodyParser.urlencoded({extended:true}))

admin_Router.set('view engine','ejs')
admin_Router.set('views','./views')
const multer = require('multer')
const path = require('path')

const session = require('express-session')
const config = require('../config/config')

admin_Router.use(session({
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}))

const intial_path = path.join(__dirname,'../public/images')
admin_Router.use(express.static('public'))


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,intial_path)
    },
    filename:function(req,file,cb) {    
        const name = Date.now()+"-"+file.originalname
        cb(null,name)
    }
})

const upload = multer({storage:storage})

const adminController = require("../controllers/adminController")
const adminLogAuth = require('../middleware/AdminLoginAuth')

admin_Router.get('/blog-setup',adminController.BlogSetup)
admin_Router.post('/blog-setup',upload.single('blog_image'),adminController.BlogSetupSave)
admin_Router.get('/dashboard',adminLogAuth.isLogin,adminController.dashboard)

admin_Router.get('/create-post',adminLogAuth.isLogin,adminController.loadPostDashboard)
admin_Router.post('/create-post',adminLogAuth.isLogin,adminController.addPost)

admin_Router.post("/upload-post-image",upload.single('image'),adminLogAuth.isLogin,adminController.uploadpostimage)

admin_Router.post('/Delete-Post',adminLogAuth.isLogin,adminController.Deletepost)

admin_Router.get('/edit-post/:id',adminLogAuth.isLogin,adminController.loadEditPost)

admin_Router.post('/update-post',adminLogAuth.isLogin,adminController.updatePost)

module.exports = admin_Router