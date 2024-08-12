import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TaskCard from './TaskCard';

export default function TaskCardContainer({tasks, toggleComplete}){
    return ( 
        <Paper 
        sx = {{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '10px',
            right: '0',
            height: '90%',
            width: '35%',
            borderRadius: '20px',
            background:'#5680e9',
            color:'white'
        }}
        >
        <Typography variant='h6'
            sx = {{
                p: 1
            }}
        >
        <span id="UpcomingTasks">Upcoming Tasks</span>
        </Typography>
        {tasks.length === 0 ? (
                <Typography variant='body1' sx={{ p: 2, color:'#ffffff' }}>
                    Hooray! No tasks to tackle right now. Enjoy the break!
                </Typography>
            ) : (
                tasks.map((task) => (
                    <TaskCard 
                        taskKey={task.taskKey} // Add a unique key for each task
                        taskName={task.taskName} 
                        taskDescription={task.taskDescription} 
                        dueDate={task.dueDate}
                        toggleComplete={toggleComplete} 
                    />
                ))
            )}
        </Paper>
    );
};