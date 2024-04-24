const app = express()
const express = require('express')
const formidableMiddleware = require('express-formidable')
const http = require('http')
const path = require('path')
const { PORT } = require("../config/app-confidential")
const server = http.createServer(app)
const io = socketIo(server)

io.on('connection', (socket) => {
  console.log('A user connected')
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.use(express.static(__dirname + '/public'))

app.use(formidableMiddleware())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
