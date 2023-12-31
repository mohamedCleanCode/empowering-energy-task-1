import { useState } from "react";
import "./App.css";
import FileHighlighter from "./components/test";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* <FileUploadButton setIsOpen={setIsOpen} />
      <FileUploadMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <ImageEditor /> */}
      <FileHighlighter />
    </>
  );
}

export default App;
