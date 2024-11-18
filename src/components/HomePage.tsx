// HomePage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "./Home/Navbar";
import "./style/Home.css"; // Import your CSS file
import { SendRequest } from "./functions/SendRequest";

import { useDomain } from "../DomainProvider";

const HomePage: React.FC = () => {
  const domain = useDomain();
  const apiurlsession = domain + "/api/auth/session";
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };

  const validateSession = async () => {
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
      } catch (error) {
        sessionStorage.removeItem("session");
        redirectToLogin();
      }
    } else {
      redirectToLogin();
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <div className="homepage">
      <Navbar />
      <div className="content">
        <Outlet />{" "}
      </div>
    </div>
  );
};

export default HomePage;
