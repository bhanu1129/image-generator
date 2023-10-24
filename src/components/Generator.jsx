import { useState } from "react";
import { API_TOKEN } from "../firebase-config";
import { CircularIndeterminate } from "../loadingAnimation";
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { useAuthState } from "react-firebase-hooks/auth";
import { Auth, db } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";

const Generator = () => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [user] = useAuthState(Auth);
  const postRef = collection(db, "post");

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const input = event.target.elements.input.value;
    const response = await fetch(
      "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ inputs: input }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const blob = await response.blob();
    setOutput(URL.createObjectURL(blob));
    setImageFile(new File(blob), "art.png", {type: "image/png"});
    setLoading(false);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = output;
    link.download = "art.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <div className="container imageGen al-c mt-3">
      <h1 className="font-black text-4xl text-center mb-3">
        Image <span>Generator</span>
      </h1>
      <p className="text-lg text-center mb-3">
        Generate beautiful images by describing a prompt below!
      </p>
      <form className="generate-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="input"
          placeholder="Type your prompt here..."
          onChange={(e)=>setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="button hover:opacity-80 transition-all"
        >
          Generate
        </button>
      </form>
      <div>
        {loading && (
          <div className="loading">
            <CircularIndeterminate />
          </div>
        )}
        {!loading && output && (
          <div className="result-image">
            <img src={output} alt="art" />
            <div className="action">
              <button onClick={downloadImage}><DownloadIcon /></button>
              <button><ShareIcon /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
