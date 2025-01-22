import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NotesPage.css";
import "boxicons";
import NoteSticker from "./NoteSticker";
import NoteWriter from "./NoteWriter.jsx";
import NoteViewer from "./NoteViewer.jsx";
import SidePanel from "./SidePanel.jsx";
import Chatbot from "../Common/ChatBot/ChatBot.jsx";
import { readTodos, readTaskType } from "../../API/todo.api.js";
import { createNote, readNotes, deleteNoteByKey, updateNote } from "../../API/note.api.js";
import Lottie from 'react-lottie';
import NotesAnimation from '../../Assets/Notes.json';
import ImageAnimation from '../../Assets/Image Solver.json';
import VideoAnimation from '../../Assets/Interview Prep.json';

const Notes = ({
  // tasks,
  setTasks,
  // taskTypeList,
  // setTaskTypeList,
  notes,
  setNotes,
  username,
}) => {
  const colors = ["#BAE1FF", "#f5ee89"];
  const [editingNoteKey, setEditingNoteKey] = useState(false);
  // const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [viewingNote, setViewingNote] = useState(false);
  const [isNoteWriterVisible, setIsNoteWriterVisible] = useState(false);
  const [isNoteViewerVisible, setIsNoteViewerVisible] = useState(false);
  const [isGlassEffectVisible, setIsGlassEffectVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {
  //   loadTasks(username);
  //   loadTaskTypeList(username);
  // loadNotes(username);
  // }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredNotes = notes.filter((note) =>
    note.noteTitle.toLowerCase().includes(searchQuery)
  );

  // const loadTasks = async (username) => {
  //   try {
  //     const todos = await readTodos(username);
  //     const mappedTasks = todos.map((task) => {
  //       return {
  //         taskKey: task.taskKey,
  //         taskName: task.taskName,
  //         taskDescription: task.taskDescription,

  //         dueDate: task.dueDate,
  //         taskColor: task.taskColor,
  //         taskType: task.taskType,
  //         isCompleted: task.isCompleted,
  //       };
  //     });
  //     setTasks(mappedTasks);
  //   } catch (error) {
  //     console.error("Error loading tasks:", error);
  //   }
  // };

  // const loadTaskTypeList = async (username) => {
  //   try {
  //     const taskTypes = await readTaskType(username);
  //     const mappedTaskTypeList = taskTypes.map((taskType) => {
  //       return {
  //         taskTypeKey: taskType.taskTypeKey,
  //         taskTypeName: taskType.taskTypeName,
  //         taskColor: taskType.taskTypeColor,
  //       };
  //     });
  //     await setTaskTypeList(mappedTaskTypeList);
  //   } catch (error) {
  //     console.error("Error loading task types:", error);
  //   }
  // };

  // const loadNotes = async (username) => {
  //   try {
  //     const notesList = await readNotes(username);
  //     const mappedNotesList = notesList.map((note) => {
  //       return {
  //         noteKey: note.noteKey,
  //         noteTitle: note.noteTitle,
  //         noteText: note.noteText,
  //         creationDate: note.creationDate,
  //       };
  //     });
  //     setNotes(mappedNotesList);
  //   } catch (error) {
  //     console.error("Error loading task types:", error);
  //   }
  // };

  const addToNotes = (note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };

  const deleteNote = async (key) => {
    console.log("delete");
    const deleteNoteSchema = {
      username: username,
      noteKey: key,
    };
    await deleteNoteByKey(deleteNoteSchema);
    const newNotes = notes.filter((note) => note.noteKey !== key);
    setNotes(newNotes);
  };

  const addnotewriter = () => {
    setIsNoteWriterVisible(true);
    setIsNoteViewerVisible(false);
    setIsGlassEffectVisible(true);
    setNoteTitle("");
    setNoteText("");
    setEditingNoteKey(false);
  };

  const editNote = (noteKey) => {
    const noteToEdit = notes.find((note) => note.noteKey === noteKey);
    if (noteToEdit) {
      setNoteTitle(noteToEdit.noteTitle);
      setNoteText(noteToEdit.noteText);
      setEditingNoteKey(noteKey); // Set editingNoteKey with the noteKey of the note being edited
    }
    setIsNoteWriterVisible(true);
    setIsNoteViewerVisible(false);
    setIsGlassEffectVisible(true);
  };

  const viewnote = (key) => {
    setIsNoteViewerVisible(!isNoteViewerVisible);
    setIsGlassEffectVisible(!isGlassEffectVisible);
    setViewingNote(key);
  };

  const closeNoteViewer = () => {
    setIsNoteViewerVisible(!isNoteViewerVisible);
    setIsGlassEffectVisible(!isGlassEffectVisible);
    setEditingNoteKey(false);
    setViewingNote(false);
  };

  const closeNoteWriter = () => {
    setIsNoteWriterVisible(!isNoteWriterVisible);
    setIsGlassEffectVisible(!isGlassEffectVisible);
    setEditingNoteKey(false);
  };

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (noteTitle === "" || noteText === "") return;

    const noteData = {
      username: username,
      noteTitle: noteTitle,
      noteText: noteText,
      noteKey: editingNoteKey || undefined, // Include noteKey if editing, otherwise undefined
    };

    try {
      if (editingNoteKey) {
        // Update existing note
        await updateNote(noteData);
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.noteKey === editingNoteKey
              ? { ...note, noteTitle: noteTitle, noteText: noteText }
              : note
          )
        );
      } else {
        // Create a new note
        delete noteData.noteKey;
        noteData.creationDate = getCurrentDate();
        const response = await createNote(noteData);
        noteData.noteKey = response.noteKey; // Get the noteKey from the response
        delete noteData.username;
        addToNotes(noteData);
      }

      // Reset form and close note writer
      setNoteTitle("");
      setNoteText("");
      setIsGlassEffectVisible(false);
      setIsNoteWriterVisible(false);
      setEditingNoteKey(false); // Reset editingNoteKey after submission
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };


  const discardNote = () => {
    setNoteTitle("");
    setNoteText("");
  };

  const addNoteButtonAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: NotesAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const ImageSolverButtonAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: ImageAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const InterviewPrepButtonAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: VideoAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <>
      {isGlassEffectVisible && <div id="glasseffect"></div>}
      {isNoteWriterVisible && (
        <NoteWriter
          noteTitle={noteTitle}
          noteText={noteText}
          setNoteTitle={setNoteTitle}
          setNoteText={setNoteText}
          handleSubmit={handleSubmit}
          discardNote={discardNote}
          closeNoteWriter={closeNoteWriter}
          editingNoteKey={editingNoteKey}
          username = {username}
        />
      )}
      {isNoteViewerVisible && (
        <NoteViewer
          notes={notes}
          ViewingNoteKey={viewingNote}
          closeNoteViewer={closeNoteViewer}
          editNote={editNote}
          setEditingNoteKey={setEditingNoteKey}
        />
      )}

      <div id="notespage">
        <div id="notes-main">
          <div id="top-bar">
            <div id="search-bar">
              <box-icon name="search"></box-icon>
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div id="notescontainer">
            <div id="notesbuttons">
              <Link to="/notes" id="takeanoteid" >
                <button id="takeanote" className="thisButton" onClick={addnotewriter}>
                  <Lottie
                    options={addNoteButtonAnimationOptions}
                    height={60}
                    width={60}
                  />
                  <div className="button-text">
                    Create a New Note
                  </div>
                </button>
              </Link>
              <Link to="/imagechat" id="withdrawingid" >
                <button id="withdrawing" className="thisButton">
                  <Lottie
                    options={ImageSolverButtonAnimationOptions}
                    height={60}
                    width={60}
                  />
                  <div className="button-text">
                    Solve Your Questions
                  </div>
                </button>
              </Link>
              <Link to="/interview-prep" id="withimageid">
                <button id="withimage" className="thisButton">
                  <Lottie
                    options={InterviewPrepButtonAnimationOptions}
                    height={60}
                    width={60}
                  />
                  <div className="button-text">
                    Professionalism check
                  </div>
                </button>
              </Link>
            </div>
            <div id="notes">
              {filteredNotes.map((note, index) => (
                <NoteSticker
                  noteKey={note.noteKey}
                  heading={note.noteTitle}
                  noteText={note.noteText}
                  creationDate={note.creationDate}
                  color={colors[index % colors.length]}
                  deleteNote={deleteNote}
                  editNote={editNote}
                  viewnote={viewnote}
                />
              ))}
            </div>
          </div>
        </div>
        <SidePanel />

        <Chatbot username={username} setTasks={setTasks}/>
      </div>
    </>
  );
};

export default Notes;
