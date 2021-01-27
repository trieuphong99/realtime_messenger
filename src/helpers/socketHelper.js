export let pushSocketIdToArray = (clients, userId, socketId) => {
  if(clients[userId]) {
    clients[userId].push(socketId);
  } else {
    clients[userId] = [socketId];
  }
  return clients;
};

export let removeSocketIdFromArray = (clients, userId, socket) => {
  clients[userId] = clients[userId].filter(socketId => socketId !== socket.id);
  if(!clients[userId].length) {
    delete clients[userId];
  }
  return clients;
};

export let emitNotifyToArray = (clients, emitToId, io, emitResponse, response) => {
  clients[emitToId].forEach((socketId) => {
    io.sockets.connected[socketId].emit(
      emitResponse,
      response
    );
  });
};