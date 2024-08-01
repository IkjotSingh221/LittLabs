import React, { forwardRef } from 'react';
import "boxicons";
import "./NotesPage.css";

const NoteViewer = forwardRef(({notes, ViewingNoteKey, closeNoteViewer, editNote }) => {
    if (!ViewingNoteKey) return null;
    const filterViewingNote = () => {
        return notes.find(note => note.noteKey === ViewingNoteKey);
    };
    const filteredNotes = filterViewingNote();

    return (
        <div id="note-viewer" >
            <button id="close-button" onClick={closeNoteViewer}>
                <box-icon name='x' color='white' size='30px'></box-icon>
            </button>
            <div id="viewer-heading">
                <h1>{filteredNotes.noteTitle}</h1> 
            </div>
            <div id="viewer-text">
                <p>{filteredNotes.noteText}</p>
            </div>
            <div id="viewer-date">
                <p>{filteredNotes.creationDate}</p>
            </div>
            {/* <button id="edit-in-viewer" onClick={()=>editNote(note)}>
                <box-icon name='pencil' color='white'></box-icon>
            </button> */}
        </div>
    );
});

export default NoteViewer;