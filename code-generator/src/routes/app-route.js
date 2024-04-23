const express = require('express')
const path = require('path')
const http = require('http')
const formidableMiddleware = require('express-formidable')
const app = express()
const server = http.createServer(app)
const{PORT}=require("../config/app-confidential")
app.use(express.static(__dirname + '/public'))

app.use(formidableMiddleware())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

server.listen(PORT, () => {
  console.log('Server is running on port 3000')
})
