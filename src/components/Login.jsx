import { Auth, Provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const signIn = () => {
    signInWithPopup(Auth, Provider)
      .then((res) => console.log("Signed In!"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-page">
      <h1 className="text-4xl font-black mb-6">Login!</h1>
      <button onClick={signIn} className="button">Signin With Google</button>
    </div>
  );
};

export default Login;
