// NoteWriter.jsx
import React, { useState } from "react";
import "boxicons";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "./NotesPage.css";
import { makeItLitt } from "../../API/litt.api";

const NoteWriter = ({
  noteTitle,
  noteText,
  setNoteTitle,
  setNoteText,
  handleSubmit,
  discardNote,
  closeNoteWriter,
  editingNoteKey,
  username,
}) => {
  const [error, setError] = useState(""); // State to store error message
  const [loading, setLoading] = useState(false); // State to show loading
  const [littResponse, setLittResponse] = useState(null); // Store API response

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
    ],
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();

    if (!noteTitle.trim() && !noteText.trim()) {
      setError("Both heading and note text are required.");
      return;
    }

    setError(""); // Clear any previous error
    handleSubmit(e); // Pass the event to handleSubmit
  };

  const handleMakeItLitt = async () => {
    if (!noteTitle.trim() || !noteText.trim()) {
      setError("Both heading and note text are required to make it Litt.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await makeItLitt({
        username: username, // Replace with dynamic username if needed
        noteTitle,
        noteText,
      });
      console.log(response);
      setNoteText(response.content);
      setNoteTitle(response.title);
    } catch (error) {
      setError("Failed to process the note. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-taking-app">
      {error && <p className="error-message" style={{ color: 'red', width: '100%', display: 'flex', justifyContent: 'center' }}>{error}</p>} {/* Display error */}
      <button id="close-button" onClick={closeNoteWriter}>
        <box-icon name="x" color="white" size="30px"></box-icon>
      </button>
      <form onSubmit={validateAndSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <textarea
          id="enterheading"
          placeholder="Heading"
          onChange={(e) => setNoteTitle(e.target.value)}
          value={noteTitle}
          className="editable-div"
        />
        <ReactQuill
          id="inputnotetext"
          value={noteText}
          onChange={setNoteText}
          placeholder="Write your notes here..."
          className="editable-div"
          style={{ width: "100%", border: "none" }}
          modules={modules}
        />

        <div id="bottomButtons">

          <button
            type="button"
            className="newbutton"
            onClick={handleMakeItLitt}
            disabled={loading}
          >
            {loading ? "Processing..." : "Make it Litt!"}
            <div className="star-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                version="1.1"
                style={{
                  shapeRendering: "geometricPrecision",
                  textRendering: "geometricPrecision",
                  imageRendering: "optimizeQuality",
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
                viewBox="0 0 784.11 815.53"
              >
                <path
                  className="fil0"
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                ></path>
              </svg>
            </div>
          </button>

          <div id="note-buttons">
            <button
              type="submit"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <box-icon name="save" color="#999"></box-icon>
            </button>
            {!editingNoteKey && (
              <box-icon
                name="reset"
                color="#999"
                onClick={discardNote}
              ></box-icon>
            )}
          </div>
        </div>
      </form>

      {littResponse && (
        <div className="litt-response">
          <h1>{littResponse.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: littResponse.content }} />
        </div>
      )}
    </div>
  );
};

export default NoteWriter;
