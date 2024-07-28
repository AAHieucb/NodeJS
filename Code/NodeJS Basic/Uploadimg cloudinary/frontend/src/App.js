import cloudinaryUpload from "./service/uploads";
import { useState } from "react";

const App = () => {
  const [imgData, setImg] = useState("");

  // # Dùng multer cloudinary multer-storage-cloudinary
  const handleFileUpload = async (e) => {
    // Phải upload thông qua 1 form data. Nch là cứ nhét formdata + multer cloudinary là ok
    const uploadData = new FormData();
    uploadData.append("testname", e.target.files[0], "test"); 
    // Loại file có giá trị là e.target.files[0] và lưu dạng filename => trường thứ 3 là file.originalname 
    // Ở backend, trường số 1 là fieldname ở backend. Trường thứ 2 có thể là kiểu blob cũng được

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