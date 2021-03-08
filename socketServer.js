const http = require('http');
const socketIO = require('socket.io');

module.exports = (app) => {
  const server = http.Server(app);
  const io = socketIO(server);
  let rooms = {};
  io.on('connection', (socket) => {
    const isCreatedRoom = roomName => {
      return typeof rooms[roomName] === 'number';
    }

    socket.on('getRoomList', () => {
      io.sockets.emit('roomList', rooms);
    });

    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
      if(isCreatedRoom(roomName)) {
        if(rooms[roomName] === 1) {
          rooms[roomName] = 2;
          console.log('222');
          io.sockets.emit('updatedRoom', rooms[roomName]);
          socket.emit('joinedRoom', roomName);
          io.sockets.in(roomName).emit('joined', 'join!!');
        } else {
          socket.emit('full', roomName);
        }
      } else {
        rooms[roomName] = 1;
        io.sockets.emit('createdRoom', roomName);
        socket.emit('joinedRoom', roomName);
      }
    });

    socket.on('leaveRoom', roomName => {
      if(isCreatedRoom(roomName)) {
        socket.leave(roomName);
        if(rooms[roomName]) {
          rooms[roomName] -= 1;
          io.sockets.emit('updatedRoom', rooms[roomName]);
        } else {
          delete rooms[roomName];
          io.sockets.emit('deletedRoom', roomName);
        }
      }
    })
  });
  
  server.listen(4000, () => {
    console.log('[socket] listen server');
  })
}