import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { SendRequest } from "../functions/SendRequest";
import "../style/home/AccountPage.css";

const Communication: React.FC = () => {
  const apiurl_user =
    "https://vzo16sqfhl.execute-api.ap-south-1.amazonaws.com/stage1/user";
  const apiurl_subscription =
    "https://vzo16sqfhl.execute-api.ap-south-1.amazonaws.com/stage1/subscription";

  const navigate = useNavigate();

  const session = sessionStorage.getItem("session");

  const [response, setresponse] = useState("");
  const [responsetype, setresponsetype] = useState("");

  const [subscriptions, setSubscriptions] = useState([]);

  const [loading, setLoading] = useState(true); // Loading state

  const [password, setpassword] = useState("");
  const [repassword, setrepassword] = useState("");

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setpassword(e.target.value);
    setresponse(""); // Clear response when typing
  };

  const handleRepasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setrepassword(e.target.value);
    setresponse(""); // Clear response when typing
  };

  const subscriptiondata = async () => {
    const senddata = { request: "search", session: session };
    try {
      const response = await SendRequest(apiurl_subscription, "POST", senddata);
      const { statusCode, body } = response;
      if (statusCode === 200 || statusCode === 201) {
        setSubscriptions(body || []); // Set subscriptions to an empty array if body is undefined
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const Update_password = async () => {
    const senddata = {
      request: "change_password",
      session: session,
      password: password,
    };
    try {
      const response = await SendRequest(apiurl_user, "POST", senddata);
      const { statusCode, body } = response;

      setresponse(body);

      if (statusCode === 201) {
        setresponse("Password Updated");
        setresponsetype("success");
        logout();
      } else {
        setresponse(body);
        setresponsetype("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setresponse("Error in updating password");
      setresponsetype("error");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("session");
    navigate("/?response=password changed");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before data fetch
      try {
        await Promise.all([subscriptiondata()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">Account</h1>
        <p className="dashboard-subheading">
          Manage your hosting account and settings here.
        </p>
      </div>

      {loading ? ( // Show loading state
        <p>Loading...</p>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="sign-in-form">
              <h1 className="title">Password Update</h1>
              <h2></h2>
              <p className="description">
                Please enter the email address associated with your account, and
                we'll send you a link to create a new password.
              </p>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password" // This is already correct
                  onChange={(e) => handlePasswordChange(e)}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password" // Change "Email" to "email"
                  onChange={(e) => handleRepasswordChange(e)}
                />
              </div>
              <div className="button-box">
                <button className="btn" onClick={() => Update_password()}>
                  Update
                </button>
              </div>

              {response && (
                <div className={`response-message ${responsetype}`}>
                  {response}
                </div>
              )}

              {!response && password !== repassword && password !== "" && (
                <div className="response-message error">
                  Passwords donot match
                </div>
              )}
            </div>
          </div>
          <div className="dashboard-card">
            <h2 className="card-title">Subscriptions History</h2>
            <ul className="website-list">
              {subscriptions.length > 0 ? (
                (() => {
                  if (subscriptions.length > 0) {
                    return (
                      <ul className="website-list">
                        {subscriptions.map((subscription, index) => (
                          <li key={index} className="instance-item">
                            <div className="instance-details">
                              <p className="instance-name">
                                <strong>Status: </strong>
                                {subscription["status"]}
                              </p>
                              <p className="instance-domain">
                                <strong>Start date: </strong>
                                {new Date(
                                  subscription["from_time"]
                                ).toLocaleString()}
                              </p>
                              <p className="instance-timestamp">
                                <strong>End date: </strong>
                                {new Date(
                                  subscription["to_time"]
                                ).toLocaleString()}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    );
                  } else {
                    // If there are no running subscriptions
                    return <p>No subscriptions available.</p>;
                  }
                })()
              ) : (
                <p>No subscriptions available.</p> // Message if no subscriptions
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
