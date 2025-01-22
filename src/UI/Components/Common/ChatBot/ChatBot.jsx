import React, { useState, useRef, useEffect} from 'react';
import "boxicons";
import "./ChatBot.css";
import ChatBubble from "./ChatBubble";
import { chatWithGemini } from '../../../API/chatbot.api';
import { ThreeDots } from 'react-loader-spinner';


const Chatbot = ({ username, setTasks }) => {
  const [userQuestion, setUserQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatsEndRef = useRef(null);
  const [loading, setLoading] = useState(false);  // Add loading state
  const messagesEndRef = useRef(null);

  const generateChatbotResponse = async (question) => {
    const query = { question: question, username: username };
    console.log(query);
    const response = await chatWithGemini(query);
    if (response.data.task) {
      setTasks((prevTasks) => [...prevTasks, response.data.task]); // Append to the existing task list
    }
    return response.data.response; 
  }

  useEffect(() => {
    scrollToBottom();
}, [chatHistory]);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

  const handleQuestion = async (event) => {
    event.preventDefault();
    if (userQuestion.trim() === "") return;

    const newUserChatHistory = [...chatHistory, { sender: "user", message: userQuestion }];
    setChatHistory(newUserChatHistory);

    try {
      setLoading(true);
      const question = userQuestion;
      setUserQuestion("");
      const chatbotResponse = await generateChatbotResponse(question);
      const newBotChatHistory = [...newUserChatHistory, { sender: "chatbot", message: chatbotResponse }];
      setChatHistory(newBotChatHistory);
    } catch (error) {
      const chatbotResponse = "Failed to get chatbot response. Please try again later.";
      const newBotChatHistory = [...newUserChatHistory, { sender: "chatbot", message: chatbotResponse }];
      setChatHistory(newBotChatHistory);
      setUserQuestion("");
      console.error("Failed to get chatbot response:", error);
    } finally {
      setLoading(false);  // End loading
    }



  }

  const handleChatboxToggle = () => {
    setIsExpanded(!isExpanded);
  }

  useEffect(() => {
    if (chatsEndRef.current) {
      chatsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <>
      <div className={`containerchat ${isExpanded ? 'expanded' : 'collapsed'}`} onClick={!isExpanded ? handleChatboxToggle : null}>
        <div className="nav-barchat">
          <a>Litt Labs</a>
          <div className={`close ${isExpanded ? 'expanded' : 'collapsed'}`} onClick={handleChatboxToggle}>
            <div className="line one"></div>
            <div className="line two"></div>
          </div>
        </div>
        <div className="messages-area">
          <div id="circles" style={{overflow:'hidden'}}>
            <div id="circle1"></div>
            <div id="circle2"></div> 
          </div>
          <div id="chats">
            {chatHistory.map((chat, index) => (
              <ChatBubble key={index} sender={chat.sender} message={chat.message} />
            ))}
            <div ref={messagesEndRef} />
            {loading && (  // Show loader while waiting for the response
              <div id="loader">
                <ThreeDots
                  height="40px"
                  width="40px"
                  color="#4F29F0"
                  ariaLabel="loading"
                />
              </div>
            )}
          </div>
          
        </div>
        <div className="sender-area">
          <form action="" onSubmit={handleQuestion}>
            <div className="input-place">
              <input type="text"
                name="userQuestion"
                value={userQuestion}
                placeholder="Send a message..."
                className="send-input"
                onChange={(event) => setUserQuestion(event.target.value)} />

              <button className="send" type="submit">
                <svg className="send-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve">
                  <g>
                    <g>
                      <path fill="#6B6C7B" d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"></path>
                    </g>
                  </g>
                </svg>

              </button>
            </div>
          </form>
        </div>
        <div></div></div>
    </>
  );
};

export default Chatbot;