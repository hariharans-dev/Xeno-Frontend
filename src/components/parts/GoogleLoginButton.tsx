import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./GoogleLoginButton.css";

interface GoogleLoginButtonProps {
  className?: string;
  onGoogleAuthSuccess: (response: any) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  className,
  onGoogleAuthSuccess,
}) => {
  const handleLoginSuccess = async (response: any) => {
    const credential = response.credential;
    var api = "";
    if (className == "signin") {
      api = "http://xenobackend.hariharans.me/api/auth/googlelogin";
    } else {
      api = "http://xenobackend.hariharans.me/api/auth/googleregister";
    }
    try {
      const apiResponse = await axios.post(api, {
        token: credential,
      });
      apiResponse.data.status = 200;
      apiResponse.data.className = className;
      onGoogleAuthSuccess(apiResponse.data);
    } catch (error: any) {
      if (error.response.status == 400) {
        const data = {
          data: error.response.data,
          status: error.response.status,
          className: className,
        };
        onGoogleAuthSuccess(data);
      }
      console.log("internal server error");
    }
  };

  const handleLoginFailure = (error: any) => {
    console.error("Login Failed:", error);
  };

  return (
    <div className={`google-login-container ${className || ""}`}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => handleLoginFailure}
        useOneTap
      />
    </div>
  );
};

export default GoogleLoginButton;
