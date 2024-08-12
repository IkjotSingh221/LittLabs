import React from "react";
import "boxicons";
import "./NotesPage.css";

const NoteWriter = ({
  noteTitle,
  noteText,
  setNoteTitle,
  setNoteText,
  handleSubmit,
  discardNote,
  closeNoteWriter,
  editingNoteKey
}) => {
  const handleChange = (event) => {
    setNoteText(event.target.value);
  };

  return (
    <div className="note-taking-app">
      <button id="close-button" onClick={closeNoteWriter}>
        <box-icon name="x" color="white" size="30px"></box-icon>
      </button>
      <form action="" onSubmit={handleSubmit}>
        <textarea
          id="enterheading"
          placeholder="Heading"
          onChange={(event) => setNoteTitle(event.target.value)}
          value={noteTitle}
          className="editable-div"
        ></textarea>
        <textarea
          id="inputnotetext"
          placeholder="You may use markdown to create your notes...."
          onChange={handleChange}
          className="editable-div"
          value={noteText}
          style={{ width: "100%" }}
        ></textarea>
        {/* <button id="savenote" type='submit'>Save</button>
                <button id="savenote" type="button" onClick={discardNote}>Reset</button>
                <button id="savenote" type="button">Preview</button> */}
        <div id="note-buttons">
            <button type="submit" style={{backgroundColor: 'transparent', border:'none'}}><box-icon name="save" color="#999"></box-icon></button>
          
          {!editingNoteKey && <box-icon name="reset" color="#999" onClick={discardNote}></box-icon>}
          
        </div>
      </form>
    </div>
  );
};

export default NoteWriter;
