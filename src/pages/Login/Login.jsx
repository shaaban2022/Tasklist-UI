import { useNavigate } from 'react-router-dom';
import deskImage from '../../assets/workingdesk.png';
import LoginForm from '../../components/LoginForm/LoginForm';
import NavBarLogin from '../../components/NavBarLogin/NavBarLogin'; 
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    localStorage.setItem('authToken', 'sample-auth-token');
    navigate('/dashboard', { replace: true });
  };

  return (
    <>
      <NavBarLogin />
      <div className="login-container">
        <div className="login-page">
          <img src={deskImage} alt="Working Desk" />
        </div>
        <div className="login-form-container">
          <div className="login-card-wrapper">
            <h1 className="animated-heading">Tasklist UI</h1>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
