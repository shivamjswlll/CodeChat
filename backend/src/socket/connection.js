import handleCreateRoom from "./createRoom.js";
import handleJoinRoom from "./joinroom.js";
import handleStartGame from "./startgame.js";

const challenges = [{"Question" : "Two Sum"}, {"Question" : "Three sum"}, {"Question" : "House Robber"}];

const socketmapper = new Map();

const connection = (io) => {
  io.on("connection", (socket) => {

    console.log("New client connected", socket.id); 
    const user_id = socket.user._id.toString();

    socketmapper.set(user_id, socket.id);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });  
    
        /**
     * Create a room
     */
    socket.on("createRoom", ({roomIdentity, opponentId}) => {
      handleCreateRoom(io, socket, roomIdentity, opponentId);
    });

    /**
     * User joins a room 
     * */ 
    socket.on("joinRoom", ({roomIdentity}) => {
      handleJoinRoom(io, socket, roomIdentity);
    });

    /**
     * User leaves a room
     */
    // socket.on("leaveRoom", ({roomIdentity}) => {
    //   handleLeaveRoom(socket, roomIdentity);
    // });

    /**
     * Start the game
     */
    socket.on("startGame", ({roomIdentity}) => {
      handleStartGame(io, roomIdentity, challenges);
    });


    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      socketmapper.delete(user_id);
    });

    socket.on("createChallenge", ({}) => {})
    });
};

export {connection, socketmapper};