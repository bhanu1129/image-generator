import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [user] = useAuthState(Auth);
  const navigate = useNavigate();

  const logOut = async() => {
    await signOut(Auth);
    navigate("/");
  }
  
  return (
    <header>
      {/* <h1 className="font-black text-xl">Imaginate</h1> */}
      <img src={logo} alt="Imaginate" className="w-60"/>
      <div className="menu">
        <Link className="link" to="/">
          Home
        </Link>

        {user && <Link className="link" to="/generate">Generate</Link>}

        {user ? (
          <div className="link">
            <div className="d-flex">
              <img className="logo" src={user.photoURL} alt={user.displayName} />
              <button onClick={logOut}><LogoutIcon /></button>
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
