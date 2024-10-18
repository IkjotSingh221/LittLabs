import React, { useState, useEffect } from "react";
import { createTodo } from "../../API/todo.api";
import summer from "../../Assets/Summer.gif";
import spring from "../../Assets/Spring.gif";
import fall from "../../Assets/Fall.gif";
import winter from "../../Assets/Winter.gif";

const AddTaskPanel = ({
  tasks,
  setTasks,
  taskTypeList,
  hideTaskPanel,
  username,
  setAddTask,
  setShowTask,
  addTask,
  showTask,
  heading,
  description,
  type,
  date,
  color,
}) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskType, setTaskType] = useState("");
  const [season, setSeason] = useState("");
  const [month, setMonth] = useState("");
  const [gifURL, setGifURL] = useState("");

  // Function to darken a color by a percentage
  const darkenColor = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  };

  // Darken the given color by 20%
  const darkenedColor = darkenColor(color, 20);

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

      newTask.taskKey = response.message;
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

  useEffect(() => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const [day, month, year] = date.split("-").map(Number);
    setSeason(getSeason(month));
    setMonth(monthNames[month - 1]);
    renderCalendar(date);
  }, [date]);

  function renderCalendar(dateString) {
    const [preferredDay, month, year] = dateString.split("-").map(Number);
    const calendarBody = document.getElementById("calendar-body");

    // Check if the calendarBody is found
    if (!calendarBody) {
      console.error("calendar-body element not found!");
      return; // Exit if the element is not found
    }

    calendarBody.innerHTML = ""; // Clear previous dates

    // Calculate the number of days in the month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Get the first day of the month (0 = Sunday, 6 = Saturday)
    const firstDay = new Date(year, month - 1, 1).getDay();

    // Get the last day of the month (0 = Sunday, 6 = Saturday)
    const lastDay = new Date(year, month - 1, daysInMonth).getDay();

    const calendarDays = [];

    calendarDays.push(`
    <div class="calendar-table__col">S</div>
    <div class="calendar-table__col">M</div>
    <div class="calendar-table__col">T</div>
    <div class="calendar-table__col">W</div>
    <div class="calendar-table__col">T</div>
    <div class="calendar-table__col">F</div>
    <div class="calendar-table__col">S</div>
`);

    // Fill in the days before the 1st of the month
    let prevMonthDays = firstDay; // number of days before the 1st
    if (prevMonthDays !== 0) {
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        let prevMonthDate = new Date(year, month - 1, -i);
        calendarDays.push(
          `<div class="calendar-table__col calendar-table__item prev-month">${prevMonthDate.getDate()}</div>`
        );
      }
    }

    // Fill in the days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(
        `<div class="calendar-table__col calendar-table__item" 
         ${day === preferredDay ? `id="ActiveDay" style="background-color: ${color}; color: white;"` : ''}>
         ${day}
     </div>`
      );
    }

    // Fill in the days after the last day of the month
    if (lastDay !== 6) {
      let daysToAdd = 6 - lastDay; // Days needed to complete the week
      for (let i = 1; i <= daysToAdd; i++) {
        let nextMonthDate = new Date(year, month - 1, daysInMonth + i);
        calendarDays.push(
          `<div class="calendar-table__col calendar-table__item next-month">${nextMonthDate.getDate()}</div>`
        );
      }
    }

    // Ensure the calendar has 7 days per row
    calendarBody.innerHTML = calendarDays.join("");

    const cols = document.querySelectorAll(".calendar-table__col");
    const totalDays = cols.length;
    const totalRows = Math.ceil(totalDays / 7);

    // Create and append rows
    for (let i = 0; i < totalRows; i++) {
      const row = document.createElement("div");
      row.className = "calendar-table__row"; // Add a class for styling
      for (let j = 0; j < 7; j++) {
        const index = i * 7 + j;
        if (index < totalDays) {
          row.appendChild(cols[index]);
        }
      }
      calendarBody.appendChild(row);
    }
  }

  function getSeason(month) {
    let s;
    switch (month) {
      case 11:
      case 0:
      case 1:
        s = "winter";
        setGifURL(winter);
        break;
      case 2:
      case 3:
      case 4:
        s = "spring";
        setGifURL(spring);
        break;
      case 5:
      case 6:
      case 7:
        s = "summer";
        setGifURL(summer);
        break;
      case 8:
      case 9:
      case 10:
        s = "fall";
        setGifURL(fall);
        break;
    }
    return s;
  }

  return (
    <>
      {showTask && (
        <div id="showTask">
          <div id="undoButton" onClick={hideTaskPanel}>
            <box-icon type="solid" name="chevron-right" color="white"></box-icon>
          </div>
          <div id="calendar-combined">
            <div id="cal_svg" style={{ backgroundImage: `url(${gifURL})` }}>
              <div id="current_month">{month}</div>
            </div>
            <div class="calendar-container1">
              <div class="calendar-container__body">
                <div class="calendar-table">
                  <div class="calendar-table__header">
                    <div class="calendar-table__row">
                      <div class="calendar-table__col"></div>
                      <div class="calendar-table__col"></div>
                      <div class="calendar-table__col"></div>
                      <div class="calendar-table__col"></div>
                      <div class="calendar-table__col"></div>
                      <div class="calendar-table__col"></div>
                      <div class="calendar-table__col"></div>
                    </div>
                  </div>
                  <div class="calendar-table__body" id="calendar-body">
                    {renderCalendar(date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="taskDetails"></div>
          <div id="showTaskDetails">
            <div id="thisdiv">
              <div id="taskheading">
                {heading}
              </div>
              <div id="taskdate">
                <box-icon name='time-five'></box-icon>
                {date}
              </div>
            </div>
            <div id="taskdescription">
              {description}
            </div>
          </div>
        </div>
      )}
      {addTask && (
        <div id="createNewTask">
          <div id="undo" onClick={hideTaskPanel}>
            <box-icon type="solid" name="chevron-right"></box-icon>
          </div>
          <h2>Task:</h2>
          <form onSubmit={addTaskToTasksList}>
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
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div id="chooselist">
              <label htmlFor="selectList" id="selectListLabel">
                Type of Task
              </label>
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
                Reset
              </button>
              <button id="savebutton" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddTaskPanel;
