const handleJoinRoom = (io, socket, roomIdentity) => {
    socket.join(roomIdentity);

    io.to(roomIdentity).emit("game_can_start");
    setTimeout(() => {
        io.to(roomIdentity).emit("gettingRoomId", {roomId : roomIdentity});
    }, 5000);
}

export default handleJoinRoom