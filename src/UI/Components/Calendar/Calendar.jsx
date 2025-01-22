import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { generateDate, months } from "./cal-func";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import "./Calendar.css";
import { createTodo } from "../../API/todo.api.js";
import { readTodos, readTaskType } from "../../API/todo.api.js";
import Chatbot from "../Common/ChatBot/ChatBot.jsx";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const formatDate = (date) => {
  // Format date to dd-mm-yyyy
  const day = String(date.date()).padStart(2, "0");
  const month = String(date.month() + 1).padStart(2, "0"); // month() is zero-indexed
  const year = date.year();
  return `${day}-${month}-${year}`;
};

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-").map(Number); // Expecting dd-mm-yyyy
  const parsedDate = new Date(year, month - 1, day);
  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

function EventCard({ events }) {
  console.log("EventCard events:", events);

  if (events.length === 0) {
    return (
      <div className="event-card">
        <h2>Upcoming</h2>
        <p>No tasks, phew!</p>
      </div>
    );
  }

  return (
    <div className="event-card">
      <h2>Upcoming</h2>
      {events.map((event, index) => (
        <div key={index} className="event-item">
          <span className="event-name">
            {event.taskName.length > 15
              ? `${event.taskName.substring(0, 15)}...`
              : event.taskName}
          </span>
          <span className="event-description">
            {event.taskDescription.length > 10
              ? `${event.taskDescription.substring(0, 10)}...`
              : event.taskDescription}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Calendar({ tasks, setTasks, taskTypeList, setTaskTypeList, username }) {
  const today = dayjs();
  const [selectDate, setSelectDate] = useState(today);
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskType, setTaskType] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);

  const currentDate = formatDate(today);

  useEffect(() => {
    setSelectedDate(selectDate);
  }, [selectDate]);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setTaskName("");
    setTaskDescription("");
    setDueDate("");
    setTaskType("");
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    let finalDueDate = dueDate || formatDate(today);

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
      closeModal();
    } catch (error) {
      console.error("Error creating task:", error.response ? error.response.data : error.message);
    }
  };

  const eventDots = (date) => {
    const taskDots = tasks
      .filter((task) => {
        const taskDate = parseDate(task.dueDate);
        return (
          taskDate instanceof Date &&
          taskDate.toDateString() === date.toDate().toDateString() &&
          task.isCompleted === false
        );
      })
      .map((task, index) => (
        <span
          key={index}
          className="event-dot"
          style={{ backgroundColor: task.taskColor }}
        ></span>
      ));

    return <div className="event-dot-container">{taskDots}</div>;
  };

  const handleDateClick = (date) => {
    setSelectDate(date);
    setSelectedDate(date);
  };

  const filteredTasks = tasks.filter(task => {
    const taskDate = parseDate(task.dueDate);
    if (isNaN(taskDate)) {
      console.error("Invalid task date:", task.dueDate);
      return false;
    }
    return taskDate.toDateString() === selectedDate.toDate().toDateString() && task.isCompleted === false;
  });

  return (
    <div className="calendar-page">
      <div className="main-content">
        <div className="calendar-container">
          <div className="leftCol">
            <div className="date-display">
              <div>{currentDate}</div>
            </div>
            <EventCard events={filteredTasks} />
          </div>
          <div className="rightCol">
            <div className="year-display">{selectDate.year()}</div>
            <div className="Calendar-container">
              <div className="Calendar-header">
                <div className="Calendar-navigation">
                  <GrFormPrevious
                    className="navigation-arrow"
                    onClick={() => setSelectDate(selectDate.month(selectDate.month() - 1))}
                  />
                  <div className="month-display">
                    <h1>{months[selectDate.month()]}</h1>
                  </div>
                  <GrFormNext
                    className="navigation-arrow"
                    onClick={() => setSelectDate(selectDate.month(selectDate.month() + 1))}
                  />
                </div>
              </div>
              <div className="Calendar-days">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, index) => (
                  <h1 key={index} className="Calendar-day">
                    {day}
                  </h1>
                ))}
              </div>
              <div className="Calendar-days">
                {generateDate(selectDate.month(), selectDate.year()).map(
                  ({ date, currentMonth, today }, index) => (
                    <div
                      key={index}
                      className="Calendar-date-container"
                      onClick={() => handleDateClick(date)}
                      onDoubleClick={() => {
                        setSelectedDate(date);
                        setSelectDate(date);
                        openModal();
                      }}
                    >
                      <h1
                        className={cn(
                          "Calendar-date",
                          currentMonth ? "current-month" : "not-current-month",
                          today ? "today" : "",
                          selectDate.toDate().toDateString() ===
                          date.toDate().toDateString()
                            ? "selected"
                            : ""
                        )}
                      >
                        {date.date()}
                      </h1>
                      {eventDots(date)}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
              <form onSubmit={handleAddEvent}>
                <div className="form-field">
                  <label>Task Name</label>
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Description</label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="form-field">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Type of Task</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Choose a type
                    </option>
                    {taskTypeList.map((type, index) => (
                      <option key={index} value={type.taskTypeName}>
                        {type.taskTypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="modal-button">
                  Add Task
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Chatbot username={username} setTasks={setTasks}/>
    </div>
  );
}
