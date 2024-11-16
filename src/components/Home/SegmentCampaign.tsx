import { useEffect, useRef, useState } from "react";

import { SendRequest } from "../functions/SendRequest";
import "../style/home/HostingPage.css"; // Import the CSS file for HostingPage

const SegmentCampaign: React.FC = () => {
  const apiurl_instance =
    "https://vzo16sqfhl.execute-api.ap-south-1.amazonaws.com/stage1/hosting";
  const apiurl_subscription =
    "https://vzo16sqfhl.execute-api.ap-south-1.amazonaws.com/stage1/subscription";

  const [instances, setInstances] = useState([]); // Use camelCase for state names
  const [subscriptions, setSubscriptions] = useState([]);

  const [createpageresponse, setcreatepageresponse] = useState("");
  const [createpageresponseType, setcreatepageresponseType] = useState("");

  const [deletepageresponse, setdeletepageresponse] = useState("");
  const [deletepageresponseType, setdeletepageresponseType] = useState("");

  const [webpageName, setWebpageName] = useState(""); // State for webpage name
  const [domainType, setDomainType] = useState("public"); // State for domain type
  const [customDomain, setCustomDomain] = useState(""); // State for custom domain

  const [isSideWindowOpen, setIsSideWindowOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<Instance[] | null>(
    null
  );

  const [triggerVariable, setTriggerVariable] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const hasRun = useRef(false);

  const session = sessionStorage.getItem("session");

  interface Instance {
    State: string;
    PublicIpAddress: string;
    PublicDnsName: string; // Adjust this type if timestamp is a different type
  }

  interface SideWindowProps {
    instance: Instance | null; // Can be null if no instance is selected
    onClose: () => void; // Function to close the side window
  }

  const instancedata = async () => {
    const senddata = { request: "search", session: session };
    try {
      const response = await SendRequest(apiurl_instance, "POST", senddata);
      const { statusCode, body } = response;
      if (statusCode === 200 || statusCode === 201) {
        setInstances(body || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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

  const handlecreatewebsite = async (event: React.FormEvent) => {
    event.preventDefault();
    const senddata = {
      request: "create",
      session: session,
      instance_name: webpageName,
      domain: domainType === "custom" ? customDomain : "publicdns",
    };

    try {
      const response = await SendRequest(apiurl_instance, "POST", senddata);
      const { statusCode, body } = response;
      setcreatepageresponse(body);
      if (statusCode === 201) {
        setcreatepageresponseType("success");
        resetForm(); // Reset form fields after successful creation
      } else if (statusCode === 409) {
        setcreatepageresponseType("info");
      } else {
        setcreatepageresponseType("error");
      }
      reloadData("create");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handledeletewebsite = async (instance_name: string) => {
    const senddata = {
      request: "delete",
      session: session,
      instance_name: instance_name,
    };

    try {
      const response = await SendRequest(apiurl_instance, "POST", senddata);
      const { statusCode, body } = response;
      setdeletepageresponse(body);
      if (statusCode === 200) {
        setdeletepageresponseType("success");
      } else if (statusCode === 404) {
        setdeletepageresponseType("info");
      } else {
        setdeletepageresponseType("error");
      }
      reloadData("delete");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleshowwebsite = async (instance: string) => {
    const senddata = {
      request: "describe",
      session: session,
      instance_name: instance,
    };

    try {
      const response = await SendRequest(apiurl_instance, "POST", senddata);
      const { statusCode, body } = response;

      // Set selected instance details and open the side window
      setSelectedInstance(body);
      setIsSideWindowOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setWebpageName("");
    setCustomDomain("");
    setDomainType("public"); // Reset to default
  };

  const reloadData = (type: string) => {
    if (type === "create") {
      setdeletepageresponse("");
    } else {
      setcreatepageresponse("");
    }
    setTriggerVariable((prev) => prev + 1); // Change the trigger variable to re-fetch data
    console.log("Reloading data with triggerVariable:", triggerVariable + 1); // Log for debugging
  };

  useEffect(() => {
    console.log(
      "Data fetching effect running with triggerVariable:",
      triggerVariable
    ); // Log to check the effect trigger
    const fetchData = async () => {
      setLoading(true); // Set loading to true before data fetch
      try {
        await Promise.all([subscriptiondata(), instancedata()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
  }, [triggerVariable]);

  const SideWindow: React.FC<SideWindowProps> = ({ instance, onClose }) => {
    return (
      <div className="side-window">
        <div className="side-window-content">
          <button className="close-button" onClick={onClose}>
            Close
          </button>
          {instance && (
            <>
              <h2>Instance Details</h2>
              <p>
                <strong>State:</strong> {instance.State}
              </p>
              <p>
                <strong>Public IP Address:</strong> {instance.PublicIpAddress}
              </p>
              <p>
                <strong>Public DNS Name:</strong> {instance.PublicDnsName}
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">Hosting Services</h1>
        <p className="dashboard-subheading">
          Manage your hosting plans and settings here.
        </p>
      </div>

      {loading ? ( // Show loading state
        <p>Loading...</p>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h2 className="card-title">Create new websites</h2>
            <form onSubmit={handlecreatewebsite}>
              <label htmlFor="instance">Webpage name</label>
              <input
                type="text"
                className="instance"
                value={webpageName}
                onChange={(e) => setWebpageName(e.target.value)}
                required
              />
              <label htmlFor="choosedomain">Choose type of domain</label>
              <select
                name="choosedomain"
                id="choose"
                value={domainType}
                onChange={(e) => setDomainType(e.target.value)}
                required
              >
                <option value="public">Public domain</option>
                <option value="custom">Custom domain</option>
              </select>
              {domainType === "custom" && (
                <>
                  <label htmlFor="domain">Custom domain</label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    required
                  />
                </>
              )}
              <button type="submit" className="create-button">
                Create Website
              </button>
            </form>
            {createpageresponse && (
              <div className={`response-message ${createpageresponseType}`}>
                {createpageresponse}
              </div>
            )}
          </div>
          <div className="dashboard-card">
            <h2 className="card-title">Available Subscriptions</h2>
            <ul className="website-list">
              {subscriptions.length > 0 ? (
                // Check if there are subscriptions
                (() => {
                  // Filter subscriptions for those with 'running' status
                  const runningSubscriptions = subscriptions.filter(
                    (subscription) => subscription["status"] === "available"
                  );

                  if (runningSubscriptions.length > 0) {
                    return (
                      <ul className="website-list">
                        {runningSubscriptions.map((subscription, index) => (
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
      {loading ? ( // Show loading state
        <p></p>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-card manage-websites-panel">
            <h2 className="card-title">Manage Websites</h2>
            {instances.length > 0 ? (
              <ul className="website-list">
                {instances.map((instance, index) => (
                  <div key={index}>
                    <li className="instance-item">
                      <div className="instance-details">
                        <p className="instance-name">
                          <strong>Instance name: </strong>
                          {instance["instance"]}
                        </p>
                        <p className="instance-domain">
                          <strong>Domain: </strong>
                          {instance["domain"]}
                        </p>
                        <p className="instance-timestamp">
                          <strong>Created On: </strong>
                          {new Date(instance["timestamp"]).toLocaleString()}
                        </p>
                        <button
                          type="submit"
                          className="create-button"
                          onClick={() =>
                            handledeletewebsite(instance["instance"])
                          }
                        >
                          Terminate Website
                        </button>
                        <button
                          type="button" // Change to button to prevent form submission
                          className="create-button"
                          onClick={() =>
                            handleshowwebsite(instance["instance"])
                          }
                        >
                          Show details
                        </button>
                      </div>
                    </li>
                    {deletepageresponse && (
                      <div
                        className={`response-message ${deletepageresponseType}`}
                      >
                        {deletepageresponse}
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            ) : (
              <p>No instances available.</p>
            )}
          </div>

          {isSideWindowOpen && selectedInstance && (
            <SideWindow
              instance={selectedInstance[0]} // Pass the first instance from the array
              onClose={() => setIsSideWindowOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SegmentCampaign;
