import React, { useEffect, useState } from 'react';
import "boxicons";
import "./ChatWithImage.css";
import axios from 'axios';
import MessageBubble from './ChatBubble';
import NavBar from '../Common/SideNavBar/SideNav.jsx';
import { readTaskType, readTodos } from "../../API/todo.api.js";

const ChatWithImage = ({ tasks, setTasks, taskTypeList, setTaskTypeList, username }) => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [textMessage, setTextMessage] = useState("");
    const [imageMessage, setImageMessage] = useState(null);

    useEffect(() => {
        loadTasks(username);
        loadTaskTypeList(username);
    }, [username]);

    const loadTasks = async (username) => {
        try {
            const todos = await readTodos(username);
            const mappedTasks = todos.map((task) => ({
                taskKey: task.taskKey,
                taskName: task.taskName,
                taskDescription: task.taskDescription,
                dueDate: task.dueDate,
                taskColor: task.taskColor,
                taskType: task.taskType,
                isCompleted: task.isCompleted,
            }));
            setTasks(mappedTasks);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    const loadTaskTypeList = async (username) => {
        try {
            const taskTypes = await readTaskType(username);
            const mappedTaskTypeList = taskTypes.map((taskType) => ({
                taskTypeKey: taskType.taskTypeKey,
                taskTypeName: taskType.taskTypeName,
                taskColor: taskType.taskTypeColor,
            }));
            setTaskTypeList(mappedTaskTypeList);
        } catch (error) {
            console.error("Error loading task types:", error);
        }
    };

    const generateChatbotResponse = async (textMessage, imageMessage) => {
        const formData = new FormData();
        if (imageMessage) {
            formData.append('file', imageMessage);
        }
        formData.append('userPrompt', textMessage);

        try {
            const response = await axios.post('http://localhost:8000/imagesolver/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.response;
        } catch (error) {
            console.error("Error generating chatbot response:", error);
            return "Sorry, there was an error processing your request.";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (textMessage.trim() === "" && !imageMessage) return;

        const newUserChatHistory = [...messageHistory];
        if (textMessage.trim() !== "") {
            newUserChatHistory.push({ sender: "user", text: textMessage, image: null });
        }
        if (imageMessage) {
            newUserChatHistory.push({ sender: "user", text: "", image: imageMessage });
        }
        setMessageHistory(newUserChatHistory);

        const chatbotResponse = await generateChatbotResponse(textMessage, imageMessage);
        const newBotChatHistory = [...newUserChatHistory, { sender: "chatbot", text: chatbotResponse, image: null }];
        setMessageHistory(newBotChatHistory);

        setTextMessage("");
        setImageMessage(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageMessage(file);
    };

    return (
        <div id="ImageNotePage">
            <NavBar
                tasks={tasks}
                taskTypeList={taskTypeList}
                setTaskTypeList={setTaskTypeList}
                username={username}
            />
            <div id="pageMain">
                <div id="pageNavBar">
                    <span id="nav-bar-text">Chat</span>
                </div>
                <div id="pageMessagingArea">
                    <div id="Messages">
                        {messageHistory.map((msg, index) => (
                            <MessageBubble key={index} sender={msg.sender} text={msg.text} image={msg.image} />
                        ))}
                    </div>
                </div>
                <div id="pageInputArea">
                    <form onSubmit={handleSubmit} method='POST'>
                        <div id="uploadedImage">
                            {imageMessage && <img id="imageininput" src={URL.createObjectURL(imageMessage)} alt="uploaded" />}
                        </div>
                        <label htmlFor="fileUploader" style={{ cursor: 'pointer' }}>
                            {!imageMessage && <box-icon name='image-add' size="25px"></box-icon>}
                        </label>
                        <input id="fileUploader" name="imageMessage" onChange={handleFileChange} type="file" />
                        <input id="textMessage" name="textMessage" value={textMessage} onChange={(event) => setTextMessage(event.target.value)} type="text" placeholder="Send a Message..." />
                        <button type="submit"><box-icon name='send' type='solid' color='white'></box-icon></button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatWithImage;