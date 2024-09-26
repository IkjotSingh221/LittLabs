import React, { useState } from 'react';
import "boxicons";
import "./CommunityPage.css";
import News from "./News";

const DisplayCard = () => {
    const news = [
        {
            "headline": "Chandrayaan-3’s Pragyan rover discovers big crater",
            "link": "https://indianexpress.com/article/technology/science/chandrayaan-3-pragyan-rover-discovers-big-crater-9583520/",
            "description": "The discovery of the ancient crater with a diameter of 160 km continues to prove why Chandrayaan-3 was one of the most...",
            "image": "https://pbs.twimg.com/media/GYDuv0eW4AEJEMG?format=jpg&name=small"
        },
        {
            "headline": "Two more asteroids heading towards Earth, alerts NASA",
            "link": "https://indianexpress.com/article/technology/science/two-more-asteroids-heading-towards-earth-9582036/",
            "description": "Nasa's Jet Propulsion Laboratory reassures that even these asteroids will pass at a safe distance from Earth...",
            "image": "https://th-thumbnailer.cdn-si-edu.com/lIz8h4FCyAyHEr4s2U4X6udGxbs=/1000x750/filters:no_upscale():focal(1750x1083:1751x1084)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/90/df/90dfeb2c-1659-4b56-969c-9c4255f9c2f7/space_safety_programme_-_near_earth_objects.jpg"
        },
        {
            "headline": "Moving Black Holes Detected",
            "link": "https://indianexpress.com/article/technology/science/swarm-of-black-holes-detected-moving-through-milky-ways-star-cluster-9579738/",
            "description": "In around a billion years, the cluster is expected to dissolve entirely, leaving behind only black holes orbiting the Milky Way's centre...",
            "image": "https://discovery.sndimg.com/content/dam/images/discovery/fullset/2022/10/Blackhole%20GettyImages-956705946.jpg.rend.hgtvcom.1280.1280.suffix/1665028642072.jpeg"
        },
        {
            "headline": "Earth to get a temporary mini-moon named 2024 PT5",
            "link": "https://indianexpress.com/article/technology/science/earth-second-moon-2024-pt5-9570443/",
            "description": "Technically, the 2024 PT5 asteroid isn’t a mini-moon, as it will not complete the full revolution around Earth...",
            "image": "https://images.indianexpress.com/2024/09/earth-moon-mini-moon.jpg?w=640"
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