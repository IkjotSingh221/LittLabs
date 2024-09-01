import React, { useState } from 'react';
import "boxicons";
import "./CommunityPage.css";

const NewsCard = ({ key,
    headline,
    link,
    description,
    image }) => {

    return (
        <div id="newsCard">
            {image ? (
                <div id="newsImg">
                    <img src={image} alt={headline} />
                </div>
            ) : null}
            <div id="newsItem">
                <a href={link}><div id="headline">{headline}</div></a>
                <div id="newsDescription">{description}</div>
            </div>
        </div>
    )
};

export default NewsCard; 