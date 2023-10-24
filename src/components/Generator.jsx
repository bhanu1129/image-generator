import { useState } from "react";
import { API_TOKEN } from "../firebase-config";
import { CircularIndeterminate } from "../loadingAnimation";
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { useAuthState } from "react-firebase-hooks/auth";
import { Auth, db, storage } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const Generator = () => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [user] = useAuthState(Auth);
  const postRef = collection(db, "post");

  const uploadImage = async () => {
    if(imageFile !== null && prompt !== null){
      const imageRef = ref(storage, `images/${imageFile.name + v4()}`)
      uploadBytes(imageRef, imageFile)
      .then(() => {
        getDownloadURL(imageRef)
        .then(url=>{
          addDoc(postRef, {
            prompt: prompt,
            image: url,
            logo: user.photoURL,
            user: user.displayName,
          })
          alert("posted");
        })
      })
      .catch(err => {console.log(err)})
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/prompthero/openjourney",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const blob = await response.blob();
    setOutput(URL.createObjectURL(blob));
    setImageFile(new File([blob], "art.png", {type: "image/png"}));
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
            <p><CircularIndeterminate /></p>
          </div>
        )}
        {!loading && output && (
          <div className="result-image">
            <img src={output} alt="art" />
            <div className="action flex justify-center mt-1">
              <button onClick={downloadImage}><DownloadIcon /></button>
              {user && <button onClick={uploadImage}><ShareIcon /></button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
