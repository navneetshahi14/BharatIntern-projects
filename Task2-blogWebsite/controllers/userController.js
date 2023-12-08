const BlogSetting = require('../models/BlogSettingmodel')
const Usermodels = require('../models/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
const config = require('../config/config')
const adminController = require('./adminController')


const sendReset = async (name,email,token) =>{
    try{

        const transport = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.EmailUser,
                pass:config.emailPassword
            }
        })
        
        const mailoption = {
            from : config.EmailUser,
            to:email,
            subject:"reset password",
            html:'<p>Hii, '+name+', Please Click here to <a href="http://127.0.0.1:5000/reset-password?token='+token+'">Reset</a> your password'
        }
        transport.sendMail(mailoption,function(error,info){
            if(error){
                console.log(error)
            }
            else{
                console.log("email has been send - ", info.response)
            }
        })

    }catch(error){
        console.log(error.message)
    }
}


const loadLogin = async(req,res) =>{
    try {
        
        res.render('login')

    } catch (error) {
        console.log(error.message)
    }
}

const verifyLogin = async (req,res) => {
    try{
        
        const email = req.body.email;
        const password = req.body.password
        
        const userData = await Usermodels.findOne({email:email})

        if(userData){
            
            const passmatch = await bcrypt.compare(password,userData.password)

            if(passmatch){
                req.session.user_id = userData._id
                req.session.is_admin = userData.is_admin
                
                if(userData.is_admin == 1){
                    res.redirect('/dashboard')
                }else{
                    res.redirect('/profile')
                }

            }else{
                res.render('login',{message:"Email and password is incorrect"})
            }

        }else{
            res.render('login',{message:"Email and password is incorrect"})
        }

    }catch(error){
        console.log(error.message)
    }
}

const profile = async (req,res)=>{
    res.send('hello profile')
}

const Logout = async (req,res) =>{
    try {

        req.session.destroy()
        res.redirect('/login')

    } catch (error) {
        console.log(error.message)
    }
}

const forgetLoad = async (req,res) =>{
    try {
        
        res.render('forget-password')

    } catch (error) {
        console.log(error.message)
    }
}

const forgetpasswordVerifed = async (req,res) =>{
    try{
        const email = req.body.email;
        const userData = await Usermodels.findOne({email:email})
        if(userData){

            const randomString = randomstring.generate()

            await Usermodels.updateOne({email:email}, {$set:{token:randomString}})
            sendReset(userData.name,userData.email,randomString)

            res.render('forget-password',{message: "pls check your mail check your password"})

        }else{
            res.render('forget-password',{ message : "User Email is incorrect" })
        }
    }catch(error){
        console.log(error.message)
    }
}

const resetPasswordLoad = async (req,res) => {
    try{

        const token = req.query.token;
        const tokendata = await Usermodels.findOne({ token:token })

        if(tokendata){

            res.render('reset-password', {user_id:tokendata._id})
        }else{
            res.render("404")
        }

    }catch(error){
        console.log(error.message)
    }
}

const resetPassword = async (req,res)=>{
    try {
        
        const password = req.body.password
        const user_id = req.body.user_id;

        const securePassword = await adminController.securePassword(password)
        await Usermodels.findByIdAndUpdate({_id:user_id},{$set:{password:securePassword, token:""}})
        
        res.redirect('/login')

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = ({
    loadLogin,
    verifyLogin,
    profile,
    Logout,
    forgetLoad,
    forgetpasswordVerifed,
    resetPasswordLoad,
    resetPassword,
})