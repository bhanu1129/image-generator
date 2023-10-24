import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { CircularIndeterminate } from "../loadingAnimation";
import DisplayPost from "./DisplayPost";

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const postRef = collection(db, "post");

  useEffect(() => {
    setLoading(true);
    const getPosts = async () => {
      await getDocs(postRef).then((data) => {
        setAllPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      });
    };
    getPosts();
  }, []);

  return (
    <div className="container">
      <h1 className="font-black text-3xl text-center mt-6 mb-3">
        The Community <span>Showcase</span>
      </h1>
      <div className="m-10">
        {loading ? (
          <div className="flex justify-center item-center">
            <CircularIndeterminate />
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
          {allPosts && allPosts.map((post) => <DisplayPost post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;