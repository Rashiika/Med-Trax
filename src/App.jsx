import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SmallLogin from "./pages/SmallLogin";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SmallLogin />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/verifyOtp" element={<VerifyOtp />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
