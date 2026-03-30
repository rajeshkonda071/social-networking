import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeContentFeed from "./pages/HomeContentFeed";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={user ? <HomeContentFeed /> : <Login />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/profile/:id" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
