// import React, { forwardRef } from "react";
// import ReactMarkdown from "react-markdown";
// import rehypeRaw from "rehype-raw";
// import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
// import "boxicons";
// import "./NotesPage.css";

// const NoteViewer = forwardRef(
//   ({ notes, ViewingNoteKey, closeNoteViewer, editNote }) => { 
//     if (!ViewingNoteKey) return null;

//     const filterViewingNote = () => {
//       return notes.find((note) => note.noteKey === ViewingNoteKey);
//     };

//     const filteredNotes = filterViewingNote();

//     const daySuffix = (day) => {
//       if (day >= 11 && day <= 13) {
//         return `${day}th`;
//       } else {
//         const suffixes = { 1: "st", 2: "nd", 3: "rd" };
//         return `${day}${suffixes[day % 10] || "th"}`;
//       }
//     };
//     const formatDateString = (dateStr) => {
//       const [day, month, year] = dateStr.split("-");
//       const date = new Date(`${year}-${month}-${day}`);
//       const dayWithSuffix = daySuffix(date.getDate());
//       const monthName = date.toLocaleString("default", { month: "long" });
//       return `${dayWithSuffix} ${monthName} ${year}`;
//     };

//     return (
//       <div id="note-viewer">
//         <button id="close-button" onClick={closeNoteViewer}>
//           <box-icon name="x" color="white" size="30px"></box-icon>
//         </button>
//         <div id="viewer-heading">
//           <h1>{filteredNotes.noteTitle}</h1>
//         </div>
//         <div id="viewer-text">
//           <ReactMarkdown
//             children={filteredNotes.noteText}
//             rehypePlugins={[rehypeRaw]}
//             components={{
//               code({ node, inline, className, children, ...props }) {
//                 const match = /language-(\w+)/.exec(className || "");
//                 return !inline && match ? (
//                   <SyntaxHighlighter
//                     style={docco}
//                     language={match[1]}
//                     PreTag="div"
//                     {...props}
//                   >
//                     {String(children).replace(/\n$/, "")}
//                   </SyntaxHighlighter>
//                 ) : (
//                   <code className={className} {...props}>
//                     {children}
//                   </code>
//                 );
//               },
//               img({ node, ...props }) {
//                 return (
//                   <img
//                     style={{ maxWidth: "100%", maxHeight: "400px" }}
//                     {...props}
//                   />
//                 );
//               },
//             }}
//           />
//         </div>
//         <div id="viewer-date">
//           <p>Created On: {formatDateString(filteredNotes.creationDate)}</p>
//         </div>
//         <button id="edit-in-viewer" onClick={(e)=>editNote(filteredNotes.noteKey)}>
//         <box-icon type='solid' name='pencil'></box-icon>
//         </button>
        
//       </div> 
//     );
//   }
// );

// export default NoteViewer;

// <box-icon name="save" color="#999"></box-icon>

import React, { forwardRef } from "react";
import "boxicons";
import "./NotesPage.css";

const NoteViewer = forwardRef(
  ({ notes, ViewingNoteKey, closeNoteViewer, editNote }, ref) => {
    if (!ViewingNoteKey) return null;

    const filterViewingNote = () => {
      return notes.find((note) => note.noteKey === ViewingNoteKey);
    };

    const filteredNotes = filterViewingNote();

    // Handle case where no matching note is found
    if (!filteredNotes) {
      return (
        <div id="note-viewer">
          <button id="close-button" onClick={closeNoteViewer}>
            <box-icon name="x" color="white" size="30px"></box-icon>
          </button>
          <p>Note not found.</p>
        </div>
      );
    }

    const formatDateString = (isoDateStr) => {
      try {
        // convert date string to format "YYYY-MM-DD" from format "DD-MM-YYYY"
        const [day, month, year] = isoDateStr.split("-");
        const formattedDateStr = `${year}-${month}-${day}`;

        // Parse the ISO date string into a JavaScript Date object
        const date = new Date(formattedDateStr);
    
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return "Invalid Date"; // Return a fallback if parsing fails
        }
    
        const dayWithSuffix = daySuffix(date.getDate());
        const monthName = date.toLocaleString("default", { month: "long" });
        return `${dayWithSuffix} ${monthName} ${year}`;
      } catch (error) {
        console.error("Error parsing date:", error);
        return "Invalid Date";
      }
    };
    
    const daySuffix = (day) => {
      if (day >= 11 && day <= 13) {
        return `${day}th`;
      } else {
        const suffixes = { 1: "st", 2: "nd", 3: "rd" };
        return `${day}${suffixes[day % 10] || "th"}`;
      }
    };
    
    

    return (
      <div id="note-viewer" ref={ref}>
        <button id="close-button" onClick={closeNoteViewer}>
          <box-icon name="x" color="white" size="30px"></box-icon>
        </button>
        <div id="viewer-heading">
          <h1>{filteredNotes.noteTitle}</h1>
        </div>
        <div id="viewer-text">
          {/* Render Quill HTML content */}
          <div
            dangerouslySetInnerHTML={{ __html: filteredNotes.noteText }}
            style={{
              wordWrap: "break-word",
              maxWidth: "100%",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          ></div>
        </div>
        <div id="viewer-date">
          <p>Created On: {formatDateString(filteredNotes.creationDate)}</p>
        </div>
        <button id="edit-in-viewer" onClick={() => editNote(filteredNotes.noteKey)}>
          <box-icon type="solid" name="pencil"></box-icon>
        </button>
      </div>
    );
  }
);

export default NoteViewer;