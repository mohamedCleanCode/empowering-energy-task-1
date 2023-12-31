import { useState } from "react";
import "./App.css";
import FileUploadButton from "./components/FileUploadButton/FileUploadButton";
import FileUploadMenu from "./components/FileUploadMenu/FileUploadMenu";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <FileUploadButton setIsOpen={setIsOpen} />
      <FileUploadMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default App;
