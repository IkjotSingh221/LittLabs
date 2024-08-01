import React, { useEffect, useState } from 'react';
import "boxicons";
import "./ChatWithImage.css";

const ImageNotePageChatBubble = ({ key, sender, text, image }) => {

    const findSender = () => {
        return sender === "user" ? "userchat" : "chatbotchat";
    };

    return (
        <div id="imagechatbubble" className={findSender()}>
            <div id="boticon"></div>
            <div id="chatmessage" >
                {image && <div id="imagemessage"><img src={URL.createObjectURL(image)} alt="uploaded" /></div>}
                {text && <div id="textmessagechat">{text}</div>}
            </div>
        </div>
    );
};

export default ImageNotePageChatBubble;