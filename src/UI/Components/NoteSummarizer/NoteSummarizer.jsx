import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./NoteSummarizer.css";
import "boxicons";
import { summarizeWithGemini } from "../../API/summarize.api.js";
import { ThreeDots } from "react-loader-spinner";
import Chatbot from "../Common/ChatBot/ChatBot.jsx";
import SummerizedNote from "./SummarizedNote.jsx";

const NoteSummary = ({
    notes,
    username,
}) => {
    const [acceptedFiles, setAcceptedFiles] = useState([]);
    const [pdfName, setPdfName] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedNote, setSelectedNote] = useState('');
    const [pdfuploadbox, openpdfuploadbox] = useState(false);
    const [summarizedContent, setSummarizedContent] = useState(""); // Store summarized content here
    const [showError, setShowError] = useState('');
    const [summarizedNote, setSummarizedNote] = useState('');


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

    const generateNoteSummary = async (event) => {
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
          const response = await summarizeWithGemini(formData);
          setSummarizedContent(true)
          setSummarizedNote(response.Summary);
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
                    <p >{showError}</p>
                </div>
                <form id="PDFForm" method="post" onSubmit={generateNoteSummary}>
                    <div id="flashtop-bar">
                        <div id="addpdfbutton">
                            <button onClick={(e) => {
                                e.preventDefault(); // Prevent form submission
                                setPdfBoxOpenClose(); // Open or close the PDF upload box
                            }} >
                                {pdfName ? (
                                    <p>Uploaded file: {pdfName.length > 15 ? pdfName.slice(0, 12) + "..." : pdfName}</p>
                                ) : (
                                    <p>Add pdf</p>
                                )}
                            </button>
                            {pdfuploadbox && (<div id="pdfuploadbox">
                                <div {...getRootProps()} id="uploadpdf">
                                    <input {...getInputProps()} />
                                    Drag & drop some PDFs here, or click to select PDFs to create flashcards
                                </div>
                            </div>)}
                        </div>
                        <select value={selectedNote} onChange={handleSelectChange} id="selectnotesbutton">
                            <option value="">Select a note</option>
                            {notes.map(note => (
                                <option key={note.noteKey} value={note.noteKey}>
                                    {note.noteTitle}
                                </option>
                            ))}
                        </select>
                        <button type="submit" id="submitnote">Summarize</button>
                    </div>
                </form>
                <div id="noteSummary" style={{ top: pdfuploadbox ? '85px' : '0px' }}>
                    {loading ? (
                        <div id="loader">
                            <ThreeDots
                                height={80}
                                width={80}
                                color="#0579CF"
                            />
                        </div>
                    ) : (
                        summarizedContent && <SummerizedNote content={summarizedNote} /> // Render the correct component after loading
                    )}
                </div>
            </div>
            <Chatbot username={username} />
        </div>
    );
};

export default NoteSummary;
