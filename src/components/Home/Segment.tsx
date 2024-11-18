import { useEffect, useRef, useState } from "react";

import { SendRequest } from "../functions/SendRequest";
import "../style/home/Segment.css";
import { useDomain } from "../../DomainProvider";

type Condition = {
  id: number;
  field: string;
  operator: string;
  value: string;
};

const Segment: React.FC = () => {
  const domain = useDomain();
  const api_display_segment = domain + "/api/segment/display";
  const api_display_campaign = domain + "/api/campaign/display";
  const api_register_segment = domain + "/api/segment/register";

  const [segments, setsegment] = useState([]);
  const [campaigns, setcampaign] = useState([]);

  const [conditions, setconditions] = useState<Condition[]>([]);

  const [segmentresponse, setsegmentresponse] = useState("");

  const [createpageresponse, setcreatepageresponse] = useState("");
  const [createpageresponseType, setcreatepageresponseType] = useState("");
  const [segmentname, setsegmentname] = useState("");

  const [triggerVariable, setTriggerVariable] = useState(0);
  const [loading, setLoading] = useState(true);

  const session = sessionStorage.getItem("session");

  const handlecreatesegment = async () => {
    if (conditions.length == 0) {
      setsegmentresponse("condition is empty");
    } else {
      const lastCondition = conditions[conditions.length - 1];
      console.log(lastCondition);
      var updatedcontitions = conditions;

      if (
        lastCondition &&
        (lastCondition.field === "" ||
          lastCondition.operator === "" ||
          lastCondition.value === "")
      ) {
        const conditionsCopy = [...conditions];
        conditionsCopy.pop();
        updatedcontitions = conditionsCopy;
      }
      const updatedConditions = updatedcontitions.map(
        ({ id, ...condition }) => condition
      );
      if (updatedConditions.length != 0) {
        const data = { name: segmentname, conditions: updatedConditions };
        console.log(data);
        try {
          const response = await SendRequest(
            api_register_segment,
            "POST",
            data,
            undefined,
            {
              Authorization: session,
            }
          );
          setsegmentresponse("Segment Added");
          setTriggerVariable(1);
        } catch (error: any) {
          setsegmentresponse(error.response.data.errors[0].msg);
        }
      } else {
        setsegmentresponse("condition is empty");
      }
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

  const addConditions = () => {
    const lastCondition = conditions[conditions.length - 1];

    if (
      lastCondition &&
      (lastCondition.field === "" ||
        lastCondition.operator === "" ||
        lastCondition.value === "")
    ) {
      setsegmentresponse("empty condition feilds");
      return;
    }
    setconditions((prevConditions) => [
      ...prevConditions,
      {
        id: prevConditions.length + 1,
        field: "total_spending",
        operator: "",
        value: "",
      },
    ]);
    console.log(conditions);
  };

  const handleInputChange = (
    id: number,
    field: string,
    operator: string,
    value: string
  ) => {
    setconditions((prevConditions) =>
      prevConditions.map((currentCondition) =>
        currentCondition.id === id
          ? { ...currentCondition, field, operator, value }
          : currentCondition
      )
    );
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
        <h1 className="dashboard-heading">Segment </h1>
        <p className="dashboard-subheading">
          Manage your Customer Segments plans here.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h2 className="card-title">Create new Segment</h2>
            <form>
              <label htmlFor="instance">Segment name</label>
              <input
                type="text"
                className="instance"
                value={segmentname}
                onChange={(e) => setsegmentname(e.target.value)}
                required
              />
              <label htmlFor="choosecondition">Segment Conditions</label>

              <>
                {conditions.map((condition) => (
                  <div
                    key={condition.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <label style={{ minWidth: "120px", fontWeight: "bold" }}>
                      Condition {condition.id}:
                    </label>
                    <select
                      value={condition.field}
                      onChange={(e) =>
                        handleInputChange(
                          condition.id,
                          e.target.value,
                          condition.operator,
                          condition.value
                        )
                      }
                      style={{
                        flex: "1",
                        width: "80px",
                        padding: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      required
                    >
                      <option value="total_spending">Total Spending</option>
                      <option value="visits">Visits</option>
                      <option value="last_visit">Last Visit</option>
                    </select>
                    {(condition.field === "total_spending" ||
                      condition.field === "visits") && (
                      <div style={{ flex: 1 }}>
                        {" "}
                        <input
                          type="text"
                          placeholder="Operator"
                          value={condition.operator}
                          onChange={(e) =>
                            handleInputChange(
                              condition.id,
                              condition.field,
                              e.target.value, // operator
                              condition.value
                            )
                          }
                          style={{
                            flex: "1",
                            width: "80px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Value"
                          value={condition.value}
                          onChange={(e) =>
                            handleInputChange(
                              condition.id,
                              condition.field,
                              condition.operator,
                              e.target.value
                            )
                          }
                          style={{
                            flex: "1",
                            width: "80px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    )}
                    {condition.field == "last_visit" && (
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          placeholder="Operator"
                          value={condition.operator}
                          onChange={(e) =>
                            handleInputChange(
                              condition.id,
                              condition.field,
                              e.target.value,
                              condition.value
                            )
                          }
                          style={{
                            flex: "1",
                            width: "80px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        />
                        <input
                          type="datetime-local"
                          placeholder="Operator"
                          value={condition.operator}
                          onChange={(e) =>
                            handleInputChange(
                              condition.id,
                              condition.field,
                              e.target.value,
                              condition.value
                            )
                          }
                          style={{
                            flex: "1",
                            width: "80px",
                            padding: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={addConditions}
                  style={{ marginTop: "10px", padding: "5px" }}
                >
                  Add Condition
                </button>
              </>

              <button
                type="submit"
                className="create-button"
                onClick={handlecreatesegment}
              >
                Create Segment
              </button>
              {segmentresponse && (
                <div className={`response-message `}>{segmentresponse}</div>
              )}
            </form>
            {createpageresponse && (
              <div className={`response-message ${createpageresponseType}`}>
                {createpageresponse}
              </div>
            )}
          </div>
          <div className="dashboard-card">
            <h2 className="card-title">Segment details</h2>
            <ul className="website-list">
              {segments.length > 0 ? (
                (() => {
                  return (
                    <ul className="website-list">
                      {segments.map((segment, index) => (
                        <li key={index} className="instance-item">
                          <div className="instance-details">
                            <p className="instance-name">
                              <strong>Name: </strong>
                              {segment["name"]}
                            </p>
                            <p className="instance-timestamp">
                              <strong>Conditions: </strong>

                              <ul>
                                {(() => {
                                  const conditionsList = [];
                                  let index = 0;

                                  while (
                                    segment["conditions"][index] !== undefined
                                  ) {
                                    const condition =
                                      segment["conditions"][index];
                                    conditionsList.push(
                                      <li key={index}>
                                        {condition["field"] +
                                          " " +
                                          condition["operator"] +
                                          " " +
                                          condition["value"]}
                                      </li>
                                    );
                                    index++;
                                  }

                                  return conditionsList;
                                })()}
                              </ul>
                            </p>
                            <p className="instance-name">
                              <strong>Customer Count: </strong>
                              {segment["customer_count"]}
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

export default Segment;
