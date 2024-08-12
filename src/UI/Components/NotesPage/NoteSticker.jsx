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
  console.log(noteText);

  const downloadNote = () => {
    // Convert Markdown to HTML
    const htmlContent = (
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={docco}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({ node, ...props }) {
            return (
              <img
                style={{ maxWidth: "100%", maxHeight: "400px" }}
                {...props}
              />
            );
          },
        }}
      >
        {noteText}
      </ReactMarkdown>
    );

    // Convert the React element to a string of HTML
    const htmlString = htmlContent.props.children;
    const pdfContent = htmlToPdfmake(htmlString);

    const documentDefinition = {
      content: pdfContent,
    };

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
