import React from "react";
import { Link } from "react-router-dom";
import "./style/ErrorPage.css"; // Import your error page styles

const ErrorPage: React.FC = () => {
  return (
    <div className="error-container">
      <h1 className="error-code">404</h1>
      <h2 className="error-message">Oops! Page Not Found</h2>
      <p className="error-description">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/home" className="btn">
        Back
      </Link>
    </div>
  );
};

export default ErrorPage;
