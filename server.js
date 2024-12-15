const express = require('express');
const socketio = require('socket.io');
const path = require('path');


const app = express();
app.use(express.static(path.resolve(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

const server = app.listen(1337, () => {
    console.log('Server running!')
});

const io = socketio(server)

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.on('message', (data) => {
      console.log(`New message from ${socket.id}: ${data}`);
    })
})
