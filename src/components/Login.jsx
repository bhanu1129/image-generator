import { Auth, Provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const signIn = () => {
    signInWithPopup(Auth, Provider)
      .then((res) => navigate("/"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-page">
      <h1 className="text-4xl font-black mb-6">Login!</h1>
      <button onClick={signIn} className="button">
        Signin With Google
      </button>
    </div>
  );
};

export default Login;
