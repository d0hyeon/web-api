const http = require('http');
const socketIO = require('socket.io');

module.exports = (app) => {
  const server = http.Server(app);
  const io = socketIO(server);
  let countInRooms = {};
  io.on('connection', (socket) => {
    const isCreatedRoom = roomName => {
      return typeof countInRooms[roomName] === 'number';
    }

    socket.on('message', (message) => {
      socket.broadcast.emit('message', message);
    })

    socket.on('getRoomList', () => {
      io.sockets.emit('roomList', countInRooms);
    });

    socket.on('createRoom', (roomName) => {
      countInRooms[roomName] = 0;
      io.sockets.emit('createdRoom', roomName);
    });

    socket.on('joinRoom', (roomName) => {
      if(isCreatedRoom(roomName)) {
        if(countInRooms[roomName] < 2) {
          io.sockets.in(roomName).emit('joinedClient');
          socket.join(roomName);
          countInRooms[roomName] += 1;
          io.sockets.emit('updatedRoom', {[roomName]: countInRooms[roomName]});
          socket.emit('joinedRoom', roomName);
        } else {
          socket.emit('full', roomName);
        }
      }
    });
    
    socket.on('ready', () => {
      socket.broadcast.emit('readyClient');
    })

    socket.on('leaveRoom', roomName => {
      if(isCreatedRoom(roomName)) {
        socket.leave(roomName);
        io.to(roomName).emit('leavedClient');
        if(countInRooms[roomName] > 1) {
          countInRooms[roomName] -= 1;
          io.sockets.emit('updatedRoom', {[roomName]: countInRooms[roomName]});
        } else {
          delete countInRooms[roomName];
          io.sockets.emit('deletedRoom', roomName);
        }
      }
    })
  });
  
  server.listen(4000, () => {
    console.log('[socket] listen server');
  })
}