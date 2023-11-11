const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const User = require('./models/User')
const mongoose = require('mongoose')
const mongooseUri = "mongodb://0.0.0.0:27017/BharatIntern"

mongoose.connect(mongooseUri)
const db = mongoose.connection;
db.on('error',()=>console.log('error'))
db.once('open',()=>console.log('database connected'))

staticPath = path.join('./public')
app.use(express.static(staticPath))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true 
}))

app.listen(5000,()=>console.log('portNo. at 5000'))

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.get('/signup',(req,res)=>{
    res.sendFile('./public/index.html',{root:__dirname})
})

app.post('/signup',async (req,res)=>{
    try {
        const bodyData={
            "name":req.body.name,
            "email":req.body.email,
            "password":req.body.password,
            "PhoneNumber":req.body.PhoneNumber
        }

        const email = req.body.email;

        const userCheck = await db.collection('users').findOne({email:email})
        const data = new User(bodyData)
        if(userCheck){
            console.log('user exists')
            return res.redirect('/exist')
        }
        else{
            await db.collection('users').insertOne(data,(err,collection)=>{
                console.log('signup successfull')
            })
            return res.redirect('/successful')
        }

        
    } catch (error) {
        console.error('error')
    }
    return res.redirect('/')
})

app.get('/exist',(req,res)=>{
    res.sendFile('./public/userExist.html',{root:__dirname})

})

app.get('/successful',(req,res)=>{
    res.sendFile('./public/successful.html',{root:__dirname})
})