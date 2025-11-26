import cloudinaryUpload from "./service/uploads";
import { useState } from "react";

const App = () => {
  const [imgData, setImg] = useState("");

  const handleFileUpload = async (e) => {
    const uploadData = new FormData();
    uploadData.append("testname", e.target.files[0], "test"); // trường "testname" lưu loại file là tham số 2 và orignalName là tham số 3

    uploadData.append("title", "Hello");

    console.log(e.target.files[0]);
    console.log(uploadData);

    const data = await cloudinaryUpload(uploadData);
    console.log(data);
    setImg(data.secure_url);
  }
  
  return (
    <div style={{textAlign: "center"}}>
      <div style={{ margin: 10 }}>
        <label style={{ margin: 10 }}>Cloudinary:</label>
        <input
          type="file"
          onChange={(e) => handleFileUpload(e)}
        />
      </div>
      <img alt="" src={imgData}/>
    </div>
  );
};

export default App;