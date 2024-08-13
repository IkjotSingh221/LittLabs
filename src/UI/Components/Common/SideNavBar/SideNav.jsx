import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./SideNav.css";
import SideNavTaskTypeList from "./SideNavTaskTypeList";
import { createNewTaskType, deleteTaskTypeList } from "../../../API/todo.api";
import { readTodos, readTaskType } from "../../../API/todo.api.js";
import { readNotes } from '../../../API/note.api.js';
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
defineElement(lottie.loadAnimation);

const NavBar = ({ tasks, setTasks, taskTypeList, setTaskTypeList, notes, setNotes,username }) => {
  const [newTaskTypeName, setNewTaskTypeName] = useState("");
  const [newTaskTypeColor, setNewTaskTypeColor] = useState("#ffffff");
  const [uncompletedTasksCount, setUncompletedTasksCount] = useState(0);

  useEffect(()=>{
    loadTasks(username);
    loadTaskTypeList(username);
    loadNotes(username);
  },[]);

  // useEffect(()=>{
  //   loadTasks(username);
  // },[tasks]);

  // useEffect(()=>{
  //   loadTaskTypeList(username);
  // },[taskTypeList]);

  // useEffect(()=>{
  //   loadNotes(username);
  // },[notes]);


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

  useEffect(() => {
    const countUncompletedTasks = tasks.filter(
      (task) => !task.isCompleted
    ).length;
    setUncompletedTasksCount(countUncompletedTasks);
  }, [tasks]);

  const handleColorChange = (event) => {
    setNewTaskTypeColor(event.target.value);
  };

  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [isCreatingTaskType, setIsCreatingTaskType] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const toggleCreateTaskType = () => {
    setIsCreatingTaskType(!isCreatingTaskType);
    if (!isCreatingTaskType) {
      setNewTaskTypeName("");
      setNewTaskTypeColor("#ffffff");
    }
  };

  const addNewTaskType = async () => {
    setIsCreatingTaskType(!isCreatingTaskType);
    if (newTaskTypeName && newTaskTypeColor) {
      const taskType = {
        username: username,
        taskTypeName: newTaskTypeName,
        taskTypeColor: newTaskTypeColor,
      };
      const response = await createNewTaskType(taskType);
      setTaskTypeList((prevList) => [
        ...prevList,
        {
          taskTypeKey: response.taskTypeKey,
          taskTypeName: newTaskTypeName,
          taskColor: newTaskTypeColor,
        },
      ]);

      setNewTaskTypeName("");
      setNewTaskTypeColor("#ffffff");
      setIsCreatingTaskType(false);
    }
  };

  const deleteTaskType = async (deleteKey) => {
    const deleteTaskType = {
      username: username,
      taskTypeKey: deleteKey,
    };

    setTaskTypeList(
      taskTypeList.filter((taskType) => taskType.taskTypeKey !== deleteKey)
    );
    const response = await deleteTaskTypeList(deleteTaskType);

    console.log(response.data);
  };

  return (
    <div id="menu" style={{ flex: isNavbarOpen ? 0.7 : 0.1 }}>
      <div id="userprofile">
        <lord-icon
          src="https://cdn.lordicon.com/zfmcashd.json"
          trigger="hover"
          state="hover-jump"
          style={{ width: "50px", height: "50px" }}
          onClick={toggleNavbar}
        ></lord-icon>
        <p
          id="username"
          style={{
            display: isNavbarOpen ? "flex" : "none",
            position: "relative",
            top: 11,
            left: 4,
          }}
        >
          {username}
        </p>
      </div>

      <div id="tasks">
        <p style={{ display: isNavbarOpen ? "block" : "none"}}>Services</p>
        <ul>
          <NavLink to="/dashboard" activeClassName="active">
            <div className="tasks">
              <box-icon name="dashboard" type="solid"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Dashboard
              </li>
            </div>
          </NavLink>
          <NavLink to="/todo" activeClassName="active">
            <div className="tasks">
              <box-icon name="chevrons-right"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                To Do
              </li>
              <div
                className="number"
                style={{ display: isNavbarOpen ? "block" : "none" }}
              >
                <span>{uncompletedTasksCount}</span>
              </div>
            </div>
          </NavLink>
          <NavLink to="/calendar" activeClassName="active">
            <div className="tasks">
              <box-icon name="calendar"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Calendar
              </li>
            </div>
          </NavLink>
          <NavLink to="/notes" activeClassName="active">
            <div className="tasks">
              <box-icon name="note"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Notes
              </li>
            </div>
          </NavLink>
          <NavLink to="/interview-prep" activeClassName="active">
            <div className="tasks">
              <box-icon name="laptop"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Interview Preparation
              </li>
            </div>
          </NavLink>
          <NavLink to="/imagechat" activeClassName="active">
            <div className="tasks">
              <box-icon name="image-add"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                SnapSolver
              </li>
            </div>
          </NavLink>
          <NavLink to="/flashcard" activeClassName="active">
            <div className="tasks">
              <box-icon name="brain"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Memory Cards
              </li>
            </div>
          </NavLink>
          <NavLink to="/notesummary" activeClassName="active">
            <div className="tasks">
              <box-icon name='book-open'></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Summarizer
              </li>
            </div>
          </NavLink>
        </ul>
      </div>

      <div id="lists" style={{ display: isNavbarOpen ? "block" : "none" }}>
        <p>Upcoming</p>
        <ul>
          {taskTypeList.map((taskType) => (
            <SideNavTaskTypeList
              key={taskType.taskTypeKey}
              taskType={taskType}
              tasks={tasks}
              deleteTaskType={deleteTaskType}
            />
          ))}
        </ul>
        <button type="button" className="button" onClick={toggleCreateTaskType}>
          <span className="button__text">Add List</span>
          <span className="button__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              stroke="currentColor"
              height="24"
              fill="none"
              className="svg"
            >
              <line y2="19" y1="5" x2="12" x1="12"></line>
              <line y2="12" y1="12" x2="19" x1="5"></line>
            </svg>
          </span>
        </button>

        {isCreatingTaskType && (
          <div id="inputnewlist">
            <input
              id="selectedColor"
              type="color"
              value={newTaskTypeColor}
              onChange={handleColorChange}
            />

            <input
              id="selectedName"
              type="text"
              placeholder="Task Type"
              value={newTaskTypeName}
              onChange={(e) => setNewTaskTypeName(e.target.value)}
            ></input>

            <button onClick={addNewTaskType} id="taskListAddButton">
              Enter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
