import React from 'react';
import { socket } from '../components/Socket';
import { useState } from 'react';

function Challenges() {

  const [room, setRoom] = useState(null);

  socket.on("gettingRoomId", ({roomId}) => {
    console.log(`Room id = ${roomId}`);
    setRoom(roomId);
  });

  socket.on("game_started", ({message, question}) => {
    console.log(message);
    console.log(question);
  })

  const handleStartGame = () => {
    console.log("Start Game button clicked")
    socket.emit("startGame", {
      "roomIdentity" : room
    })
  }

  return (
    <div>
      Challenges
      {room ? <button onClick={handleStartGame}>Start Game</button> : <p>No Challenges</p>}
    </div>
  )
}

export default Challenges;