import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SideNav.css";
import SideNavTaskTypeList from "./SideNavTaskTypeList";
import { createNewTaskType, deleteTaskTypeList } from "../../../API/todo.api";

const NavBar = ({ tasks, taskTypeList, setTaskTypeList, username }) => {
  const [newTaskTypeName, setNewTaskTypeName] = useState("");
  const [newTaskTypeColor, setNewTaskTypeColor] = useState("#ffffff");
  const [uncompletedTasksCount, setUncompletedTasksCount] = useState(0);

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
        taskTypeColor: newTaskTypeColor
      }
      const response = await createNewTaskType(taskType)
      setTaskTypeList((prevList) => [
        ...prevList,
        { taskTypeKey: response.taskTypeKey, taskTypeName: newTaskTypeName, taskColor: newTaskTypeColor },
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
    <div id="menu" style={{ flex: isNavbarOpen ? 0.2 : 0.04 }}>
      <div id="userprofile">
        <box-icon name="user" onClick={toggleNavbar}></box-icon>
        <p
          id="username"
          style={{
            display: isNavbarOpen ? "flex" : "none",
            position: "relative",
            top: 4,
            left: 4,
          }}
        >
          {username}
        </p>
      </div>

      <div id="tasks">
        <p style={{ display: isNavbarOpen ? "block" : "none" }}>Services</p>
        <ul>
          <Link to="/dashboard">
            <div className="tasks">
              <box-icon name='dashboard' type='solid' ></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Dashboard
              </li>
            </div>
          </Link>
          <Link to="/todo">
            <div className="tasks">
              <box-icon name="chevrons-right"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>To Do</li>
              <div
                className="number"
                style={{ display: isNavbarOpen ? "block" : "none" }}
              >
                <span>{uncompletedTasksCount}</span>
              </div>
            </div>
          </Link>
          <Link to="/calendar">
            <div className="tasks">
              <box-icon name="calendar"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Calendar
              </li>
            </div>
          </Link>
          <Link to="/notes">
            <div className="tasks">
              <box-icon name="note"></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Notes
              </li>
            </div>
          </Link>
          <Link to="/interview-prep">
            <div className="tasks">
              <box-icon name='laptop'></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Interview Preparation
              </li>
            </div>
          </Link>
          <Link to="/imagechat">
            <div className="tasks">
              <box-icon name='image-add'></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                SnapSolver
              </li>
            </div>
          </Link>
          <Link to="/flashcard">
            <div className="tasks">
              <box-icon name='brain'></box-icon>
              <li style={{ display: isNavbarOpen ? "block" : "none" }}>
                Memory Cards
              </li>
            </div>
          </Link>
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