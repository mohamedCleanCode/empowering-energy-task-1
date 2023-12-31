import { FaUpload } from "react-icons/fa";
import "./styles.css";

const FileUploadButton = ({ setIsOpen }) => {
  return (
    <button className="file-upload-button" onClick={() => setIsOpen(true)}>
      <FaUpload />
      Upload
    </button>
  );
};

export default FileUploadButton;
