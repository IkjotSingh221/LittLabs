import * as React from "react";
import { useEffect, useState } from "react";
import TaskCardContainer from "./TaskCardContainer";
import ChartsContainer from "./ChartHolder";
import "./Dashboard.css";
import owlImage from "../../Assets/dashboardOwl.png";
import { readTodos, readTaskType } from "../../API/todo.api.js";
import { readNotes } from "../../API/note.api.js";
import { Link } from "react-router-dom";
import Chatbot from "../Common/ChatBot/ChatBot.jsx";
import { quotes } from "../../Data/Data.js";
import { completeTodo } from "../../API/todo.api.js";

const loadLordIconScript = () => {
  const script = document.createElement("script");
  script.src = "https://cdn.lordicon.com/lordicon.js";
  script.async = true;
  document.body.appendChild(script);
};

export default function Dashboard({
  tasks,
  setTasks,
  taskTypeList,
  setTaskTypeList,
  notes,
  setNotes,
  username,
  setUpcoming,
  setUpcomingButton
}) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    loadLordIconScript();
    // loadTasks(username);
    // loadTaskTypeList(username);
    // loadNotes(username);
    getRandomQuote(quotes);
    setUpcoming(false);
    setUpcomingButton(false);

  }, []);

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
  //     setTaskTypeList(mappedTaskTypeList);
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
  //         creationDate: note.creationDate
  //       };
  //     });
  //     setNotes(mappedNotesList);
  //   } catch (error) {
  //     console.error("Error loading task types:", error);
  //   }
  // };

  const getRandomQuote = (quotesArray) => {
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    const randomQuote = quotesArray[randomIndex];
    setAuthor(randomQuote.author);
    setQuote(randomQuote.quote);
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // Month is zero-indexed
  };

  const getTop5TasksByDate = (tasks) => {
    return tasks
      .filter((task) => !task.isCompleted) // Filter out completed tasks
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.dueDate.split("-");
        const [dayB, monthB, yearB] = b.dueDate.split("-");
        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
        return dateA - dateB;
      })
      .slice(0, 5); // Retain only the first 5 tasks
  };

  const toggleComplete = async (taskKey) => {
    let currentCompletionStatus = tasks.filter(
      (task) => task.taskKey === taskKey
    ).isCompleted;
    const todo = {
      username: username,
      taskKey: taskKey,
      isCompleted: !currentCompletionStatus,
    };
    const response = await completeTodo(todo);
    setTasks(
      tasks.map((task) =>
        task.taskKey === taskKey
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  return (
    <>
      <div id="dashBoardPage">
        <div id="dashBoardMain">
          <div id="welcomeCard">
            <div id="Welcomeuser">Welcome {username}!</div>
            <div id="Quote">
              <span id="quoteText">{quote}</span> <br></br>
              <span id="quoteAuthor">By {author}</span>
            </div>
            <img src={owlImage}></img>
          </div>
          <div id="bottom">
            <div id="bottomCards">
              <div id="scoreCharts">
                <ChartsContainer tasks={tasks} />
              </div>
              <div id="Cards">
                <div id="Card1">
                  <lord-icon
                    src="https://cdn.lordicon.com/egmlnyku.json"
                    trigger="hover"
                    style={{ width: "70px", height: "70px" }}
                  ></lord-icon>
                  <p>We would Love your Feedback!</p>
                  <Link to={"https://forms.gle/8b7ZTfqMe2N7CreP7"}>
                    <button>Click Here</button>
                  </Link>
                </div>
                <div id="Card2">
                  <lord-icon
                    src="https://cdn.lordicon.com/tjiwvnho.json"
                    trigger="morph"
                    state="morph-destroyed"
                    style={{ width: "55px", height: "55px" }}
                  ></lord-icon>
                  <p>
                    Support us in Unlocking the Power of AI to Enhance Education
                    for All!
                  </p>
                  <Link>
                    <button>Click Here</button>
                  </Link>
                </div>
              </div>
            </div>
            <div id="bottomTasks">
              <TaskCardContainer
                tasks={getTop5TasksByDate(tasks)}
                toggleComplete={toggleComplete}
              />
            </div>
          </div>
        </div>
        <Chatbot username={username} />
      </div>
    </>
  );
}
