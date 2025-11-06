// const {match_details} = require("../config/store.js");

const handleStartGame = async (io, roomIdentity, challenges) => {
//   console.log(io.sockets.adapter.rooms);

//   const usersSet = await io.to(roomIdentity).allSockets(); // ✅ await here
//   const users = Array.from(usersSet);

//   const score = users.reduce((acc, userId) => {
//     acc[userId] = 0;
//     return acc;
//   }, {});

//   match_details.set(roomIdentity, score);

//   io.to(roomIdentity).emit("game_details", {
//     "challenge": challenges[0],
//     "currentIndex": 0,
//     "score" : score
//   });
    io.to(roomIdentity).emit("game_started", {
        "message" : "Game has started",
        "question" : challenges
    });
};

export default handleStartGame;