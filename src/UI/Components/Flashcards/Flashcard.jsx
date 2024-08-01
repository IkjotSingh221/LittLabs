import React, { useState } from 'react';
import "boxicons";
import "./FlashcardPage.css";

const Card = ({ key, question, answer, hint, color, darkerColors }) => {
    const [flipped, setFlipped] = useState(false);

    const handleClick = () => {
        setFlipped(!flipped); 
    };

    return (
        <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={handleClick}>
            <div className="flip-card-inner">
                <div className="flip-card-front" style={{ background: `linear-gradient(to bottom right, ${color}, ${darkerColors})` }}>
                    <p className="title"></p>
                    <p>{question}</p>
                    <div id="cheatsheet" style={{ color: color }}>
                        <h4>HINT</h4>
                        <p>{hint}</p>
                    </div>
                </div>
                <div className="flip-card-back" style={{ background: darkerColors }}>
                    <p className="title">ANSWER</p>
                    <p>{answer}</p>
                </div>
            </div>
            {/* <Chatbot username={username}/> */}
        </div>
    );
};

export default Card;