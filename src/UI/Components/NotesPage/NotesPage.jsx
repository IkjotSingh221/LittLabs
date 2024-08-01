import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./NotesPage.css";
import "boxicons";
import NoteSticker from "./NoteSticker";
import NavBar from "../Common/SideNavBar/SideNav.jsx";
import NoteWriter from "./NoteWriter.jsx";
import NoteViewer from "./NoteViewer.jsx";
import SidePanel from "./SidePanel.jsx";
import Chatbot from '../Common/ChatBot/ChatBot.jsx';
import { readTodos, readTaskType } from "../../API/todo.api.js";
import { createNote, readNotes, deleteNoteByKey } from "../../API/note.api.js";

const Notes = ({
    tasks,
    setTasks,
    taskTypeList,
    setTaskTypeList,
    username 
}) => {
  
  const colors = ["#e68369", "#e9c46a"];
  const [editingNoteKey, setEditingNoteKey] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [viewingNote, setViewingNote] = useState(null);
  const [isNoteWriterVisible, setIsNoteWriterVisible] = useState(false);
  const [isNoteViewerVisible, setIsNoteViewerVisible] = useState(false);
  const [isGlassEffectVisible, setIsGlassEffectVisible] = useState(false);

  useEffect(() => {
    loadTasks(username);
    loadTaskTypeList(username);
    loadNotes(username);
  }, []);

  const loadTasks = async (username) => {
    try {
      const todos = await readTodos(username);
      const mappedTasks = todos.map((task) => {
        return {
          taskKey: task.taskKey,
          taskName: task.taskName,
          taskDescription: task.taskDescription,

          dueDate: task.dueDate,
          taskColor: task.taskColor,
          taskType: task.taskType,
          isCompleted: task.isCompleted,
        };
      });
      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const loadTaskTypeList = async (username) => {
    try {
      const taskTypes = await readTaskType(username);
      const mappedTaskTypeList = taskTypes.map((taskType) => {
        return {
          taskTypeKey: taskType.taskTypeKey,
          taskTypeName: taskType.taskTypeName,
          taskColor: taskType.taskTypeColor,
        };
      });
      await setTaskTypeList(mappedTaskTypeList);
    } catch (error) {
      console.error("Error loading task types:", error);
    }
  };

  const loadNotes = async (username) => {
    try {
      const notesList = await readNotes(username);
      const mappedNotesList = notesList.map((note) => {
        return {
          noteKey: note.noteKey,
          noteTitle: note.noteTitle,
          noteText: note.noteText,
          creationDate: note.creationDate
        };
      });
      setNotes(mappedNotesList);
    } catch (error) {
      console.error("Error loading task types:", error);
    }
  };


  const addToNotes = (note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };

  const deleteNote = async (key) => {
    const deleteNoteSchema = {
        username: username,
        noteKey: key
    }
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
    setEditingNoteKey(null);
  };

  const editNote = (noteKey) => {
    const noteToEdit = notes.find((note) => note.noteKey === noteKey);
    if (noteToEdit) {
      setNoteTitle(noteToEdit.noteTitle);
      setNoteText(noteToEdit.noteText);
      setEditingNoteKey(noteKey);
    }
    setIsNoteWriterVisible(true);
    setIsNoteViewerVisible(false);
    setIsGlassEffectVisible(true);
    setEditingNoteKey(noteKey);
  };

  const viewnote = (key) => {
    setIsNoteViewerVisible(!isNoteViewerVisible);
    setIsGlassEffectVisible(!isGlassEffectVisible);
    setViewingNote(key);
  };

  const closeNoteViewer = () => {
    setIsNoteViewerVisible(!isNoteViewerVisible);
    setIsGlassEffectVisible(!isGlassEffectVisible);
    setViewingNote(null);
  };

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (noteTitle === "" && noteText === "") return;
    const newNote = {
      username: username,
      noteTitle: noteTitle,
      noteText: noteText,
      creationDate: getCurrentDate(),
    };
    if (editingNoteKey !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.noteKey === editingNoteKey ? newNote : n))
      );
    } else {
      const response = await createNote(newNote);
      newNote.noteKey = response.noteKey;
      
      delete newNote.username;
      addToNotes(newNote);
    }
    setNoteTitle("");
    setNoteText("");
    setIsGlassEffectVisible(!isGlassEffectVisible);
    setIsNoteWriterVisible(!isNoteWriterVisible);
  };

  const discardNote = () => {
    setNoteTitle("");
    setNoteText("");
    setEditingNoteKey(null);
    setIsGlassEffectVisible(!isGlassEffectVisible);
    setIsNoteWriterVisible(!isNoteWriterVisible);
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
        />
      )}
      {isNoteViewerVisible && (
        <NoteViewer
          notes={notes}
          ViewingNoteKey={viewingNote}
          closeNoteViewer={closeNoteViewer}
          editNote={editNote}
        />
      )}
      <div id="notespage">
        <NavBar
          tasks={tasks}
          taskTypeList={taskTypeList}
          setTaskTypeList={setTaskTypeList}
          username={username}
        />
        <div id="notes-main">
          <div id="top-bar">
            <div id="search-bar">
              <box-icon name="search"></box-icon>
              <input type="text" placeholder="Search anything..." />
            </div>
          </div>
          <div id="notescontainer">
            <div id="notesbuttons">
              
              <button id="takeanote" onClick={addnotewriter}>
                <box-icon name="notepad"></box-icon>
                <div className="button-text">
                  <div className="button-text-inner">
                    <h6>New Note</h6>
                  </div>
                  Take a Note
                </div>
              </button>
              <Link to="/imagechat" id="notesbuttons withdrawing">
              <button id="withdrawing">
                <box-icon name="paint" type="solid"></box-icon>
                <div className="button-text">
                  <div className="button-text-inner">
                    <h6>New Note</h6>
                  </div>
                  With Drawing
                </div>
              </button>
              </Link>
              <Link to="/interview-prep" id="notesbuttons withimage">
              <button id="withimage">
                <box-icon type="solid" name="image-alt"></box-icon>
                <div className="button-text">
                  <div className="button-text-inner">
                    <h6>New Note</h6>
                  </div>
                  With Image
                </div>
              </button>
              </Link>
            </div>
            <SidePanel />
            <div id="notes">
              {notes.map((note, index) => (
                <NoteSticker
                  noteKey={note.noteKey}
                  heading={note.noteTitle}
                  notetext={note.noteText}
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
      </div>
      <Chatbot username={username}/>
    </>
  );
};

export default Notes;