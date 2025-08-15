import { useNavigate } from 'react-router-dom';
import deskImage from '../../assets/workingdesk.png';
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm';
import NavBarLogin from '../../components/NavBarLogin/NavBarLogin';
import './ResetPassword.css'; 

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleResetSuccess = () => {
    navigate('/login', { replace: true });
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
            <ResetPasswordForm onResetSuccess={handleResetSuccess} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
