import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Document, Page, pdfjs } from "react-pdf";

import "./FileHighlighter.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const FileHighlighter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [highlights, setHighlights] = useState([]);

  const editorRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileType(file.type);
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditFinish = () => {
    // Implement logic to save the edited document (image or PDF)
    if (fileType && fileType.includes("image")) {
      const canvas = editorRef.current.getImage();
      console.log("Modified Image:", canvas.toDataURL());
    } else if (fileType && fileType.includes("pdf")) {
      // Implement logic to save the edited PDF
      console.log("Modified PDF - Save logic goes here");
    }

    // Reset state
    setSelectedFile(null);
    setFileType(null);
    setIsEditing(false);
    setHighlights([]);
  };

  const handleHighlight = (highlight) => {
    setHighlights([...highlights, highlight]);
  };

  return (
    <div>
      <h1>File Highlighter</h1>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && (
        <div>
          <button onClick={handleEditStart}>Edit Document</button>
          {isEditing && (
            <div className="overlay">
              {fileType && fileType.includes("image") ? (
                <AvatarEditor
                  ref={editorRef}
                  image={selectedFile}
                  width={500}
                  height={500}
                  border={50}
                  color={[255, 255, 255, 0.6]}
                  scale={1.2}
                />
              ) : fileType && fileType.includes("pdf") ? (
                <Document file={selectedFile} onLoadSuccess={() => {}}>
                  {[...Array(1).keys()].map((index) => (
                    <Page key={index + 1} pageNumber={index + 1}>
                      <div className="highlight-layer">
                        {highlights.map((highlight, highlightIndex) => {
                          if (highlight.page === index + 1) {
                            return (
                              <div
                                key={highlightIndex}
                                className="highlight"
                                style={{
                                  top: `${highlight.position.top * 100}%`,
                                  left: `${highlight.position.left * 100}%`,
                                  width: `${highlight.position.width * 100}%`,
                                  height: `${highlight.position.height * 100}%`,
                                }}
                              ></div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </Page>
                  ))}
                </Document>
              ) : (
                <p>Unsupported file type</p>
              )}
              <button onClick={handleEditFinish}>Finish Editing</button>
            </div>
          )}
        </div>
      )}
      <div>
        <h2>Highlights</h2>
        {highlights.map((highlight, index) => (
          <div key={index}>
            <p>
              Page {highlight.page}, Position:{" "}
              {JSON.stringify(highlight.position)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileHighlighter;
