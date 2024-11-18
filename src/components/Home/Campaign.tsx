import { useEffect, useState } from "react";

import { SendRequest } from "../functions/SendRequest";
import "../style/home/Campaign.css";

import { useDomain } from "../../DomainProvider";

const SegmentCampaign: React.FC = () => {
  const domain = useDomain();
  const api_display_segment = domain + "/api/segment/display";
  const api_display_campaign = domain + "/api/campaign/display";
  const api_register_campaign = domain + "/api/campaign/register";

  const [name, setname] = useState("");
  const [segment_id, setsegment_id] = useState("");
  const [message, setmessage] = useState("");
  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");

  const [segments, setsegment] = useState([]);
  const [campaigns, setcampaign] = useState([]);

  const [response, setresponse] = useState("");

  const [triggerVariable, setTriggerVariable] = useState(0);
  const [loading, setLoading] = useState(true);

  const session = sessionStorage.getItem("session");

  const handlecreatecampaign = async () => {
    const formatDateToMySQL = (dateString: any) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const data = {
      name: name,
      segment_id: segment_id,
      message: message,
      start_date: formatDateToMySQL(startdate),
      end_date: formatDateToMySQL(enddate),
    };

    try {
      const response = await SendRequest(
        api_register_campaign,
        "POST",
        data,
        undefined,
        {
          Authorization: session,
        }
      );
      setresponse("Campaign initiated");
      setTriggerVariable(1);
    } catch (error) {
      setresponse("Error crating the campaign");
    }
  };

  const get_segment_data = async () => {
    try {
      const response = await SendRequest(
        api_display_segment,
        "GET",
        undefined,
        undefined,
        {
          Authorization: session,
        }
      );
      console.log(response.data);
      setsegment(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const get_campaign_data = async () => {
    try {
      const response = await SendRequest(
        api_display_campaign,
        "GET",
        undefined,
        undefined,
        {
          Authorization: session,
        }
      );
      console.log(response);
      setcampaign(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([get_segment_data(), get_campaign_data()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [triggerVariable]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">Campaign</h1>
        <p className="dashboard-subheading">
          Manage your Customer Campaigns plans here.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h2 className="card-title">Create new Campaigns</h2>
            <form>
              <label htmlFor="instance">Campaign name</label>
              <input
                type="text"
                className="instance"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
              <label htmlFor="instance">Campaign Message</label>
              <select
                name="segments"
                id="segments"
                onChange={(e) => setsegment_id(e.target.value)}
              >
                <option value="">Select a Segment</option>
                {segments.map((segment) => (
                  <option key={segment["id"]} value={segment["id"]}>
                    {segment["name"]}
                  </option>
                ))}
              </select>
              {(() => {
                let internalcondition: any[] = [];

                segments.forEach((segment) => {
                  if (segment["id"] + "" === segment_id) {
                    internalcondition = segment["conditions"];
                  }
                });

                return (
                  <ul>
                    {segment_id && <p>Conditions:</p>}
                    <ul>
                      {internalcondition.map((cond, index) => (
                        <li key={index}>
                          <li key={index}>
                            {cond["field"] +
                              " " +
                              cond["operator"] +
                              " " +
                              cond["value"]}
                          </li>
                        </li>
                      ))}
                    </ul>
                  </ul>
                );
              })()}

              <label htmlFor="instance">Campaign Message</label>
              <input
                type="text"
                className="instance"
                value={message}
                onChange={(e) => setmessage(e.target.value)}
                required
              />
              <label htmlFor="instance">Campaign Start Date</label>
              <input
                style={{ width: "200px", padding: "5px" }}
                type="datetime-local"
                className="instance"
                value={startdate}
                onChange={(e) => setstartdate(e.target.value)}
                required
              />
              <label htmlFor="instance">Campaign End Date</label>
              <input
                style={{ width: "200px", padding: "5px" }}
                type="datetime-local"
                className="instance"
                value={enddate}
                onChange={(e) => setenddate(e.target.value)}
                required
              />
              <button
                style={{ width: "200px", marginTop: "20px" }}
                className="create-button"
                onClick={handlecreatecampaign}
              >
                Create Campaign
              </button>
            </form>
          </div>
          <div className="dashboard-card">
            <h2 className="card-title">Campaign details</h2>
            <ul className="website-list">
              {campaigns.length > 0 ? (
                (() => {
                  return (
                    <ul className="website-list">
                      {campaigns.map((campaign, index) => (
                        <li key={index} className="instance-item">
                          <div className="instance-details">
                            <p className="instance-name">
                              <strong>Name: </strong>
                              {campaign["name"]}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Segment ID: </strong>
                              {campaign["segment_id"]}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Success Count: </strong>
                              {campaign["success_count"]}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Message: </strong>
                              {campaign["message"]}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Start date: </strong>
                              {new Date(campaign["start_date"]).toString()}
                            </p>
                            <p className="instance-timestamp">
                              <strong>End date: </strong>
                              {new Date(campaign["end_date"]).toString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  );
                })()
              ) : (
                <p>No subscriptions available.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentCampaign;
function Ref(arg0: string) {
  throw new Error("Function not implemented.");
}
