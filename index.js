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
  process.exit(1);
});

require("dotenv").config();
const mongoose = require("mongoose");
const { connectToDatabase } = require("./config");
const app = require("./src/app");
const http = require("http");
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

    app.locals.io = io;
    app.locals.users = users;

    // Handle Socket.IO connections
    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      const userId = socket.handshake.query.userId;
      if (userId) {
        users[userId] = socket.id;
        console.log("Hello ", users);
      }

      // get userId from an event triggred in frontend named 'setup'
      socket.on("setup", (userData) => {
        if (userData && userData._id) {
          users[userData._id] = socket.id;
          console.log(`${userData._id} joined`);
        }
      });

      // You can set up events here
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
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
  server.close(() => {
    process.exit(1);
  });
});
