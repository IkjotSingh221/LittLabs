import React, { useState, useEffect, useRef } from "react";
import "./ToDoPage.css";
import NavBar from "../Common/SideNavBar/SideNav";
import ToDoList from "./ToDoList";
import ScoreMeter from "./ScoreMeterHolder";
import AddTaskPanel from "./AddTaskPanel";
import Chatbot from "../Common/ChatBot/ChatBot";
import { readTaskType, readTodos } from "../../API/todo.api";
const ToDoPage = ({
  tasks,
  setTasks,
  taskTypeList,
  setTaskTypeList,
  username,
  setUpcoming,
  setUpcomingButton
}) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [isAddTaskPanelVisible, setIsAddTaskPanelVisible] = useState(false);

  useEffect(() => {
    setCurrentDay(new Date().getDate());
    // loadTasks(username);
    // loadTaskTypeList(username);
    setUpcoming(true);
    setUpcomingButton(true);
  }, []);

  // useEffect(() => {
  //   loadTasks(username);
  //   loadTaskTypeList(username);
  // }, [tasks, taskTypeList]);

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

  const toggleAddTaskPanel = () => {
    setIsAddTaskPanelVisible(!isAddTaskPanelVisible);
  };

  const toggleComplete = (taskKey) => {
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
      <div id="todopage">

        <div id="todos">
          <div id="date">
            <h1 id="greeting" onClick={(e)=>console.log(tasks)}>Hello {username}!</h1>
            <div id="currentDay">{currentDay}</div>
          </div>
          <button className="addTaskButton" onClick={toggleAddTaskPanel}>
            <span id="addTaskText">Add New Task</span>
            <div id="addTaskIconDiv"></div>
            <box-icon id="addTaskIcon" name="plus"></box-icon>
          </button>
          <ToDoList
            divId="todaytasks"
            listTitle="Today's Tasks"
            tasks={tasks}
            setTasks={setTasks}
            toggleComplete={toggleComplete}
            username={username}
          />
          <ToDoList
            divId="tomorrowtasks"
            listTitle="Tomorrow's Tasks"
            tasks={tasks}
            setTasks={setTasks}
            toggleComplete={toggleComplete}
            username={username}
          />
          <ToDoList
            divId="thisweektasks"
            listTitle="Later this week"
            tasks={tasks}
            setTasks={setTasks}
            toggleComplete={toggleComplete}
            username={username}
          />
          <ScoreMeter tasks={tasks} />

          <div className={`addTaskPanel ${isAddTaskPanelVisible ? 'visible' : 'hidden'}`}>
            <AddTaskPanel
              tasks={tasks}
              setTasks={setTasks}
              taskTypeList={taskTypeList}
              hideTaskPanel={toggleAddTaskPanel}
              username={username}
            />
          </div>
        </div>
      </div>
      <Chatbot username={username} />
    </>
  );
};

export default ToDoPage;
