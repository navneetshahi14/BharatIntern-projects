const mongoose = require('mongoose')
const mongooseUri ="mongodb://0.0.0.0:27017/BlogWebsite"

mongoose.connect(mongooseUri)
let db = mongoose.connection

const express = require('express')
const app = express()



const isblog = require('./middleware/isBlog')

app.use(isblog.isBlog)

// for admin route
const adminRoutes = require('./routes/adminRoute')
app.use('/',adminRoutes)

// for user route
const UserRoute = require('./routes/UserRoutes')
app.use('/',UserRoute)

// for user route
const blogRoutes = require('./routes/blogRoutes')
app.use('/',blogRoutes)

// io.on("connection",function(socket){
//     console.log("User Connected")

//     socket.on("new_post",function(formData){
//         console.log(formData)
//         socket.broadcast.emit("new_post",formData)
//     })

// })

// http.listen(5000,()=>{
//     console.log('PortNo. 5000')
// })


app.listen(5000,()=>{
    console.log('PortNo. 5000')
})