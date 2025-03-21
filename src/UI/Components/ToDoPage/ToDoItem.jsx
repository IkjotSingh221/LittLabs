import React from 'react';
import "boxicons";

const ToDoItem = ({ taskKey, task, deleteToDo, toggleComplete, handleClick}) => {
    const handleCheckboxChange = async () => {
        toggleComplete(taskKey); 
    };

    return (
        <>
            <div id="showText">  
                hello
            </div>
            <li className="newtodo" key={taskKey}> 

                <div className="taskTypeStrip" style={{ background: task.taskColor }}></div>
                <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={handleCheckboxChange}
                />
                <p className="task-name" onClick={()=>{handleClick(task)}}>
                    <span className="task-name-tooltip">
                        {task.taskName.length > 10
                            ? task.taskName.slice(0, 10) + "..."
                            : task.taskName
                        }
                        {/* <span className="task-name-full"> 
                            {task.taskName}
                        </span> */}
                    </span>
                </p>
                <div id="todocalender" onClick={()=>{handleClick(task)}}>
                    <div id="tododuedate" >
                        <box-icon name='calendar' size='15px' ></box-icon>
                    </div>
                    {task.dueDate}
                </div>
                <div className="deletetodo" onClick={(e) => {
                        e.stopPropagation(); // Prevents handleClick from being triggered
                        deleteToDo(taskKey);
                    }}>
                    <box-icon name='trash' size='20px'></box-icon>
                </div>
                <div className="tododescription" onClick={()=>{handleClick(task)}}>
                    <span className="description-tooltip">
                        {task.taskDescription.length > 15
                            ? task.taskDescription.slice(0, 12) + "..."
                            : task.taskDescription
                        }
                        {/* <span className="description-full">
                            {task.taskDescription}
                        </span> */}
                    </span>
                </div>
            </li>
        </>
    );
};

export default ToDoItem;