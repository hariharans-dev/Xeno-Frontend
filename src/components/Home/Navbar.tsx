// Navbar.tsx
import { Link } from "react-router-dom";
import "../style/home/Navbar.css"; // Add some styling for the navbar
import { useNavigate } from "react-router-dom";
import { SendRequest } from "../functions/SendRequest";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const session = sessionStorage.getItem("session");

  const api_removealldata =
    "http://xenobackend.hariharans.me/api/auth/removedatabase";

  const onlogout = () => {
    sessionStorage.removeItem("session");
    navigate("/");
  };
  const removealldatabases = async () => {
    try {
      const response = await SendRequest(
        api_removealldata,
        "GET",
        undefined,
        undefined,
        {
          Authorization: session,
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/home">Customer</Link>
          </li>
          <li className="nav-item">
            <Link to="/home/segment">Segment</Link>
          </li>
          <li className="nav-item">
            <Link to="/home/campaign">Campaign</Link>
          </li>
          <li className="nav-item">
            <Link to="/home/communication">Communication</Link>
          </li>
        </ul>
        <div className="logout-button" onClick={removealldatabases}>
          Remove all data
        </div>
        <div className="logout-button" onClick={onlogout}>
          Logout
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
