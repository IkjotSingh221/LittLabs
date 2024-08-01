import React, { useState } from "react";
import { createTodo } from "../../API/todo.api";

const AddTaskPanel = ({
  tasks,
  setTasks,
  taskTypeList,
  hideTaskPanel,
  username,
}) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskType, setTaskType] = useState("");

  const addTaskToTasksList = async (event) => {
    event.preventDefault();

    let finalDueDate = dueDate || new Date().toISOString().split("T")[0];
    const [year, month, day] = finalDueDate.split("-");
    finalDueDate = `${day}-${month}-${year}`;

    const taskColor = taskTypeList.find(
      (type) => type.taskTypeName === taskType
    )?.taskColor;
    const newTask = {
      username,
      taskName,
      taskDescription,
      dueDate: finalDueDate,
      taskType,
      taskColor,
      isCompleted: false,
    };

    try {
      const response = await createTodo(newTask);

      newTask.taskKey = response.taskKey;
      delete newTask.username;
      setTasks([...tasks, newTask]);
      removeContent();
      hideTaskPanel();
    } catch (error) {
      console.error(
        "Error creating task:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const removeContent = () => {
    setTaskName("");
    setTaskDescription("");
    setDueDate("");
    setTaskType("");
  };

  return (
    <div id="createNewTask">
      <div id="undo" onClick={hideTaskPanel}>
        <box-icon type="solid" name="chevron-right"></box-icon>
      </div>
      <h2>Task:</h2>
      <form onSubmit={addTaskToTasksList} method="POST" action="">
        <input
          type="text"
          name="heading"
          id="addtask"
          placeholder="Add Task Heading"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <input
          type="text"
          name="description"
          id="description"
          placeholder="Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        />
        <div id="duedatediv">
          <input
            type="date"
            name="dueDate"
            placeholder="Due Date (DD-MM-YYYY)"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div id="chooselist">
          <label htmlFor="selectList" id="selectListLabel">Type of Task</label>
          <select
            required
            id="selectList"
            value={taskType}
            name="selectedList"
            onChange={(e) => setTaskType(e.target.value)}
          >
            <option value="" disabled>
              Choose a type
            </option>
            {taskTypeList.map((li, index) => (
              <option key={index} value={li.taskTypeName}>
                {li.taskTypeName}
              </option>
            ))}
          </select>
        </div>
        <div id="buttons">
          <button type="button" onClick={removeContent}>
            Delete Task
          </button>
          <button id="savebutton" type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskPanel;