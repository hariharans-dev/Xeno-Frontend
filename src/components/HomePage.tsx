// HomePage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "./Home/Navbar";
import "./style/Home.css"; // Import your CSS file
import { SendRequest } from "./functions/SendRequest";

const apiurlsession = "http://xenobackend.hariharans.me/api/auth/session";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/auth");
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
