import { useState } from "react";
import "./App.css";

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
