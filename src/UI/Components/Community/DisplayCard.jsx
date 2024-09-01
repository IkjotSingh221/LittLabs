import React, { useState } from 'react';
import "boxicons";
import "./CommunityPage.css";
import News from "./News";

const DisplayCard = () => {
    const news = [
        {
            "headline": "New AI Technology Revolutionizes Healthcare",
            "link": "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg",
            "description": "A breakthrough in AI is set to transform patient care by enabling faster and more accurate diagnoses...",
            "image": "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
        },
        {
            "headline": "Global Markets Respond to Economic Downturn",
            "link": "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
            "description": "Stock markets around the world are reacting to recent economic challenges with significant fluctuations...",
            "image": "https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg"
        },
        {
            "headline": "Renewable Energy Sources Surpass Fossil Fuels",
            "link": "https://imageio.forbes.com/specials-images/imageserve/5faad4255239c9448d6c7bcd/Best-Animal-Photos-Contest--Close-Up-Of-baby-monkey/960x0.jpg?format=jpg&width=960",
            "description": "For the first time, renewable energy has overtaken fossil fuels in terms of global energy production...",
        },
        {
            "headline": "Tech Giants Announce Collaboration on Cybersecurity",
            "link": "https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_1280.jpg",
            "description": "Leading technology companies have announced a joint effort to enhance cybersecurity measures worldwide...",
        }
    ];
    return (
        <>
            <div id="card">
                {news.map((newsItem, index) => (
                    <News
                        key={index}
                        headline={newsItem.headline}
                        link={newsItem.link}
                        description={newsItem.description}
                        image={newsItem.image}
                    />
                ))}
            </div>
        </>
    )
};

export default DisplayCard; 