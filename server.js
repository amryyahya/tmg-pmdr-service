const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const startCountdown = require('./timer')

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
  socket.on('JoinRoom', (room) => {
    socket.join(room);
    console.log(`${socket.displayName} joined room: ${room}`);
    socket.to(room).emit('message', `User ${socket.displayName} has joined the room`);
  });

  socket.on('SetDisplayName', (displayName) => {
    socket.displayName = displayName;
    console.log(`${socket.id} set their display name to: ${displayName}`);
  });


  socket.on('LeaveRoom', (room) => {
    socket.leave(room);
    console.log(`${socket.displayName} left room: ${room}`);
    socket.to(room).emit('message', `User ${socket.displayName} has left the room`);
  });

  socket.on('SendMessage', ({ room, message }) => {
    console.log(`Message to ${room}: ${message}`);
    io.to(room).emit('message', `${socket.displayName}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.displayName}`);
  });
})
