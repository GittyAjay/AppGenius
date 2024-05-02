const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const formidableMiddleware = require('express-formidable');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
// Import routes
const {
    submitRoute,
    downloadRoute,
    routeRoute
} = require("../routes");

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
const twoLevelsUpDir = path.join(__dirname, '..', '..');
const publicDir = path.join(twoLevelsUpDir, 'public');
app.use(express.static(publicDir));

// Parse form data
app.use(formidableMiddleware());

// Socket.IO connection handling
io.on('connection', function socketRoute(socket) {
    console.log('A user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Define routes
app.post('/submit', submitRoute);
app.get('/download', downloadRoute);
app.get('/', routeRoute);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
