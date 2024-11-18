import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import SignupSignin from "./components/Authentication";
import HomePage from "./components/HomePage";
import SegmentCampaign from "./components/Home/Segment";
import Communication from "./components/Home/Communication";
import CustomerPage from "./components/Home/Customer";
import ErrorPage from "./components/ErrorPage";
import Campaign from "./components/Home/Campaign";
import { DomainProvider } from "./DomainProvider";

function App() {
  return (
    <DomainProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SignupSignin />} />
            <Route path="/home" element={<HomePage />}>
              <Route index element={<CustomerPage />} />
              <Route path="segment" element={<SegmentCampaign />} />
              <Route path="campaign" element={<Campaign />} />
              <Route path="communication" element={<Communication />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </DomainProvider>
  );
}

export default App;
