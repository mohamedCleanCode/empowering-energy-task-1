import { useState } from "react";
import Camera from "react-html5-camera-photo";
import "./styles.css";

const TakePhoto = ({ isOpenCam, setIsOpenCam }) => {
  const [dataUri, setDataUri] = useState(null);
  const handleTakePhoto = (dataUri) => {
    setDataUri(dataUri);
    setIsOpenCam(false);
  };
  return (
    <>
      {isOpenCam && (
        <div className="take-photo">
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
          />
        </div>
      )}
    </>
  );
};

export default TakePhoto;
