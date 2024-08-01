import React, { useState, useEffect } from 'react';
import ConcentricCircularProgressBars from './ScoreMeter';

const ScoreMeter = ({ tasks }) => {
    const [percentages, setPercentages] = useState([0, 0, 0]);

    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('-').map(Number);
        const ParsedDate = new Date(year, month - 1, day); 
        ParsedDate.setHours(0, 0, 0, 0);
        return ParsedDate
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // const todayString = today.toISOString().split('T')[0];
    // const tomorrowString = tomorrow.toISOString().split('T')[0];

    const getCompletedCountByDay = (dayOfCompletion) => {
        switch (dayOfCompletion) {
            case 1:
                return tasks.filter(task => parseDate(task.dueDate) <= today && task.isCompleted===true).length;
            case 2:
                return tasks.filter(task => parseDate(task.dueDate).toDateString() == tomorrow.toDateString() && task.isCompleted===true).length;
            case 3:
                return tasks.filter(task => parseDate(task.dueDate) > tomorrow && task.isCompleted===true).length;
            default:
                return 0;
        }
    };

    const getTotalCountByDay = (dayOfCompletion) => {
        switch (dayOfCompletion) {
            case 1:
                return tasks.filter(task => parseDate(task.dueDate) <= today).length;
            case 2:
                return tasks.filter(task => parseDate(task.dueDate).toDateString() == tomorrow.toDateString()).length;
            case 3:
                return tasks.filter(task => parseDate(task.dueDate) > tomorrow).length;
            default:
                return 0;
        }
    };

    const updatePercentages = () => {
        const day1completed = getCompletedCountByDay(1);
        const day1total = getTotalCountByDay(1);
        const day2completed = getCompletedCountByDay(2);
        const day2total = getTotalCountByDay(2);
        const day3completed = getCompletedCountByDay(3);
        const day3total = getTotalCountByDay(3);

        console.log("Today completed:", day1completed, "Total:", day1total);
        console.log("Tomorrow completed:", day2completed, "Total:", day2total);
        console.log("Later completed:", day3completed, "Total:", day3total);

        setPercentages([
            day1total ? (day1completed / day1total) * 100 : 0,
            day2total ? (day2completed / day2total) * 100 : 0,
            day3total ? (day3completed / day3total) * 100 : 0
        ]);
    };

    useEffect(() => {
        updatePercentages();
        console.log(percentages);
    }, [tasks]);

    return (
        <div id="scoreMeterHolder">
            <ConcentricCircularProgressBars percentages={percentages} />
            <div id="legends">
                <ul>
                    <li>Today</li>
                    <li>Tomorrow</li>
                    <li>Later</li> 
                </ul>
            </div>
        </div>
    );
};

export default ScoreMeter;