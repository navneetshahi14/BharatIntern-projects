const mongoose = require('mongoose')
const mongooseUri = "mongodb://0.0.0.0:27017/BharatIntern"

const mongooseConnection = () => {
    mongoose.connect(mongooseUri)
    const db = mongoose.connection
    db.on('error',()=>console.log('error'))
    db.once('open',() => console.log('Database Connected'))
}

module.exports = mongooseConnection