import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import FileUploadButton from "./components/FileUploadButton/FileUploadButton";
import FileUploadMenu from "./components/FileUploadMenu/FileUploadMenu";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [res, setRes] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch("http://localhost:3000/files", {
        method: "GET",
      });
      let result = await res.json();
      setRes(result);
    };
    fetchData();
  }, []);
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          left
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <FileUploadButton setIsOpen={setIsOpen} />
          <FileUploadMenu isOpen={isOpen} setIsOpen={setIsOpen} />
          {res?.data?.length >= 1 && (
            <div>
              <h2>{res.data.length}</h2>
              {res.data.map((item, i) => {
                return <p key={i}>{item}</p>;
              })}
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default App;
