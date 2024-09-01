import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem'; 
import { deleteTodo, completeTodo } from '../../API/todo.api';

const ToDoList = ({ divId, listTitle, tasks, setTasks, username }) => {
    const [filteredTasks, setFilteredTasks] = useState([]);

    const filterTasksByDate = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('-').map(Number);
            const ParsedDate = new Date(year, month - 1, day); 
            ParsedDate.setHours(0, 0, 0, 0);
            return ParsedDate
          };

        switch (divId) {
            case "todaytasks":
                return tasks.filter(task => parseDate(task.dueDate) <= today);
            case "tomorrowtasks":
                return tasks.filter(task => parseDate(task.dueDate).toDateString() == tomorrow.toDateString());
            case "thisweektasks":
                return tasks.filter(task => parseDate(task.dueDate) > tomorrow);
            default:
                return [];
        }
    };

    useEffect(() => {
        setFilteredTasks(filterTasksByDate());
    }, [tasks]);

    const deleteToDo = async (deleteKey) => {
        const ToDoDelete = {
            username: username,
            taskKey: deleteKey
        }
        const response = await deleteTodo(ToDoDelete);
        console.log(response.message);
        setTasks(tasks.filter(task => task.taskKey !== deleteKey));
    };

    const toggleComplete = async (taskKey) => {
        let currentCompletionStatus = filteredTasks.filter((task)=> (task.taskKey===taskKey))[0].isCompleted;
        const todo = {username:username, taskKey:taskKey, isCompleted:!currentCompletionStatus};
        
        setTasks(tasks.map(task => 
            task.taskKey === taskKey ? { ...task, isCompleted: !task.isCompleted } : task
        ));
        const response = await completeTodo(todo);
    };

    

    return (
        <div id={divId}>
            <h2>{listTitle}</h2>
            <ul>
                {filteredTasks.map((task) => (
                    <ToDoItem
                        key={task.taskKey}
                        taskKey={task.taskKey}
                        task={task}
                        deleteToDo={deleteToDo}
                        toggleComplete={toggleComplete}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ToDoList;