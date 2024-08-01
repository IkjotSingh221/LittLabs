import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./FlashcardPage.css";
import "boxicons";
import NavBar from "../Common/SideNavBar/SideNav.jsx";
import Flashcard from "./Flashcard.jsx";
import { readTaskType, readTodos } from "../../API/todo.api.js";
import { generateFlashcardsWithGemini } from "../../API/flashcard.api.js";
import { ThreeDots } from "react-loader-spinner";
import Chatbot from "../Common/ChatBot/ChatBot.jsx";

const Flashcards = ({
  tasks,
  setTasks,
  taskTypeList,
  setTaskTypeList,
  username,
}) => {
  const colors = ["#ac92eb", "#4fc1e8", "#a0d568", "#ffce54", "#ed5564"];
  const darkerColors = ["#9474c4", "#41a3c0", "#88b85a", "#d4a647", "#c24651"];
  const [flashcards, setFlashcards] = useState([]);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [pdfName, setPdfName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks(username);
    loadTaskTypeList(username);
  }, [username]);

  const loadTasks = async (username) => {
    try {
      const todos = await readTodos(username);
      const mappedTasks = todos.map((task) => ({
        taskKey: task.taskKey,
        taskName: task.taskName,
        taskDescription: task.taskDescription,
        dueDate: task.dueDate,
        taskColor: task.taskColor,
        taskType: task.taskType,
        isCompleted: task.isCompleted,
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const loadTaskTypeList = async (username) => {
    try {
      const taskTypes = await readTaskType(username);
      const mappedTaskTypeList = taskTypes.map((taskType) => ({
        taskTypeKey: taskType.taskTypeKey,
        taskTypeName: taskType.taskTypeName,
        taskColor: taskType.taskTypeColor,
      }));
      setTaskTypeList(mappedTaskTypeList);
    } catch (error) {
      console.error("Error loading task types:", error);
    }
  };

  const onDrop = useCallback((files) => {
    setAcceptedFiles(files); // Store the files in state
    
    if (files.length > 0) {
      setPdfName(files[0].name); 
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "application/pdf",
  });

  const generateFlashcards = async (event) => {
    event.preventDefault();

    if (acceptedFiles.length === 0) {
      console.error("No files selected");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", acceptedFiles[0]); // Assuming the first file is the one to upload

    try {
      const response = await generateFlashcardsWithGemini(formData);
      console.log(response)
      setFlashcards(response); // Update the state with generated flashcards
    } catch (error) {
      console.error("Error generating flashcards:", error);
    }finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div id="FlashCardPage">
      <NavBar
        tasks={tasks}
        taskTypeList={taskTypeList}
        setTaskTypeList={setTaskTypeList}
        username={username}
      />
      <div id="flashcardmain">
        <form id="PDFForm" method="post" onSubmit={generateFlashcards}>
          <div id="flashtop-bar">
            <div {...getRootProps()} id="uploadpdf">
              <input {...getInputProps()} />
              {pdfName ? (
                <p>Uploaded file: {pdfName}</p>
              ) : (
                <p>Drag & drop some PDFs here, or click to select PDFs to create flashcards</p>
              )}
            </div>
            <button type="submit" id="pdfsubmit">
              Submit PDF
            </button>
          </div>
        </form>
        <div id="flashcards" style={{justifyContent:'center'}}>
          {loading ? (
            <div id="loader">
              <ThreeDots
                height={80}
                width={80}
                color="#4fa94d"
              />
            </div>
          ) : (
            flashcards.map((card, index) => (
              <Flashcard
                key={index}
                question={card.question}
                answer={card.answer}
                hint={card.hint}
                color={colors[index % colors.length]} // Assign color
                darkerColors={darkerColors[index % darkerColors.length]}
              />
            ))
          )}
        </div>
      </div>
      <Chatbot username={username}/>
    </div>
  );
};

export default Flashcards;