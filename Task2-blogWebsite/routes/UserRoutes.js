const express = require('express')
const user_Router = express()
const session = require('express-session')

const bodyParser = require('body-parser')
user_Router.use(bodyParser.json())
user_Router.use(bodyParser.urlencoded({extended:true}))

const config = require('../config/config')

user_Router.use(session({
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}))


user_Router.set('view engine','ejs')
user_Router.set('views','./views')
const path = require('path')

const intial_path = path.join(__dirname,'../public/images')
user_Router.use(express.static('public'))

const userController = require('../controllers/userController')
const adminLogAuth = require('../middleware/AdminLoginAuth')

user_Router.get('/login',adminLogAuth.isLogout,userController.loadLogin)
user_Router.post('/login',userController.verifyLogin)

user_Router.get('/logout',adminLogAuth.isLogin,userController.Logout)


user_Router.get('/profile',userController.profile)

user_Router.get('/forget-password',adminLogAuth.isLogout,userController.forgetLoad)
user_Router.post('/forget-password',userController.forgetpasswordVerifed)

user_Router.get('/reset-password',adminLogAuth.isLogout,userController.resetPasswordLoad)
user_Router.post('/reset-password',userController.resetPassword)

module.exports = user_Router