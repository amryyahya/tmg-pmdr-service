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
const rooms = {};

io.on('connection', (socket) => {
  socket.on('JoinRoom', (room) => {
    socket.join(room);
    console.log(`${socket.displayName} joined room: ${room}`);
    socket.to(room).emit('message', {displayName:socket.displayName, message:"has joined the room"});
    if (!rooms[room]) {
      rooms[room] = {
        remainingTime: 1000,  // Initial timer value in seconds
        isRunning: false,
        lastUpdated: Date.now(),
      };
      if (!rooms[room].host){
        rooms[room].host = socket.id
      }
    } else {
      const elapsedTime = Math.floor((Date.now() - rooms[room].lastUpdated) / 1000);
      rooms[room].remainingTime -= elapsedTime; 
    }
    socket.emit("updateTimer", rooms[room]);
  });

  socket.on("startTimer", (room) => {
    if (rooms[room] && !rooms[room].isRunning) {
      rooms[room].isRunning = true;
      rooms[room].lastUpdated = Date.now();

      io.to(room).emit("updateTimer", rooms[room]); // Notify all in the room
    }
  });

  socket.on("pauseTimer", (room) => {
    if (rooms[room] && rooms[room].isRunning) {
      const elapsedTime = Math.floor((Date.now() - rooms[room].lastUpdated) / 1000);
      rooms[room].remainingTime -= elapsedTime;
      rooms[room].isRunning = false;
      rooms[room].lastUpdated = Date.now();

      io.to(room).emit("updateTimer", rooms[room]); // Notify all in the room
    }
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
    io.to(room).emit('message', {displayName:socket.displayName, message:message});
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.displayName}`);
  });
})
