import * as React from 'react';
import { useState, useEffect } from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from '@react-spring/web';
import { Grid } from "@mui/material";

const settings = {
  width: 150,
  height: 150,
  value: 60, 
};

// const AnimatedGauge = animated(Gauge);

const ArcDesign = ({totalTasks, tasksCompleted, colorValue}) => {
  // const props = useSpring({ 
  //   value: tasksCompleted, 
  //   from: { value: 1 },
  //   config: { duration: 3000 } // Adjust duration here for slower animation
  // });

  const lightenColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
  
    R = Math.round(R + (255 - R) * percent);
    G = Math.round(G + (255 - G) * percent);
    B = Math.round(B + (255 - B) * percent);
  
    return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  };

  const lightColor = lightenColor(colorValue, 0.8); // Lighten the color by 50%
  return (
    <Gauge
      valueMin={0}
      valueMax= {totalTasks}
      width={150}
      height={150}
      // value={props.value.to(val => Math.round(val))}
      value={tasksCompleted}
      // value={props.value.to(val => Math.round(val))}
      cornerRadius="50%"
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 30,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: colorValue,
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: lightColor,
        },
      })}
    />
  );
}

export default function ChartContainer({tasks, dayOfCompletion}) {
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [color, setColor] = useState('');

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(Number);
    if (!day || !month || !year) {
      console.error(`Invalid date string: ${dateStr}`);
      return null;
    }
    return new Date(year, month - 1, day);
  };

  const getMidnightDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const today = getMidnightDate(new Date());
  const tomorrow = getMidnightDate(new Date(today.getTime() + 24 * 60 * 60 * 1000));
  tomorrow.setDate(today.getDate() + 1); 

  const todayString = today.toISOString().split('T')[0];
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  const getCompletedCountByDay = () =>{
    switch (dayOfCompletion)
    {
      case 'Today\'s Tasks':
        return tasks.filter(task => {
          const dueDate = parseDate(task.dueDate).toISOString().split('T')[0];
          return dueDate <= todayString && task.isCompleted;
        }).length;
      case 'Tomorrow\'s Tasks':
        return tasks.filter(task => {
          const dueDate = parseDate(task.dueDate).toISOString().split('T')[0];
          return dueDate === tomorrowString && task.isCompleted;
        }).length;
      case 'Future Tasks':
        return tasks.filter(task => {
          const dueDate = parseDate(task.dueDate).toISOString().split('T')[0];
          return dueDate > tomorrowString && task.isCompleted;
        }).length;
    }
  };

  const getTotalCountByDay = () =>{
    switch (dayOfCompletion)
    {
      case 'Today\'s Tasks':
        return tasks.filter(task => {
          const dueDate = parseDate(task.dueDate).toISOString().split('T')[0];
          return dueDate <= todayString;
        }).length;
      case 'Tomorrow\'s Tasks':
        return tasks.filter(task => {
          const dueDate = parseDate(task.dueDate).toISOString().split('T')[0];
          return dueDate === tomorrowString;
        }).length;
      case 'Future Tasks':
        return tasks.filter(task => {
          const dueDate = parseDate(task.dueDate).toISOString().split('T')[0];
          return dueDate > tomorrowString;
        }).length;
    }
  };

  const getColorByDay = () => {
    switch (dayOfCompletion) {
      case 'Today\'s Tasks':
        return "#D54C79";
      case 'Tomorrow\'s Tasks':
        return "#FB6D49";
      case 'Future Tasks':
        return "#FFAE47";

    }
  }

  useEffect(()=>{
    setCompleted(getCompletedCountByDay());
    setColor(getColorByDay());
    setTotal(getTotalCountByDay());
  },[tasks, dayOfCompletion]);

  return (
    <Paper
    elevation={3}
      sx={{ 
        p: 2,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "28vh",
        width: "45vh",
        marginRight:"20px",
        borderRadius: "20px",
        border: "none"
      }}
    >
      <Grid container direction={"column"}>
        <Grid item xs={6} >
          <Typography
            variant="h6"
            sx={{
              p: 1,
              fontSize:'0.99rem',
              display:'flex',
              justifyContent:'center'
            }}
          >
            {dayOfCompletion}
          </Typography>
        </Grid>
        <Grid item xl={12} sx={{display: 'flex', justifyContent: 'center' }}>
          <ArcDesign totalTasks={total} tasksCompleted={completed} colorValue={color} />
        </Grid>
      </Grid>
    </Paper>
  );
}

