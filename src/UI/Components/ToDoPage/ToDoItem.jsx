import React from 'react';
import "boxicons";

const ToDoItem = ({ taskKey, task, deleteToDo, toggleComplete }) => {
    const handleCheckboxChange = async () => {
        toggleComplete(taskKey);
    };

    return (        
        <li className="newtodo" key={taskKey}>
            <div className="taskTypeStrip" style={{ background: task.taskColor }}></div>
            <input 
                type="checkbox" 
                checked={task.isCompleted} 
                onChange={handleCheckboxChange} 
            />
            <p>{task.taskName.length>10? task.taskName.slice(0,10)+"...":task.taskName}</p>
            <div id="todocalender"> 
                <div id="tododuedate" >
                <box-icon name='calendar' size='15px' ></box-icon>
                </div>
                {task.dueDate}
            </div>
            <div className="deletetodo" onClick={() => deleteToDo(taskKey)}>
                <box-icon name='trash' size='20px'></box-icon>
            </div>
            <div className="tododescription">
                {task.taskDescription.length > 15 ? task.taskDescription.slice(0, 12) + "..." : task.taskDescription}
            </div>
        </li>
    );
};

export default ToDoItem;