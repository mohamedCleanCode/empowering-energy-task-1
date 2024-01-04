import { Button, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import "./styles.css";

const timeout = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const FileUploadMenu = ({ isOpen, setIsOpen }) => {
  const [files, setFiles] = useState([]);
  const [names, setNames] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [progress, setProgress] = useState(80);
  const [progressColor, setProgressColor] = useState("");
  const [openProgress, setOpenProgress] = useState(false);
  const [processingFile, setProcessingFile] = useState(null);

  const fileExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
  ];

  const handleFileChange = (e) => {
    const selectedfiles = e.target.files;
    const found = [...selectedfiles].find((file) => names.includes(file.name));
    // console.log(names?.split(".")[1]);
    if (found) {
      alert("This file is exist " + found.name);
      return;
    }
    setFiles((prev) => {
      [...selectedfiles].map((file) =>
        setNames((prev) => [...prev, file.name])
      );
      return [...prev, ...selectedfiles];
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedfiles = e.dataTransfer.files;
    const found = [...droppedfiles].find((file) => names.includes(file.name));
    if (found) {
      alert("This " + found.name + "is exist ");
      return;
    }
    setFiles((prev) => {
      [...droppedfiles].map((file) => setNames((prev) => [...prev, file.name]));
      return [...prev, ...droppedfiles];
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeDocument = (documentName) => {
    setFiles((prevfiles) =>
      prevfiles.filter((uploadedFile) => uploadedFile.name !== documentName)
    );
    setNames((prevNames) => prevNames.filter((name) => name !== documentName));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setProcessingFile(file.name);
    setOpenProgress(true);
    setProgressColor("blue");
    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        await setOpenProgress(false);
        await setAnimate(true);
        await timeout(1000);
        await setProcessingFile(null);
        await setFiles((prevFiles) =>
          prevFiles.filter((f) => f.name !== file.name)
        );
        await setNames((prevNames) =>
          prevNames.filter((name) => name !== file.name)
        );
        await setAnimate(false);
        await console.log(response);
      } else {
        alert("Something went wrong!!!");
        setProgressColor("red");
      }
    } catch (error) {
      alert(error.message);
      setProgressColor("red");
    }
  };

  const handleFileUpload = async () => {
    for (let i = currentFileIndex; i < files.length; i++) {
      await uploadFile(files[i]);
      setCurrentFileIndex(i + 1);
    }
  };

  useEffect(() => {
    let timer;
    if (openProgress) {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 0;
          }
          const diff = Math.random() * 70;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);
    }

    return () => {
      clearInterval(timer);
      setProgress;
    };
  }, [openProgress]);

  useEffect(() => {
    if (files.length === 0) {
      setCurrentFileIndex(0);
      setNames([]);
    } else {
      files.forEach((file) => {
        let checkExt = fileExtensions.includes(file.name.split(".")[1]);
        if (!checkExt) {
          alert("Invalid File Format! Please select a valid file format.");
        }
      });
    }
  }, [files]);

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="file-upload-menu">
            <p>
              <span>Upload Request Mony files</span>
              <span onClick={() => setIsOpen(false)}>
                <IoMdClose />
              </span>
            </p>
            <div className="manage-actions">
              <div>
                <input
                  type="file"
                  id="fileInput"
                  multiple={true}
                  accept="*/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="fileInput">Browse...</label>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  Or Drop files here.
                </div>
              </div>
              <div>
                <>
                  {files?.length >= 1 && (
                    <h2
                      style={{
                        margin: "10px 0",
                      }}
                    >
                      Selected File:
                    </h2>
                  )}
                  <div>
                    {files?.length >= 1 &&
                      files.map((file, i) => {
                        return (
                          <div
                            className={`${
                              animate &&
                              names.indexOf(file.name) === currentFileIndex
                                ? "animate"
                                : ""
                            }`}
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              position: "relative",
                              transition: "all .5s",
                            }}
                          >
                            <p>{file.name}</p>
                            <span
                              onClick={() => removeDocument(file?.name)}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              X
                            </span>
                            <div
                              style={{
                                position: "absolute",
                                width: " 100%",
                                bottom: " 0",
                              }}
                            >
                              {openProgress && processingFile === file.name ? (
                                <LinearProgress
                                  variant="determinate"
                                  value={progress}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              </div>
              {files?.length >= 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "15px",
                    margin: "10px 0",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFiles([]);
                      setNames([]);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    variant="outlined"
                    color="error"
                  >
                    Upload
                  </Button>
                </div>
              )}
            </div>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default FileUploadMenu;
