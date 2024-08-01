import React from 'react';
import "boxicons";
import "./NotesPage.css"

const NoteSticker = ({ noteKey,
    heading,
    notetext,
    creationDate,
    color,
    deleteNote,
    editNote,
    viewnote }) => {

    const trimText = (text, maxLength) => { 
        if (notetext.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <div id="notesticker" style={{ backgroundColor: color }}>
            <div id="noteheader">
                <h3>{trimText(heading, 15)}</h3>
            </div>
            <div id="noteinnertext">{trimText(notetext, 150)}</div>

            <div id="notefooter">
                <div id="notedate">{creationDate}</div>
                <div>
                    <button onClick={()=> viewnote(noteKey)}><box-icon name='notepad'></box-icon></button>
                    <button onClick={()=>deleteNote(noteKey)}><box-icon name='trash-alt'></box-icon></button>
                    <button onClick={() => editNote(noteKey)}><box-icon name='pencil'></box-icon></button>
                </div>

            </div>
        </div>
    );
};

export default NoteSticker;