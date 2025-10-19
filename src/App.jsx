import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailOtp from "./pages/EmailOtp";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/emailOtp" element={<EmailOtp />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
