import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./FlashcardPage.css";
import "boxicons";
import Flashcard from "./Flashcard.jsx";
import { generateFlashcardsWithGemini } from "../../API/flashcard.api.js";
import { ThreeDots } from "react-loader-spinner";
import Chatbot from "../Common/ChatBot/ChatBot.jsx";

const Flashcards = ({ username, notes }) => {
  const colors = ["#ac92eb", "#4fc1e8", "#a0d568", "#ffce54", "#ed5564"];
  const darkerColors = ["#9474c4", "#41a3c0", "#88b85a", "#d4a647", "#c24651"];
  const [flashcards, setFlashcards] = useState([]);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [pdfName, setPdfName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [pdfuploadbox, openpdfuploadbox] = useState(false);
  const [showError, setShowError] = useState('');

  const setPdfBoxOpenClose = () => {
    openpdfuploadbox(!pdfuploadbox);
  };

  const onDrop = useCallback((files) => {
    setAcceptedFiles(files);

    if (files.length > 0) {
      setPdfName(files[0].name);
      openpdfuploadbox(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "application/pdf",
  });

  const handleSelectChange = (event) => {
    setSelectedNote(event.target.value);
  };

  const generateFlashcards = async (event) => {
    event.preventDefault();
    setShowError("");
  
    if (acceptedFiles.length === 0 && !selectedNote) {
      setShowError("Please either select a note or upload a PDF before submitting.");
      return;
    }
  
    if (pdfName && selectedNote) {
      setShowError("Please select either a note or a PDF, but not both.");
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    if (pdfName) {
      formData.append("file", acceptedFiles[0]);
    } else if (selectedNote) {
      formData.append("noteKey", selectedNote);
      formData.append("username", username);
    }
    console.log("FormData being sent:", formData.get("file"), formData.get("noteKey"), formData.get("username"));
    try {
      const response = await generateFlashcardsWithGemini(formData);
      setFlashcards(response);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setShowError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div id="FlashCardPage">
      <div id="flashcardmain">
        <div id="instructionText" style={{ justifyContent: 'center', display: 'flex', color: 'red' }}>
          <p>{showError}</p>
        </div>
        <form id="PDFForm" method="post" onSubmit={generateFlashcards}>
          <div id="flashtop-bar">
            <div id="addpdfbutton">
              <button onClick={(e) => {
                e.preventDefault();
                setPdfBoxOpenClose();
              }}>
                {pdfName ? (
                  <p>Uploaded file: {pdfName.length > 15 ? pdfName.slice(0, 12) + "..." : pdfName}</p>
                ) : (
                  <p>Add pdf</p>
                )}
              </button>
              {pdfuploadbox && (
                <div id="pdfuploadbox">
                  <div {...getRootProps()} id="uploadpdf">
                    <input {...getInputProps()} />
                    Drag & drop some PDFs here, or click to select PDFs to create flashcards
                  </div>
                </div>
              )}
            </div>
            <select value={selectedNote} onChange={handleSelectChange} id="selectnotesbutton">
              <option value="">Select a note</option>
              {notes.map(note => (
                <option key={note.noteTitle} value={note.noteKey}>
                  {note.noteTitle}
                </option>
              ))}
            </select>
            <button type="submit" id="submitnote">Submit</button>
          </div>
        </form>
        <div id="flashcards" style={{ top: pdfuploadbox ? '85px' : '0px' }}>
          {loading ? (
            <div id="loader">
              <ThreeDots
                height={80}
                width={80}
                color="#0579CF"
              />
            </div>
          ) : (
            flashcards.map((card, index) => (
              <Flashcard
                key={index}
                question={card.question}
                answer={card.answer}
                hint={card.hint}
                color={colors[index % colors.length]}
                darkerColors={darkerColors[index % darkerColors.length]}
              />
            ))
          )}
        </div>
      </div>
      <Chatbot username={username} />
    </div>
  );
};

export default Flashcards;
