import React, { useState, useEffect } from 'react';
import './InterviewPreparationAnalyzer.css';
import NavBar from "../Common/SideNavBar/SideNav";
import { readTodos, readTaskType } from "../../API/todo.api";
import {ThreeDots} from 'react-loader-spinner';
import Chatbot from "../Common/ChatBot/ChatBot.jsx";

const InterviewPrepAnalyzer = ({ username }) => {

  // useEffect(() => { 
  //   loadTasks(username);
  //   loadTaskTypeList(username);
  // }, [username]);

  // const loadTasks = async (username) => {
  //   try {
  //     const todos = await readTodos(username);
  //     const mappedTasks = todos.map((task) => ({
  //       taskKey: task.taskKey,
  //       taskName: task.taskName,
  //       taskDescription: task.taskDescription,
  //       dueDate: task.dueDate,
  //       taskColor: task.taskColor,
  //       taskType: task.taskType,
  //       isCompleted: task.isCompleted,
  //     }));
  //     setTasks(mappedTasks);
  //   } catch (error) {
  //     console.error("Error loading tasks:", error);
  //   }
  // };

  // const loadTaskTypeList = async (username) => {
  //   try {
  //     const taskTypes = await readTaskType(username);
  //     const mappedTaskTypeList = taskTypes.map((taskType) => ({
  //       taskTypeKey: taskType.taskTypeKey,
  //       taskTypeName: taskType.taskTypeName,
  //       taskColor: taskType.taskTypeColor,
  //     }));
  //     setTaskTypeList(mappedTaskTypeList);
  //   } catch (error) {
  //     console.error("Error loading task types:", error);
  //   }
  // };

  const [videoSrc, setVideoSrc] = useState('');
  const [scores, setScores] = useState({
    vocabulary: 0,
    confidence: 0,
    engaging: 0,
    speakingStyle: 0,
    overallPerformance: 0, 
  });
  const [review, setReview] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const displayNames = {
    vocabulary: 'Vocabulary',
    confidence: 'Confidence',
    engaging: 'Engaging Ability',
    speakingStyle: 'Speaking Style',
    overallPerformance: 'Overall Performance', 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const videoLink = URL.createObjectURL(file);
    setVideoSrc(videoLink);
    setResponse('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", e.target.videoFile.files[0]);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      console.log(data);
      if (!data) {
        throw new Error("Invalid response structure.");
      }
      const vocabulary = data.vocabulary;
      const confidence_level = data.confidence_level;
      const engaging_ability = data.engaging_ability;
      const speaking_style = data.speaking_style;
      const overall_average = data.overall_average;
      const review = data.review;
      // error might be here

      setScores({ vocabulary, confidence: confidence_level, engaging: engaging_ability, speakingStyle: speaking_style, overallPerformance: overall_average });
      setReview(review);
      setResponse('Video processed successfully!');
      setError('');
    } catch (error) {
      console.error("Error:", error);
      setResponse('');
      setError("Error occurred while fetching Data. Please provide a video as input. Acceptable formats are .mp4, .avi, .mkv");
    }finally {
      setLoading(false);
    }
  };

  const getBarColor = (score) => {
    if (score <= 2) return '#FE9903';
    if (score <= 5) return '#FECE00';
    if (score <= 8) return '#8ED203';
    return '#00BF11';
  };

  return ( 
    <div className="container">
      <div className="content-wrapper">
        <div className="upload-metrics-container">
          <div className="upload-area">
            <form id="video-upload-form" onSubmit={handleSubmit}>
              <div id="drop-area" onClick={() => document.getElementById('input-file').click()}>
                <input
                  type="file"
                  id="input-file"
                  name="videoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {!videoSrc && (
                  <label htmlFor="input-file" className="drop-label">
                    Drag & Drop or Click to Upload Video
                  </label>
                )}
                {videoSrc && (
                  <div id="video-view">
                    <video src={videoSrc} controls className="uploaded-video" />
                  </div>
                )}
              </div>
              <button id="submit-btn" type="submit">
                Upload
              </button>
            </form>
            {loading && (
              <div className="loader">
                <ThreeDots type="ThreeDots" color="#4F29F0" height={80} width={80} />
              </div>
            )}
            <div id="error">{error}</div>
            <div className="review-box">
              <h3>Review</h3>
              <p>{review}</p>
            </div>
          </div>
          <div className="meter-container">
            {Object.keys(scores).map((key) => (
              <div key={key} className="meter">
                <span className="meter-label">{displayNames[key]}</span>
                <div
                  className="meter-bar"
                  style={{
                    width: `${scores[key] * 10}%`,
                    backgroundColor: getBarColor(scores[key]),
                  }}
                ></div>
                <span className="meter-score">{scores[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Chatbot username={username}/>
    </div>
  );
};

export default InterviewPrepAnalyzer;