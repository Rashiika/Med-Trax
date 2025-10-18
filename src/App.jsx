import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import VerifyOtpPage from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RoleSelectionPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verifyOtp" element={<VerifyOtpPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;