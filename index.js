// require('dotenv').config();
// const mongoose = require('mongoose');
// const { connectToDatabase } = require('./config');
// const app = require('./src/app');
// const scripts = require('./src/scripts');

// const { PORT, BASE_URL } = process.env;

// (async () => {
//   try {
//     console.log('Initializing server');
//     await connectToDatabase();
//     await scripts();
//     app.listen(PORT, () => console.log(`Server is running on ${BASE_URL}`)).on('error', shutdown);
//   } catch (error) {
//     shutdown(error);
//   }
// })();

// async function shutdown(err) {
//   console.log('Unable to initialize the server:', err.message);
//   await mongoose.connection.close();
//   process.exit(1);
// }

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

require("dotenv").config();
const mongoose = require("mongoose");
const { connectToDatabase } = require("./config");
const app = require("./src/app");
const http = require("http");
const Message = require("./src/models/message");
const {
  sendMessage,
  editMessage,
  deleteForEveryone,
  deleteForMe,
} = require("./src/utils/messagingOperations");
const { Server } = require("socket.io");

const { PORT, BASE_URL } = process.env;

let server;

(async () => {
  try {
    console.log("Initializing server");
    await connectToDatabase();

    // Create an HTTP server
    server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "*", // add frontend url here
        methods: ["GET", "POST"],
      },
    });

    const users = {};

    // Handle Socket.IO connections
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("join", (userId) => {
        if (userId) {
          users[userId] = socket.id;
          console.log(`User with ID ${userId} joined`);
        }
      });

      // Handling sending a new message
      socket.on("sendMessage", async (data) => {
        const { senderId, recipientId, messageText } = data;
        const message = await sendMessage(senderId, recipientId, messageText);

        // Emit the message to the recipient if they are online
        if (users[recipientId]) {
          io.to(users[recipientId]).emit("newMessage", message);
        }
      });

      // Handle message edit
      socket.on("editMessage", async (data) => {
        const { messageId, newMessageText, senderId } = data;
        const updatedMessage = await editMessage(
          messageId,
          newMessageText,
          senderId
        );

        // Emit the edited message to both participants
        if (users[updatedMessage.recipient]) {
          io.to(users[updatedMessage.recipient]).emit(
            "messageEdited",
            updatedMessage
          );
        }
        if (users[updatedMessage.sender]) {
          io.to(users[updatedMessage.sender]).emit(
            "messageEdited",
            updatedMessage
          );
        }
      });

      // Handle delete for everyone
      socket.on("deleteForEveryone", async (data) => {
        const { messageId, userId } = data;
        const message = await deleteForEveryone(messageId, userId);

        // Emit the delete event to both participants
        if (users[message.recipient]) {
          io.to(users[message.recipient]).emit("messageDeletedForEveryone", {
            messageId,
          });
        }
        if (users[message.sender]) {
          io.to(users[message.sender]).emit("messageDeletedForEveryone", {
            messageId,
          });
        }
      });

      // Handle delete for self
      socket.on("deleteForMe", async (data) => {
        const { messageId, userId } = data;
        const message = await deleteForMe(messageId, userId);

        // Emit the delete event only to the user who requested the deletion
        if (users[userId]) {
          io.to(users[userId]).emit("messageDeletedForMe", { messageId });
        }
      });

      // On client disconnect
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        // Remove from online users
        for (const [userId, socketId] of Object.entries(users)) {
          if (socketId === socket.id) {
            delete users[userId];
            break;
          }
        }
      });
    });

    // Start the server
    server
      .listen(PORT, () => console.log(`Server is running on ${BASE_URL}`))
      .on("error", shutdown);
  } catch (error) {
    shutdown(error);
  }
})();

async function shutdown(err) {
  console.log("Unable to initialize the server:", err.message);
  await mongoose.connection.close();
  process.exit(1);
}

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log(err.stack);
  server.close(() => {
    process.exit(1);
  });
});
