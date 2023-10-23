import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header>
      <h3>ImageGen</h3>
      <div className="menu">
        <Link className="link" to='/'>Home</Link>
        <Link className="link" to='/login'>Login</Link>
      </div>
    </header>
  )
}

export default Navbar