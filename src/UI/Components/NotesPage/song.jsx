import React from 'react';
import "boxicons";
import "./NotesPage.css"

const Song = ({ title, artist,index, handleTrackClick }) => {

   

    return (
       <div id="trackSong" onClick={()=>handleTrackClick(index)}> 
        <box-icon name='play' ></box-icon>
        <div id="trackcontent">
            <h4>{title}</h4>
            <p>{artist}</p>
        </div>
        
       </div>
    );
};

export default Song;