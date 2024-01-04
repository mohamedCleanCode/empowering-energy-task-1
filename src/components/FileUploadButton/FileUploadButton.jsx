import Button from "@mui/material/Button";
import "./styles.css";

const FileUploadButton = ({ setIsOpen }) => {
  return (
    <Button
      className="file-upload-button"
      onClick={() => setIsOpen(true)}
      component="label"
      variant="contained"
    >
      Upload File
    </Button>
  );
};

export default FileUploadButton;
