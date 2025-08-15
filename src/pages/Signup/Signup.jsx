import deskImage from '../../assets/workingdesk.png';
import SignupForm from '../../components/SignupForm/SignupForm';
import NavBarLogin from '../../components/NavBarLogin/NavBarLogin'; 
import './Signup.css';

const Signup = () => {
  return (
    <>
      <NavBarLogin /> 
      <div
        className="login-container"
      >
        <div
          className="login-page"
          style={{
            backgroundImage: `url(${deskImage})`,
          }}
        ></div>
        <div className="login-form-container">
          <div className="login-card-wrapper">
            <h1 className="animated-heading">Create your account</h1>
            <SignupForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
