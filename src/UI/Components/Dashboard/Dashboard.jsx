import * as React from 'react';
import { useEffect, useState } from 'react';
import TaskCardContainer from './TaskCardContainer';
import ChartsContainer from './ChartHolder';
import './Dashboard.css';
import owlImage from '../../Assets/dashboardOwl.png';
import NavBar from '../Common/SideNavBar/SideNav';
import { readTodos, readTaskType } from "../../API/todo.api.js";
import { readNotes } from '../../API/note.api.js';
import { Link } from 'react-router-dom';
import Chatbot from '../Common/ChatBot/ChatBot.jsx';

const loadLordIconScript = () => {
  const script = document.createElement('script');
  script.src = "https://cdn.lordicon.com/lordicon.js";
  script.async = true;
  document.body.appendChild(script);
};



export default function Dashboard({ tasks, setTasks, taskTypeList, setTaskTypeList, notes, setNotes, username }) {

  useEffect(() => {
    loadLordIconScript();
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
      setTaskTypeList(mappedTaskTypeList);
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


  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is zero-indexed
  };

  const formatDateToOriginal = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getFiveLowestRecentDueDates = () => {
    return tasks
      .filter(task => !task.isCompleted)
      .map(task => ({
        ...task,
        dueDate: parseDate(task.dueDate)  // Convert dueDate to Date object for sorting
      }))
      .sort((a, b) => a.dueDate - b.dueDate)  // Sort by due date ascending
      .slice(0, 5)  // Get the top 5 most recent tasks
      .map(task => ({
        ...task,
        dueDate: formatDateToOriginal(task.dueDate)  // Convert dueDate back to original format
      }));
  };

  return (
    <div id="dashBoardPage">
      {/* <div id="navibar"></div> */}
      <NavBar
        tasks={tasks}
        taskTypeList={taskTypeList}
        setTaskTypeList={setTaskTypeList}
        username={username}
      />
      <div id="dashBoardMain">
        <div id="welcomeCard">
          <div id="Welcomeuser">Welcome {username}!</div>
          <div id="Quote">There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...</div>
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
                  style={{ width: '70px', height: '70px' }}>
                </lord-icon>
                <p>We would Love your Feedback!</p>
                <Link to={'https://forms.gle/8b7ZTfqMe2N7CreP7'}>
                  <button>Click Here</button></Link>
              </div>
              <div id="Card2">
                <lord-icon
                  src="https://cdn.lordicon.com/tjiwvnho.json"
                  trigger="morph"
                  state="morph-destroyed"
                  style={{ width: '55px', height: '55px' }}
                >
                </lord-icon>
                <p>Support us in Unlocking the Power of AI to Enhance Education for All!</p>
                <Link>
                  <button>Click Here</button></Link>
              </div>
            </div>

          </div>
          <div id="bottomTasks">
            <TaskCardContainer tasks={getFiveLowestRecentDueDates()} />
          </div>
        </div>
      </div>
      <Chatbot username={username}/>
    </div>
  );
};