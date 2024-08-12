import React, { useState, useEffect, useCallback } from "react";
import "./NoteSummarizer.css";
import "boxicons";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SummerizedNote = ({content}) => {
    return (
        <div id="SummarizedNote">
           <div id="SummarizedNoteContent">
           <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
           </div>
        </div>
    );
};

export default SummerizedNote;