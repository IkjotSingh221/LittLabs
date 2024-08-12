import React, { useEffect, useState, useRef } from "react";
import "boxicons";
import "./ChatWithImage.css";
import axios from "axios";
import MessageBubble from "./ChatBubble";
import { ThreeDots } from "react-loader-spinner";

const ChatWithImage = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [imageMessage, setImageMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);

  const generateChatbotResponse = async (textMessage, imageMessage) => {
    const formData = new FormData();
    if (imageMessage) {
      formData.append("file", imageMessage);
    }
    if (textMessage) {
      formData.append("userPrompt", textMessage);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/imagesolver",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.response;
    } catch (error) {
      console.error("Error generating chatbot response:", error);
      return "Sorry, there was an error processing your request.";
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (textMessage.trim() === "" && !imageMessage) return;

    const newUserChatHistory = [...messageHistory];
    if (textMessage.trim() !== "") {
      newUserChatHistory.push({
        sender: "user",
        text: textMessage,
        image: null,
      });
    }
    if (imageMessage) {
      newUserChatHistory.push({
        sender: "user",
        text: "",
        image: imageMessage,
      });
    }
    setMessageHistory(newUserChatHistory);

    setLoading(true); // Show the loader

    const chatbotResponse = await generateChatbotResponse(
      textMessage,
      imageMessage
    );
    const newBotChatHistory = [
      ...newUserChatHistory,
      { sender: "chatbot", text: chatbotResponse, image: null },
    ];
    setMessageHistory(newBotChatHistory);

    setTextMessage("");
    setImageMessage(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageMessage(file);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="ImageNotePage">
      <div id="pageMain">
        <div id="pageNavBar">
          <span id="nav-bar-text">Chat</span>
        </div>
        <div id="pageMessagingArea">
          <div id="Messages">
            {messageHistory.map((msg, index) => (
              <MessageBubble
                key={index}
                sender={msg.sender}
                text={msg.text}
                image={msg.image}
              />
            ))}
            {loading && (
              <div className="loader">
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#4F29F0"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div id="pageInputArea">
          <form onSubmit={handleSubmit} method="POST">
            <div id="uploadedImage">
              {imageMessage && (
                <img
                  id="imageininput"
                  src={URL.createObjectURL(imageMessage)}
                  alt="uploaded"
                />
              )}
            </div>
            <label htmlFor="fileUploader" style={{ cursor: "pointer" }}>
              {!imageMessage && (
                <box-icon name="image-add" size="25px"></box-icon>
              )}
            </label>
            <input
              id="fileUploader"
              name="imageMessage"
              onChange={handleFileChange}
              type="file"
            />
            <input
              id="textMessage"
              name="textMessage"
              value={textMessage}
              onChange={(event) => setTextMessage(event.target.value)}
              type="text"
              placeholder="Send a Message..."
            />
            <button className="btn-gemini" type="submit">
              <svg
                height="24"
                width="24"
                fill="#FFFFFF"
                viewBox="0 0 24 24"
                data-name="Layer 1"
                id="Layer_1"
                className="sparkle"
              >
                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
              </svg>
              <span className="text">Generate</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWithImage;
