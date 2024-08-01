import React from 'react';
import { useState, useEffect } from 'react';
import "boxicons";

const SideNavTaskTypeList = ({taskType, tasks, deleteTaskType }) => {
    const [taskTypeCount, setTaskTypeCount] = useState(0);

    const getTaskCountByType = () => {
        return tasks.filter(task => task.taskType === taskType.taskTypeName && task.isCompleted===false).length
    };

    useEffect(()=>{
        setTaskTypeCount(getTaskCountByType());
    },[tasks, taskType])

    return (
        <div className="lists" >
            <div className="color" style={{ background: taskType.taskColor }}></div>
            <li key = {taskType.taskTypeKey}>{taskType.taskTypeName}</li>
            <div className="number">{taskTypeCount}</div>
            <box-icon class="taskTypeDelete" name='trash' size="20px" onClick={()=>deleteTaskType(taskType.taskTypeKey, taskType.taskTypeName)}></box-icon>
        </div>
    );
};

export default SideNavTaskTypeList;