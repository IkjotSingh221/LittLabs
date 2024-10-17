import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import LearnMore from "./UI/Components/MainPage/NewLandingPage";
import ForgotPassword from "./UI/Components/LoginSignupPage/ForgotPass";
import LandingPage from "./UI/Components/MainPage/LandingPage";
import LoginSignup from "./UI/Components/LoginSignupPage/LoginSignup";
import ToDoPage from "./UI/Components/ToDoPage/ToDoPage";
import Notes from "./UI/Components/NotesPage/NotesPage";
import Calendar from "./UI/Components/Calendar/Calendar";
import Flashcards from './UI/Components/Flashcards/FlashcardPage';
import ChatWithImage from "./UI/Components/ChatWithImage/ChatWithImage";
import Dashboard from "./UI/Components/Dashboard/Dashboard";
import InterviewPrepAnalyzer from "./UI/Components/InterviewPreparationAnalyzer/InterviewPreparationAnalyzer";
import NoteSummary from "./UI/Components/NoteSummarizer/NoteSummarizer";
import SideNav from "./UI/Components/Common/SideNavBar/SideNav";
import Community from "./UI/Components/Community/CommunityPage";
import ResumeScorer from "./UI/Components/Resume Scorer/ResumeScorer";
import Chatbot from "./UI/Components/Common/ChatBot/ChatBot";

function App() {
  const location = useLocation();
  const shouldShowSideNav = !['/', '/login-signup', '/forgotpass', '/learn-more'].includes(location.pathname);
  const noChatbotPaths = ['/', '/login-signup', '/learn-more', '/forgotpass', '/imagechat','/scorer'];

  const [error, setError] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");
  const [showSuccess, setSuccess] = useState(false);
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
  const [upcoming, setUpcoming] = useState(false);
  const [upcomingButton, setUpcomingButton] = useState(false);
  const [studentCorner, setStudentCorner] = useState(false);
  const [profCorner, setProfCorner] = useState(false);
  return (
    // <Router> 
    <div className="app-container">
      {shouldShowSideNav && (
        <SideNav
          tasks={tasks}
          setTasks={setTasks}
          taskTypeList={taskTypeList}
          setTaskTypeList={setTaskTypeList}
          notes={notes}
          setNotes={setNotes}
          username={username}
          setUpcoming={setUpcoming}
          setUpcomingButton={setUpcomingButton}
          upcoming={upcoming}
          upcomingButton={upcomingButton}
          studentCorner={studentCorner}
          setStudentCorner={setStudentCorner}
          profCorner={profCorner}
          setProfCorner={setProfCorner}
        />
      )}
      <div className="content-container">
        {!noChatbotPaths.includes(location.pathname) && <Chatbot username={username} />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            exact
            path="/login-signup"
            element={<LoginSignup error={error} setError={setError} successfulMessage={successfulMessage} setSuccessfulMessage={setSuccessfulMessage} showSuccess={showSuccess} setSuccess={setSuccess} />}
          />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route
            exact
            path="/forgotpass"
            element={<ForgotPassword error={error} setError={setError} setSuccessfulMessage={setSuccessfulMessage} setSuccess={setSuccess} />}
          />
          <Route path="/dashboard" element={<Dashboard tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} setUpcoming={setUpcoming} setUpcomingButton={setUpcomingButton} />}></Route>
          <Route path="/todo" element={<ToDoPage tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} username={username} setUpcoming={setUpcoming} setUpcomingButton={setUpcomingButton} />}></Route>
          <Route path="/notes" element={<Notes tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} />}></Route>
          <Route path="/flashcard" element={<Flashcards tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} />}></Route>
          <Route path="/imagechat" element={<ChatWithImage tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} />}></Route>
          <Route path="/interview-prep" element={<InterviewPrepAnalyzer tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} />}></Route>
          <Route path="/calendar" element={<Calendar tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} setUpcoming={setUpcoming} setUpcomingButton={setUpcomingButton} />}></Route>
          <Route path="/notesummary" element={<NoteSummary tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} />}></Route>
          <Route path="/community" element={<Community tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} setUpcoming={setUpcoming} setUpcomingButton={setUpcomingButton} />}></Route>
          <Route path="/scorer" element={<ResumeScorer tasks={tasks} setTasks={setTasks} taskTypeList={taskTypeList} setTaskTypeList={setTaskTypeList} notes={notes} setNotes={setNotes} username={username} setUpcoming={setUpcoming} setUpcomingButton={setUpcomingButton} />}></Route>

        </Routes>
      </div>
    </div>
    // </Router>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}