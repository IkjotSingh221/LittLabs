import React,{useState} from "react";
import "./PerfCard.css";
import { pink } from "@mui/material/colors";


const PerfCard=({name,score})=>{
    const renderParagraph = (score) => {
        if (score >= 90) {
            return <p className="score-label excellent">Excellent</p>;
        } else if (score >= 80) {
            return <p className="score-label great">Great</p>;
        } else if (score >= 70) {
            return <p className="score-label good-start">Good Start</p>;
        } else if (score >= 40) {
            return <p className="score-label needs-improvement">Improve</p>;
        } else {
            return <p className="score-label changes-required">Modify</p>;
        }
    };
    return(
        <div className="myCard">
           <h4>{name}</h4> 
           <div id="score_id">
           <h3>{score}</h3><h5>/100</h5>
           </div>
           {renderParagraph(score)}

        </div>
    )
    



}
export default PerfCard;