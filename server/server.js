global.crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const { Server } =
  require("socket.io");

const OpenAI =
  require("openai");

dotenv.config();

const authRoutes =
  require("./routes/auth");

const authMiddleware =
  require("./middleware/authMiddleware");

const Message =
  require("./models/Message");


const app = express();

app.use(cors());

app.use(express.json());


// HTTP SERVER
const server =
  http.createServer(app);


// SOCKET.IO
const io =
  new Server(server, {

    cors: {
      origin:
        "http://localhost:3000",
      methods: ["GET", "POST"],
    },
});


// MONGODB
mongoose.connect(
  process.env.MONGO_URI
)

.then(() => {
  console.log("MongoDB Connected");
})

.catch((err) => {
  console.log(err);
});


// OPENAI
const openai =
  new OpenAI({
    apiKey:
      process.env.OPENAI_API_KEY,
  });


// ROUTES
app.use("/api/auth", authRoutes);



// GET OLD MESSAGES
app.get("/messages",
async (req, res) => {

  try {

    const messages =
      await Message.find()
      .sort({ time: 1 });

    res.json(messages);

  } catch (error) {

    res.status(500).json({
      message: "Error",
    });
  }
});



// AI CHATBOT
app.post(
  "/chat",
  authMiddleware,
  async (req, res) => {

    try {

      const userMessage =
        req.body.message;

      const completion =
        await openai.chat.completions.create({

          model: "gpt-3.5-turbo",

          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
      });

      res.json({
        reply:
          completion
          .choices[0]
          .message
          .content,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
});



// SOCKET CONNECTION
io.on("connection",
(socket) => {

  console.log(
    "User Connected:",
    socket.id
  );


  socket.on(
    "send_message",
    async (data) => {

      const newMessage =
        new Message({

          sender:
            data.sender,

          message:
            data.message,
      });

      await newMessage.save();

      io.emit(
        "receive_message",
        data
      );
  });


  socket.on(
    "disconnect",
    () => {

      console.log(
        "User Disconnected"
      );
  });
});



server.listen(
  process.env.PORT,
  () => {

    console.log(
      "Server Running"
    );
});