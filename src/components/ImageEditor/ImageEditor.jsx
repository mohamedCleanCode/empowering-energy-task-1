import { useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import image from "../../../src/image.jpeg";

const ImageEditor = () => {
  const editorRef = useRef(null);

  const handleSave = () => {
    const canvas = editorRef.current.getImage();
    // Implement logic to save the modified image (e.g., send it to the backend)
    console.log("Modified Image:", canvas.toDataURL());
  };

  return (
    <div>
      <h1>Image Editor</h1>
      <AvatarEditor
        ref={editorRef}
        image={image}
        width={250}
        height={250}
        border={50}
        color={[255, 255, 255, 0.6]}
        scale={1.2}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ImageEditor;
