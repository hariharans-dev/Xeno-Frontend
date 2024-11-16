import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import SignupSignin from "./components/Authentication";
import HomePage from "./components/HomePage";
import SegmentCampaign from "./components/Home/SegmentCampaign";
import Communication from "./components/Home/Communication";
import CustomerPage from "./components/Home/Customer";
import ErrorPage from "./components/ErrorPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth" element={<SignupSignin />} />
          <Route path="/home" element={<HomePage />}>
            <Route index element={<CustomerPage />} />
            <Route path="segmentcampaign" element={<SegmentCampaign />} />
            <Route path="communication" element={<Communication />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />{" "}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
