import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new" element={<newSignup />} />
            </Routes>
        </Router>
    )
}

export default App;