import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import "./styles.css";

const timeout = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const FileUploadMenu = ({ isOpen, setIsOpen }) => {
  const maxFileSize = 20;
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [names, setNames] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

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
    const selectedFiles = e.target.files;
    const found = [...selectedFiles].find((file) => names.includes(file.name));
    if (found) {
      alert("This file is exist " + found.name);
      return;
    }
    setFiles((prev) => {
      [...selectedFiles].map((file) =>
        setNames((prev) => [...prev, file.name])
      );
      return [...prev, ...selectedFiles];
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
    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setFiles((prevFiles) => {
          // Use filter to only add files that meet the condition
          const filteredFiles = prevFiles.filter(
            (prevFile) => prevFile.name !== file.name
          );
          return [
            {
              name: file.name,
              success: false,
            },
            ...filteredFiles,
          ];
        });
        await console.log(response);
      } else {
        alert("Something went wrong!!!");
      }
    } catch (error) {
      alert(error.message);
    }
    await timeout(3000);
  };

  const handleFileUpload = async () => {
    setLoading(true);
    for (let i = currentFileIndex; i < files.length; i++) {
      await uploadFile(files[i]);
      setCurrentFileIndex(i + 1);
    }
  };

  useEffect(() => {
    if (files.length === 0) {
      setCurrentFileIndex(0);
      setNames([]);
    } else {
      files.forEach((file) => {
        let checkExt = fileExtensions.includes(file?.name?.split(".")[1]);
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
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              position: "relative",
                              transition: "all .5s",
                            }}
                          >
                            <p>{file?.name}</p>
                            <span
                              onClick={() => removeDocument(file?.name)}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              X
                            </span>
                            {file?.size > maxFileSize * 1024 * 1024 && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "0",
                                  fontSize: "10px",
                                  color: "red",
                                  fontWeight: " bold",
                                  padding: "0 10px",
                                }}
                              >
                                File size exceeds {maxFileSize} MB limit
                              </div>
                            )}
                            <div className="progress-bar">
                              <div
                                className={`progress-bar-inner ${
                                  file?.success === true
                                    ? "success"
                                    : file?.success === false
                                    ? "error"
                                    : ""
                                }`}
                                style={{
                                  width:
                                    file?.success === true
                                      ? "100%"
                                      : file?.success === false
                                      ? "100%"
                                      : "0%",
                                  backgroundColor:
                                    file?.success === true
                                      ? "green"
                                      : file?.success === false
                                      ? "red"
                                      : "#eee",
                                }}
                              ></div>
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
                    // disabled={loading}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    variant="outlined"
                    color="error"
                    // disabled={loading}
                  >
                    Upload
                  </Button>
                </div>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FileUploadMenu;
