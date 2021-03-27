const express = require('express')
const bodyParser = require('body-parser');
const posts = require("./posts.controller.js");
var cors = require('cors')
const app = express()
const port = 3000
app.use(bodyParser.json());
app.use(cors())

app.get('/posts', async (req, res) => {
    res.json({
        code: 0, message: 'success', data: {
            user: await posts.getUser(),
            posts: await posts.getPosts()
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})