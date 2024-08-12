import React from 'react';
import "boxicons";
import "./ChatWithImage.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ImageNotePageChatBubble = ({ sender, text, image }) => {

    const senderClass = sender === "user" ? "userchat" : "chatbotchat";

    return (
        <div id="imagechatbubble" className={senderClass}>
            {sender === "chatbot" && <div id="boticon"></div>}
            <div id="chatmessage">
                {image && (
                    <div id="imagemessage">
                        <img src={URL.createObjectURL(image)} alt="uploaded" />
                    </div>
                )}
                {text && (
                    <div id="textmessagechat">
                        <div id="messageresponse">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {text}
                        </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageNotePageChatBubble;
