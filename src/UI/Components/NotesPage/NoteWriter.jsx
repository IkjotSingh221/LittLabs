import React, {useEffect, useRef} from 'react';
import "boxicons";
import "./NotesPage.css";

const Note = ({noteTitle, noteText, setNoteTitle, setNoteText, handleSubmit, discardNote}) => {

    return (
        <div className="note-taking-app">
            <form action="" onSubmit={handleSubmit}>
            <textarea 
                id="enterheading" 
                placeholder="Heading"
                onChange={(event)=>setNoteTitle(event.target.value)}
                value={noteTitle}
                className="editable-div">
            </textarea>
            <div id="notetakerheader" className="toolbar"> 
                <button><box-icon name='bold'></box-icon></button>
                <button><box-icon name='italic'></box-icon></button>
                <button><box-icon name='underline'></box-icon></button>
            </div>
            <textarea
                id="inputnotetext"
                placeholder="Enter Text..."
                onChange={(event)=>setNoteText(event.target.value)}
                className="editable-div"
                value={noteText}
            ></textarea>
            <button id="savenote" >Save</button>
            <button id="savenote" type="button" onClick={discardNote}>Discard</button>
            </form>
        </div>
    );
};

export default Note;