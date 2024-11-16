import { ChangeEvent, useEffect, useRef, useState } from "react";
import "../style/home/Customer.css";
import { SendRequest } from "../functions/SendRequest";
import axios from "axios";

const CustomerPage: React.FC = () => {
  const api_display = "http://xenobackend.hariharans.me/api/customer/display";
  const api_display_file =
    "http://xenobackend.hariharans.me/api/customer/displayfile";
  const api_register = "http://xenobackend.hariharans.me/api/customer/register";
  const api_register_file =
    "http://xenobackend.hariharans.me/api/customer/registerfile";

  const [customers, setcustomer] = useState([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [response, setresponse] = useState("");

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [total_spending, settotal_spending] = useState("");
  const [visits, setvisits] = useState("");
  const [last_visit, setlast_visit] = useState("");

  const [csvFile, setCsvFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const hasRun = useRef(false);
  const session = sessionStorage.getItem("session");

  const customer_function = async () => {
    try {
      const response = await SendRequest(
        api_display,
        "GET",
        undefined,
        undefined,
        {
          Authorization: session,
        }
      );
      console.log(response.data);
      setcustomer(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const customer_file_function = async () => {
    try {
      const response = await axios.get(api_display_file, {
        responseType: "blob",
        headers: {
          Authorization: session,
        },
      });

      const fileBlob = new Blob([response.data], { type: response.data.type });
      const fileUrl = URL.createObjectURL(fileBlob);
      setFileUrl(fileUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "customers-data.csv";
      link.click();
    }
  };

  const create_customer = async () => {
    const data = {
      name: name,
      email: email,
      total_spending: total_spending,
      visits: visits,
      last_visit: last_visit,
    };

    if (
      data.name &&
      data.email &&
      data.total_spending &&
      data.visits &&
      data.last_visit
    ) {
      try {
        const response = await SendRequest(
          api_register,
          "POST",
          data,
          undefined,
          {
            Authorization: session,
          }
        );
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setresponse("one of the feild is empty");
    }
  };

  const crate_customer_file = async () => {
    if (csvFile) {
      const formData = new FormData();
      formData.append("file", csvFile);
      try {
        const response = await SendRequest(
          api_register_file,
          "POST",
          formData,
          undefined,
          {
            Authorization: session,
          }
        );
        setresponse("file and customers added");
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
        setresponse("error in the file");
      }
    } else {
      alert("No file selected");
    }
  };

  const handleemailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setemail(e.target.value);
    setresponse("");
  };

  const handlenameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setname(e.target.value);
    setresponse("");
  };

  const handletotal_spendingChange = (e: ChangeEvent<HTMLInputElement>) => {
    settotal_spending(e.target.value);
    setresponse("");
  };

  const handlevisitsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setvisits(e.target.value);
    setresponse("");
  };

  const handlelast_visitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setlast_visit(e.target.value);
    setresponse("");
  };

  const handleCSV = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };
  useEffect(() => {
    if (!hasRun.current) {
      setLoading(true);
      Promise.all([customer_function(), customer_file_function()])
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
      hasRun.current = true;
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-heading">Customer Page</h1>
        <p className="dashboard-subheading">
          Welcome to your Customers page! Manage your customers
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h2 className="card-title">Your Customers</h2>
            <div>
              Download all customers
              <button className="download" onClick={handleDownload}>
                click
              </button>
            </div>
            {customers.length > 0 ? (
              <ul className="website-list">
                {customers.map((customer, index) => (
                  <li key={index} className="instance-item">
                    <div className="instance-details">
                      <p className="instance-name">
                        <strong>Email: </strong>
                        {customer["email"]}
                      </p>
                      <p className="instance-domain">
                        <strong>Name: </strong>
                        {customer["name"]}
                      </p>
                      <p className="instance-timestamp">
                        <strong>Total spending: </strong>
                        {customer["total_spending"]}
                      </p>
                      <p className="instance-timestamp">
                        <strong>Number of visits: </strong>
                        {customer["visits"]}
                      </p>
                      <p className="instance-timestamp">
                        <strong>Last visit: </strong>
                        {new Date(customer["last_visit"]).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No customers available.</p>
            )}
          </div>

          <div className="dashboard-card">
            <div>
              <h2 className="card-title">NEW CUSTOMER</h2>
              <div className="feild">
                <label>Name</label>
                <input
                  className="input"
                  type="text"
                  id="name"
                  placeholder="Name"
                  name="name"
                  onChange={(e) => handlenameChange(e)}
                />
              </div>
              <div className="feild">
                <label>Email</label>
                <input
                  className="input"
                  type="text"
                  id="email"
                  placeholder="Email"
                  name="email"
                  onChange={(e) => handleemailChange(e)}
                />
              </div>
              <div className="feild">
                <label>Total Spending</label>
                <input
                  className="input"
                  type="number"
                  id="total-spending"
                  placeholder="Total Spendings"
                  name="total_spending"
                  onChange={(e) => handletotal_spendingChange(e)}
                />
              </div>
              <div className="feild">
                <label>Number of Visits</label>
                <input
                  className="input"
                  type="number"
                  id="visits"
                  placeholder="Visits"
                  name="visits"
                  onChange={(e) => handlevisitsChange(e)}
                />
              </div>
              <div className="feild">
                <label>Last Visit</label>
                <input
                  className="input"
                  type="datetime-local"
                  id="last_visti"
                  placeholder="Last Visit"
                  name="last_visit"
                  onChange={(e) => handlelast_visitChange(e)}
                />
              </div>
              <button
                type="button"
                onClick={create_customer}
                className="create-button"
              >
                CREATE
              </button>
            </div>
            <div className="csv">
              <h3>CREATE CUSTOMER USING .CSV</h3>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleCSV(e)} // Function to handle CSV file upload
              />
              <button
                type="button"
                onClick={crate_customer_file}
                className="create-button"
              >
                CREATE
              </button>
            </div>
            {response && <div className={`response-message `}>{response}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
function parseCSV(text: string | ArrayBuffer | null) {
  throw new Error("Function not implemented.");
}
