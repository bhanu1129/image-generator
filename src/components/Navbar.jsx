import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [user] = useAuthState(Auth);
  const navigate = useNavigate();

  const logOut = async() => {
    await signOut(Auth);
    navigate("/");
  }
  return (
    <header>
      <h2 className="font-black text-2xl">ImageGen</h2>
      <div className="menu">
        <Link className="link" to="/">
          Home
        </Link>

        {user ? (
          <div className="link">
            <div className="d-flex">
              <img className="logo" src={user.photoURL} alt={user.displayName} />
              <button onClick={logOut}>Sign Out</button>
            </div>
          </div>
        ) : (
          <Link className="link" to="/login">
            Login
          </Link>
        )}
        
      </div>
    </header>
  );
};

export default Navbar;
