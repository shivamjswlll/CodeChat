import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import {Server} from "socket.io";
import http from "http";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import {connection, socketmapper} from "./socket/connection.js";
import { connectDB } from "./lib/db.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { protectRoute } from "./middleware/auth.middleware.js";

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },  
  cookie: true
});

io.use(async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      console.log("No cookie found");
      return next(new Error("No authentication cookie found"));
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies?.jwt;

    if (!token) {
      console.log("No JWT token found in cookies");
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      console.log("JWT verification failed");
      return next(new Error("Invalid token"));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("User not found for token");
      return next(new Error("User not found"));
    }

    socket.user = user;
    next(); // ✅ Proceed to next middleware
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Authentication failed"));
  }
});

connection(io);
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
