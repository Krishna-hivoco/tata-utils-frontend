import axios from "axios";
import { useState } from "react";

export default function App() {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [base64, setBase64] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    const files = event.dataTransfer.files;

    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const file = files[0];

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setPreview(base64String);
        setBase64(base64String);
      };
      reader.readAsDataURL(file); // Read file as Base64
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const handleFileChange = (event) => {
    setError(null); // Clear previous errors
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }

      const blob = new Blob([file], { type: file.type });
      console.log("Blob object:", blob);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setPreview(base64String);
        setBase64(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file.");
    }
  };
  const triggerFileUpload = () => {
    document.getElementById("fileInput").click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = async () => {
    setLoading(true);
    setResponseMessage(null);

    try {
      const response = await axios.post(
        "https://sampann-open.thefirstimpression.ai/process/image",
        {
          image: base64,
        }
      );
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error("API Error:", error);
      setResponseMessage("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <header className="h-20 shadow-sm bg-white w-full flex justify-center items-center">
        <img src="/logo.png" alt="logo" srcSet="" />
      </header>
      <section
        style={{ minHeight: "calc(100vh - 90px)" }}
        className="mt-[10px] bg-white shadow-sm md:p-20 p-10"
      >
        <div className=" max-w-[400px] p-5 text-center mx-auto bg-[#F8F9FE] border-4 rounded-2xl  border-dotted w-full h-full flex flex-col justify-center items-center cursor-pointer">
          <div onDrop={handleDrop} onDragOver={handleDragOver}>
            <img src="/upload.png" alt="" srcSet="" />
            <strong className="font-bold text-lg uppercase mt-3">
              UPLOAD IMAGE HERE
            </strong>
            <br />
            {error && (
              <small className=" text-xs text-red-600 ">
                File size must be less than 5MB.
              </small>
            )}
          </div>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-5 h-52 object-contain  border rounded-lg shadow-md"
            />
          )}
          {preview ? (
            <button
              onClick={() => handleClick()}
              className={`${
                loading && "hidden"
              } font-semibold text-sm uppercase px-9 tracking-wider py-5 bg-black rounded-xl text-white mt-14`}
            >
              Send File
            </button>
          ) : (
            <button
              onClick={triggerFileUpload}
              className="font-semibold text-sm uppercase px-9 tracking-wider py-5 bg-black rounded-xl text-white mt-14"
            >
              BROWSE FILES
            </button>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </section>
      {responseMessage && (
        <section className="bg-white">
          <div className="w-[400px] md:w-[700px] p-10 m-auto bg-[#F8F9FE] rounded-xl tracking-widest">
            <p className="font-normal text-xl text-black">{responseMessage}</p>
          </div>
        </section>
      )}
    </div>
  );
}
