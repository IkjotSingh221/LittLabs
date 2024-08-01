import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./UI/Components/MainPage/LandingPage";
import LoginSignup from "./UI/Components/LoginSignupPage/LoginSignup";
import ToDoPage from "./UI/Components/ToDoPage/ToDoPage";
import Notes from "./UI/Components/NotesPage/NotesPage";
import Calendar from "./UI/Components/Calendar/Calendar";
import Flashcards from './UI/Components/Flashcards/FlashcardPage';
import ChatWithImage from "./UI/Components/ChatWithImage/ChatWithImage";
import Dashboard from "./UI/Components/Dashboard/Dashboard";
import InterviewPrepAnalyzer from "./UI/Components/InterviewPreparationAnalyzer/InterviewPreparationAnalyzer";

function App() {
  const [error, setError] = useState("");
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }
  const username = getCookie("username");
  const [tasks, setTasks] = useState([]);
  // const [username, setUsername] = useState("");
  const [taskTypeList, setTaskTypeList] = useState([]);
  const [notes, setNotes] = useState([]);
  return (
    <Router> 
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            exact
            path="/login-signup"
            element={<LoginSignup error={error} setError={setError} />}
          />
          <Route path="/dashboard" element={<Dashboard tasks = {tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} />}></Route>
          <Route path="/todo" element={<ToDoPage tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} username={username}/>}></Route>
          <Route path="/notes" element={<Notes tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username}/>}></Route>
          <Route path="/flashcard" element={<Flashcards tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username}/>}></Route>
          <Route path="/imagechat" element={<ChatWithImage tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username}/>}></Route>
          <Route path="/interview-prep" element={<InterviewPrepAnalyzer tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username}/>}></Route>
          <Route path="/calendar" element={<Calendar tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username}/>}></Route>
          {/* <Route path="" element={}></Route>
          <Route path="" element={}></Route>
          <Route path="" element={}></Route>
          <Route path="" element={}></Route>
          <Route path="" element={}></Route> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
