import { socketmapper } from "./connection.js";

const handleCreateRoom = (io, socket, roomIdentity, opponentId) => {
  console.log(roomIdentity, opponentId);

  let opponentSocketId = socketmapper.get(opponentId);
  

  if (!opponentSocketId) {
    io.to(socket.id).emit("createRoomFailed", {
      message: "opponent is not on game server",
    });
  }

  console.log(opponentSocketId);

  socket.join(roomIdentity);
  io.to(roomIdentity).emit("roomCreated", {
    message: `You have created room ${roomIdentity}`,
  });
  
  io.to(opponentSocketId).emit("incomingChallenge", {
    roomIdentity: roomIdentity,
  });
};

export default handleCreateRoom;