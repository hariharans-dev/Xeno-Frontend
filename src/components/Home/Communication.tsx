import { useEffect, useState } from "react";

import { SendRequest } from "../functions/SendRequest";
import "../style/home/Campaign.css";

const SegmentCampaign: React.FC = () => {
  const api_display_communication =
    "http://xenobackend.hariharans.me/api/communication/display";
  const api_display_campaign =
    "http://xenobackend.hariharans.me/api/campaign/display";

  const [name, setname] = useState("");
  const [segment_id, setsegment_id] = useState("");
  const [message, setmessage] = useState("");
  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");

  const [communications, setcommunication] = useState([]);
  const [campaigns, setcampaign] = useState([]);

  const [response, setresponse] = useState("");

  const [triggerVariable, setTriggerVariable] = useState(0);
  const [loading, setLoading] = useState(true);

  const session = sessionStorage.getItem("session");

  const get_communication_data = async () => {
    try {
      const response = await SendRequest(
        api_display_communication,
        "GET",
        undefined,
        undefined,
        {
          Authorization: session,
        }
      );
      console.log(response.data);
      setcommunication(response.data);
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

  const getCampaignNameById = (campaignId: any) => {
    const campaign = campaigns.find(
      (campaign) => campaign["id"] === campaignId
    );
    return campaign ? campaign["name"] : "Unknown Campaign";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([get_communication_data(), get_campaign_data()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">Communications</h1>
        <p className="dashboard-subheading">
          Logs of your Customer Communications are here.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-card">
            <ul className="website-list">
              {communications.length > 0 ? (
                (() => {
                  return (
                    <ul className="website-list">
                      {communications.map((communication, index) => (
                        <li key={index} className="instance-item">
                          <div className="instance-details">
                            <p className="instance-name">
                              <strong>Name: </strong>
                              {communication["email"]}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Campaign Name: </strong>
                              {getCampaignNameById(
                                communication["campaign_id"]
                              )}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Delivery Status: </strong>
                              {communication["delivery_status"]}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Message: </strong>
                              {communication["message"]}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Delivery date: </strong>
                              {new Date(
                                communication["delivery_date"]
                              ).toString()}
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
