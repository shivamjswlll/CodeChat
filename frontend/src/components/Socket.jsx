import React from 'react';
import {io} from 'socket.io-client';


// Connect to your backend WebSocket server
// Make sure your backend is running on this URL
const socket = io("http://localhost:5001", {
    withCredentials: true
//   transports: ["websocket"],
//   auth: { token: localStorage.getItem("jwt")},
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("Message", ({message}) => {
  console.log(message);
})

export {socket};


function Socket() {
  return (
    <div>Socket</div>
  )
}

export default Socket