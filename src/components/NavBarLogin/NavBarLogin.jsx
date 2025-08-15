import { Link } from 'react-router-dom';
import logo from '../../assets/tasklistlogo.svg'; 
import './NavBarLogin.css';

const NavBarLogin = () => {
  return (
    <nav className="navbar-login">
      <div className="navbar-login-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <span className="brand-text">Tasklist UI</span>
      </div>
      <div className="navbar-login-right">
        <Link to="/features" className="nav-link">Features</Link>
        <Link to="/support" className="nav-link">Support</Link>
        <Link to="/signup" className="nav-link">Signup</Link>
        <Link to="/login" className="nav-button">Login</Link>
      </div>
    </nav>
  );
};

export default NavBarLogin;
