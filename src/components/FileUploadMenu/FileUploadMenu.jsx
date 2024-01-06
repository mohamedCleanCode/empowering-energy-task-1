import CloseIcon from "@mui/icons-material/Close";
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
  const [isValidSize, setIsValidSize] = useState(false);

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
    setIsValidSize(
      [...selectedFiles].some((file) => file.size > maxFileSize * 1024 * 1024)
    );
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
          return prevFiles.map((prevFile) =>
            prevFile.name === file.name
              ? {
                  name: file.name,
                  success: true,
                  ...file,
                }
              : prevFile
          );
        });
      } else {
        setFiles((prevFiles) => {
          return prevFiles.map((prevFile) =>
            prevFile.name === file.name
              ? {
                  name: file.name,
                  success: false,
                  ...file,
                }
              : prevFile
          );
        });
        alert("Something went wrong!!!");
      }
    } catch (error) {
      alert(error.message);
    }
    await timeout(1000);
  };

  const handleFileUpload = async () => {
    setLoading(true);
    for (let i = currentFileIndex; i < files.length; i++) {
      await uploadFile(files[i]);
      setCurrentFileIndex(i + 1);
    }
    setLoading(false);
    setFiles([]);
    setNames([]);
  };

  useEffect(() => {
    if (files.length === 0) {
      setCurrentFileIndex(0);
      setNames([]);
      setLoading(false);
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
                  className="dropdown-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  Or Drop files here.
                </div>
              </div>
              <div
                style={{
                  opacity: "0.9",
                }}
              >
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
                  <div className="files-container">
                    {files?.length >= 1 &&
                      files.map((file, i) => {
                        return (
                          <div className="file-container" key={i}>
                            <p>{file?.name}</p>
                            <span
                              onClick={() => removeDocument(file?.name)}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <CloseIcon />
                            </span>
                            {file?.size > maxFileSize * 1024 * 1024 && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "8px",
                                  fontSize: "10px",
                                  color: "red",
                                  fontWeight: " bold",
                                  padding: "0 15px",
                                }}
                              >
                                File size exceeds {maxFileSize} MB limit
                              </div>
                            )}
                            <div className={`progress-bar`}>
                              <div
                                className={`progress-bar-inner  ${
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
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: "0",
                                    fontSize: "12px",
                                    paddingTop: "6px",
                                  }}
                                >
                                  {file?.success === true && (
                                    <span style={{ color: "green" }}>
                                      File uploaded successfully
                                    </span>
                                  )}
                                  {file?.success === false && (
                                    <span style={{ color: "red" }}>
                                      File could not uploaded{" "}
                                    </span>
                                  )}
                                </div>
                              </div>
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
                    margin: "30px 0",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFiles([]);
                      setNames([]);
                    }}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    variant="outlined"
                    color="error"
                    disabled={loading || isValidSize ? true : false}
                  >
                    Upload
                  </Button>
                </div>
              )}
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outlined"
              color="error"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FileUploadMenu;
