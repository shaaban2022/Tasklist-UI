import googleIcon from "../../assets/googleicon.png";   // adjust path if necessary
import microsoftIcon from "../../assets/microsoftpng.png";


const SocialLoginButtons = () => {
  return (
    <div className="social-buttons-container">
      <button type="button" className="social-button">
        <img
          id="google"
          src={googleIcon}
          alt="Google"
          className="h-5 w-5"
        />
        <span className="text-sm text-gray-700">Login with Google</span>
      </button>

      <button type="button" className="social-button">
        <img
          id="ms"
          src={microsoftIcon}
          alt="Microsoft"
          className="h-5 w-5"
        />
        <span className="text-sm text-gray-700">Login with Microsoft</span>
      </button>
    </div>
  );
};

export default SocialLoginButtons;
