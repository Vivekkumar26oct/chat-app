import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

import io from "socket.io-client";

const socket =
  io("http://localhost:5000");


function ChatBot() {

  const [message, setMessage] =
    useState("");

  const [chat, setChat] =
    useState([]);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );



  // LOAD OLD MESSAGES
  useEffect(() => {

    loadMessages();

  }, []);


  const loadMessages =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/messages"
          );

        setChat(response.data);

      } catch (error) {

        console.log(error);
      }
  };



  // RECEIVE MESSAGE
  useEffect(() => {

    socket.on(
      "receive_message",
      (data) => {

        setChat((prev) => [
          ...prev,
          data,
        ]);
      }
    );

  }, []);




  // SEND MESSAGE
  const sendMessage =
    async () => {

      if (!message) return;

      const messageData = {

        sender: user.name,

        message,
      };

      socket.emit(
        "send_message",
        messageData
      );

      setMessage("");
  };



  // AI BOT MESSAGE
  const askAI =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.post(

          "http://localhost:5000/chat",

          {
            message,
          },

          {
            headers: {
              authorization:
                token,
            },
          }
        );

        const botMessage = {

          sender: "AI Bot",

          message:
            response.data.reply,
        };

        setChat((prev) => [
          ...prev,
          botMessage,
        ]);

      } catch (error) {

        console.log(error);
      }
  };



  return (

    <div style={styles.container}>

      <h1>
        Real-Time Chat App
      </h1>



      <div style={styles.chatBox}>

        {chat.map((msg, index) => (

          <div
            key={index}
            style={styles.message}
          >

            <strong>
              {msg.sender}
            </strong>

            <p>
              {msg.message}
            </p>

          </div>
        ))}

      </div>



      <div style={styles.inputContainer}>

        <input
          type="text"
          placeholder="Type Message"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          style={styles.input}
        />



        <button
          onClick={sendMessage}
          style={styles.button}
        >
          Send
        </button>



        <button
          onClick={askAI}
          style={styles.button}
        >
          Ask AI
        </button>

      </div>

    </div>
  );
}



const styles = {

  container: {
    width: "500px",
    margin: "20px auto",
    textAlign: "center",
  },

  chatBox: {
    border: "1px solid gray",
    height: "500px",
    overflowY: "scroll",
    padding: "10px",
  },

  message: {
    border: "1px solid #ddd",
    margin: "10px",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "left",
  },

  inputContainer: {
    display: "flex",
    marginTop: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
  },

  button: {
    padding: "10px",
  },
};

export default ChatBot;