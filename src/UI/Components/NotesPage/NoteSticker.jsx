import React from "react";
import "boxicons";
import "./NotesPage.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactDOMServer from "react-dom/server";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const NoteSticker = ({
  noteKey,
  heading,
  noteText,
  creationDate,
  color,
  deleteNote,
  editNote,
  viewnote,
  editingNoteKey,
  setEditingNoteKey,
}) => {
  const parseMarkdownToPlainText = (markdownText) => {
    if (!markdownText) {
      return "";
    }

    // Step 2: Remove '!' before images and replace image markdown with the alt text
    const textWithoutImages = markdownText.replace(
      /!\[([^\]]*)\]\([^\)]+\)/g,
      "$1"
    );

    // Step 1: Replace markdown links with alt text (e.g., [alt text](link))
    const textWithoutLinks = textWithoutImages.replace(
      /\[([^\]]+)\]\([^\)]+\)/g,
      "$1"
    );

    // Step 3: Remove all remaining markdown syntax like *, _, #, etc.
    const textWithoutMarkdownSymbols = textWithoutLinks.replace(
      /[*_#~`-]/g,
      ""
    );

    // Step 4: Remove all HTML tags
    const textWithoutHtmlTags = textWithoutMarkdownSymbols.replace(
      /<\/?[^>]+(>|$)/g,
      ""
    );

    // Step 5: Replace multiple line breaks with a single space
    const plainText = textWithoutHtmlTags.replace(/\n+/g, " ").trim();

    return plainText;
  };

  const plainText = parseMarkdownToPlainText(noteText);

  const downloadNote = async () => {
    // Function to convert image URLs to base64
    const convertImagesToBase64 = async (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const images = doc.querySelectorAll("img");
  
      for (const img of images) {
        const url = img.src;
        try {
          if (url && !url.startsWith("data:image/")) {
            const response = await fetch(url);
  
            if (!response.ok) {
              console.warn(`Failed to load image: ${url}`);
              continue;
            }
  
            const blob = await response.blob();
            const reader = new FileReader();
  
            const base64 = await new Promise((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = () => reject(new Error("Failed to convert image to base64"));
              reader.readAsDataURL(blob);
            });
  
            img.src = base64; // Replace the image's `src` with the base64 string
          }
        } catch (error) {
          console.error(`Error processing image: ${error.message}`);
          img.remove(); // If an image cannot be processed, remove it
        }
      }
  
      return doc.body.innerHTML;
    };
  
    // Ensure all images in Quill content are converted to base64
    const htmlWithBase64Images = await convertImagesToBase64(noteText);
  
    // Convert HTML to pdfMake content
    const pdfContent = htmlToPdfmake(htmlWithBase64Images, {
      defaultStyles: {
        fontSize: 12,
      },
    });
  
    const documentDefinition = {
      content: pdfContent,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        paragraph: {
          margin: [0, 5, 0, 5],
        },
      },
      defaultStyle: {
        font: "Roboto", // Use Roboto font, supported by default
      },
    };
  
    // Generate and download the PDF
    pdfMake.createPdf(documentDefinition).download(`${heading}.pdf`);
  };

  return (
    <div id="notesticker" style={{ backgroundColor: color }}>
      <div id="noteheader">
        <h3>{heading}</h3>
      </div>
      <div id="noteinnertext">
        {plainText.length > 180 ? plainText.slice(0, 177) + "..." : plainText}
      </div>

      <div id="notefooter">
        <div id="notedate">{creationDate}</div>
        <div>
          <button onClick={() => downloadNote(noteKey)}>
            <box-icon name="download"></box-icon>
          </button>
          <button onClick={() => viewnote(noteKey)}>
            <box-icon name="notepad"></box-icon>
          </button>
          <button onClick={() => deleteNote(noteKey)}>
            <box-icon name="trash-alt"></box-icon>
          </button>
          <button onClick={() => editNote(noteKey)}>
            <box-icon name="pencil"></box-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteSticker;
