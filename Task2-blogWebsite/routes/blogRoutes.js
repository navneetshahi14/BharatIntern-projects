const express = require('express')
const blog_Route = express()

blog_Route.set('view engine','ejs')
blog_Route.set('views','./views')

blog_Route.use(express.static('public'))

const blogcontroller = require('../controllers/blogController')

blog_Route.get('/',blogcontroller.loadBlog)
blog_Route.get('/post/:id',blogcontroller.loadPost)

blog_Route.post('/add-comment',blogcontroller.addComment)

blog_Route.post('/do-reply',blogcontroller.doreply)


module.exports = blog_Route