import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { authenticationRouter } from "./Routes/Authentication.js";
import { validateUser } from "./middlewares/AuthenticationMiddleware.js";
import { validateToken } from "./jwtUtils/jwtUtils.js";
import { nanoid } from "nanoid";
import { RoomModel } from "./db_schemas/chat.js";
import "web-streams-polyfill/dist/polyfill.es6.js";
import session from "express-session";
import Keycloak from "keycloak-connect";
import keycloakConfig from "./config/keycloak-config.js";
import axios from "axios";
dotenv.config();

const app = express();
import { Server } from "socket.io";
import { chatBot } from "./AIBot/index.js";
const socketServer = new Server(8080, {
  cors: {
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  },
});

const chatIo = socketServer.of("/chat");

const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: "Zephyr78#*",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

const keycloak = new Keycloak(
  {
    store: memoryStore,
  },
  keycloakConfig
);

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

var router = express.Router();
var unprotectedRouter = express.Router();

app.use("/api", keycloak.protect(), router);

// chatIo.use((socket, next) => {
//   const token = socket.handshake.auth.token;

//   if (!token) {
//     next(new Error("token is missing"));
//     return;
//   }
//   console.log(token);

//     const userDetails = validateToken(token);
//     if (!userDetails) {
//       next(new Error("invalid token"));
//       return;
//     }

//     socket.userEmail = userDetails.userEmail;
//     socket.userName = userDetails.userName;
//     next();
// });

chatIo.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Token is missing"));
  }

  // Validate the token using Keycloak's introspection endpoint
  axios
    .post(
      "http://localhost:9080/realms/executors/protocol/openid-connect/token/introspect",
      `token=${token}&client_id=web-app&client_secret=nN4255uRanMQycVg2tEOUCiAqg1mPlez`
    )
    .then((response) => {
      const introspectionResult = response.data;

      if (!introspectionResult.active) {
        return next(new Error("Invalid token"));
      }

      const userDetails = introspectionResult;

      socket.userEmail = userDetails.email;
      socket.userName = userDetails.preferred_username;
      socket.location = userDetails.Location;
      console.log(response.data);

      next();
    })
    .catch((error) => {
      console.error("Error validating token:", error);
      next(new Error("Error validating token"));
    });
});

app.use(cors());
app.use(express.json());
const port = 5000;
mongoose
  .connect(process.env.mongodb_connection_url)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

chatIo.on("connection", (socket) => {
  socket.on("sendMessage", async (message, roomId, acknowledge) => {
    try {
      const response = await chatBot.getChatAgentResponse(message, roomId);
      const new_chatbot_message = {
        type: "ai",
        data: { content: response.output },
      };
      console.log("sending the response ");
      console.log(new_chatbot_message);
      chatIo.to(roomId).emit("recieveMessage", new_chatbot_message);
    } catch (error) {
      acknowledge(
        null,
        new Error("Internal server error unable to send the message")
      );
    }
  });

  socket.on("createRoom", async (roomName, acknowledge) => {
    const chatId = nanoid(15);
    const { userName, userEmail } = socket;

    const new_room = {
      roomId: chatId,
      roomName: roomName,
      userEmail: userEmail,
      users: [userName],
      chats: [],
    };

    const room = await RoomModel.create(new_room);
    if (room) {
      acknowledge({ roomId: room.roomId, roomName: room.roomName }, null);
    } else {
      acknowledge(null, new Error("unable to create a room"));
    }
  });

  socket.on("getMessagesofRoom", async (roomId, acknowledge) => {
    try {
      const rooms = await RoomModel.findOne({
        roomId: roomId,
        users: {
          $in: [socket.userName],
        },
      });
      if (rooms) {
        socket.join(roomId);
        console.log("Joined the room ", roomId);
        acknowledge(rooms.messages, null);
        return;
      } else {
        acknowledge([], null);
      }
    } catch {
      acknowledge(null, new Error("cannot fetch the messages"));
    }
  });

  socket.on("joinRoom", async (roomId, acknowledge) => {
    const resultRoom = await RoomModel.findOne({ roomId: roomId });
    if (resultRoom) {
      const updatedRoom = await RoomModel.findByIdAndUpdate(resultRoom._id, {
        $push: { users: socket.userName },
      });
      if (updatedRoom) {
        acknowledge(
          {
            roomId: updatedRoom.roomId,
            roomName: updatedRoom.roomName,
          },
          null
        );
      } else {
        acknowledge(null, new Error("unable to join the Room"));
      }
    }
  });

  socket.on("getRoomsByUserName", async (acknowledge) => {
    try {
      const result = await RoomModel.find({
        users: { $in: [socket.userName] },
      });
      if (result) {
        const rooms = result.map((room) => {
          return {
            roomId: room.roomId,
            roomName: room.roomName,
          };
        });
        acknowledge(rooms, null);
      } else {
        acknowledge([], null);
      }
    } catch {
      acknowledge(null, new Error("cannot fetch the previous chats"));
    }
  });
});

app.use("/authentication", authenticationRouter);

app.use("/istokenvalid", (req, res) => {
  console.log("validating the token");
  const authHeader = req.header("authorization");
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    res.status(403).json({ authenticated: false });
    return;
  }
  if (!!validateToken(token)) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

app.get("/", validateUser, (req, res) => {
  res.status(200).send("welcome");
});

app.listen(port, (err) => {
  if (!err) {
    console.log(`server has started on port http://localhost:${port}`);
  } else {
    console.log(`server has failed to start`);
  }
});
