import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./style/SignupSignin.css";
import { SendRequest } from "./functions/SendRequest";
import GoogleLoginButton from "./parts/GoogleLoginButton";

const apiurllogin = "http://xenobackend.hariharans.me/api/auth/login";
const apiurlregister = "http://xenobackend.hariharans.me/api/auth/register";
const apiurlsession = "http://xenobackend.hariharans.me/api/auth/session";

const SignupSignin: React.FC = () => {
  const navigate = useNavigate();

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpResponse, setsignUpResponse] = useState<string>("");
  const [signInResponse, setsignInResponse] = useState<string>("");

  const [signUpStatusCode, setsignUpStatusCode] = useState<number>(0);
  const [signInStatusCode, setsignInStatusCode] = useState<number>(0);

  const onlogin = () => {
    navigate("/home");
  };

  const handleGoogleAuthSuccess = (data: any) => {
    if (data.className == "signin") {
      if (data.status == 200) {
        sessionStorage.setItem("session", data.token);
        onlogin();
      } else {
        setsignInResponse(data.data);
      }
    } else {
      if (data.status == 200) {
        setsignUpStatusCode(200);
        setsignUpResponse(data.body);
      } else {
        setsignUpResponse(data.data);
      }
    }
  };

  const handleSignUp = () => {
    const container = document.querySelector(".container");
    if (container) {
      container.classList.add("sign-up-mode");
    }
  };
  const handleSignIn = () => {
    const container = document.querySelector(".container");
    if (container) {
      container.classList.remove("sign-up-mode");
    }
  };

  const handleSignUpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };
  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData({ ...signInData, [name]: value });
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(signUpData);
      const response = await SendRequest(apiurlregister, "POST", signUpData);
      console.log(response);
      setsignUpResponse(response.body);
    } catch (error) {
      setsignUpResponse("Unexpected error occurred.");
      setsignUpStatusCode(500); // Default error code for unexpected errors
    }
  };
  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await SendRequest(apiurllogin, "POST", signInData);
      setsignInResponse("Login Success");
      sessionStorage.setItem("session", response.token);
      console.log(response);
      onlogin();
    } catch (error) {
      setsignInResponse("Invalid credentials");
    }
  };

  const checkSessionAndLogin = async () => {
    const session = sessionStorage.getItem("session");
    if (session) {
      try {
        const response = await SendRequest(
          apiurlsession,
          "GET",
          undefined,
          undefined,
          {
            Authorization: session,
          }
        );
        onlogin();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    checkSessionAndLogin();
  }, []);

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSignInSubmit} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                name="email" // Change "Email" to "email"
                value={signInData.email}
                onChange={handleSignInInputChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="password"
                placeholder="Password"
                name="password" // This is already correct
                value={signInData.password}
                onChange={handleSignInInputChange}
              />
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <GoogleLoginButton
              className="signin"
              onGoogleAuthSuccess={handleGoogleAuthSuccess}
            />

            {signInResponse && (
              <p
                className={`response-message ${
                  signInStatusCode === 201 ? "success" : "error"
                }`}
              >
                {signInResponse}
              </p>
            )}
          </form>

          <form onSubmit={handleSignUpSubmit} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={signUpData.email}
                onChange={handleSignUpInputChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={signUpData.password}
                onChange={handleSignUpInputChange}
              />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <GoogleLoginButton
              className="signup"
              onGoogleAuthSuccess={handleGoogleAuthSuccess}
            />
            {signUpResponse && (
              <p
                className={`response-message ${
                  signUpStatusCode === 201 ? "success" : "error"
                }`}
              >
                {signUpResponse}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Don't have an account yet? Sign up and get access to all our
              services.
            </p>
            <button className="btn transparent" onClick={handleSignUp}>
              Sign up
            </button>
          </div>
          <img src="img/log.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>
              Already made an account here? Sign in and get access to all our
              services.
            </p>
            <button className="btn transparent" onClick={handleSignIn}>
              Sign in
            </button>
          </div>
          <img src="img/register.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignupSignin;
