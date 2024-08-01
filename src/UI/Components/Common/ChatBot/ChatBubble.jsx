import React from 'react';
import "boxicons";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatBubble = ({ key, sender, message }) => {
  const findSender = () => {
    return sender === "user" ? "user" : "chatbot";
  };

  return (
    <div id="chatbubble" className={findSender()} key={key}>
      <ReactMarkdown children={message} remarkPlugins={[remarkGfm]} />
    </div>
  );
};

export default ChatBubble;