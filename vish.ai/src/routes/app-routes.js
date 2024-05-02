
const express = require('express');
require('dotenv').config()
const http = require('http')
const socketIo = require('socket.io');
const formidableMiddleware = require('express-formidable');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const {
    submitRoute,
    downloadRoute,
    socketRoute,
    routeRoute,
    serverRoute
} = require("../routes")

app.use(express.static(__dirname + '../../public'));
app.use(express.static('public'));
app.use(formidableMiddleware());

io.on('connection', socketRoute);

app.post('/submit', submitRoute);

app.get('/download', downloadRoute);


app.get('/', routeRoute);

if (process.env.PORT) {
    server.listen(process.env.PORT, serverRoute);
} else {
    const PORT = 3000;
    server.listen(PORT, serverRoute);
    console.log(`Server is running on port ${PORT}`);
}