import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import TakePhoto from "../TakePhoto/TakePhoto";
import "./styles.css";

const FileUploadMenu = ({ isOpen, setIsOpen }) => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isOpenCam, setIsOpenCam] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFiles((prev) => [...prev, selectedFile]);
    console.log(files);
  };

  const handleDrop = (e) => {
    e.preDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preDefault();
  };

  const handleCameraClick = async () => {
    setIsOpenCam(true);
  };

  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="file-upload-menu">
            <p>
              <span>Upload Request Mony Files</span>
              <span onClick={() => setIsOpen(false)}>
                <IoMdClose />
              </span>
            </p>
            <div className="manage-actions">
              <div>
                <input
                  type="file"
                  id="fileInput"
                  accept="*/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="fileInput">Browse...</label>
                <div onDrop={handleDrop} onDragOver={handleDragOver}>
                  Or Drop files here.
                </div>
                <button onClick={handleCameraClick}>
                  <span
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    📷
                  </span>
                </button>
              </div>
              <div>
                {files.length >= 1 && <h2>Selected File:</h2>}
                <div>
                  {files.length >= 1 &&
                    files.map((file, i) => {
                      return (
                        <div key={i}>
                          <p>{file?.name}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      <TakePhoto isOpenCam={isOpenCam} setIsOpenCam={setIsOpenCam} />
    </>
  );
};

export default FileUploadMenu;
