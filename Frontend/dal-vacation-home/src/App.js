import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Signup from "./Features/User-Authentication/Signup.js";
import UserConcern from "./Features/Message-passing/UserConcern.jsx";
import Rooms from "./CommonComponents/Rooms/Rooms.jsx";
import RoomDetail from "../src/CommonComponents/RoomDetail/RoomDetail.jsx";
import AddNewListing from "./CommonComponents/AddNewListing/AddNewListing.jsx";
import Chatbot from "./Features/Virtual-Assistant/index.js";
import LookerStudioEmbed from "./Features/Looker-Studio/LookerStudioEmbed.jsx";
import UpdateList from "./CommonComponents/UpdateNewList/UpdateList.jsx";
import QuestionAuth from "./Features/User-Authentication/QuestionAuth.js";
import CypherAuth from "./Features/User-Authentication/CypherAuth.js";
import LoginFlow from "./Features/User-Authentication/LoginFlow.js";
import ResponsiveAppBar from "./CommonComponents/Headers/Appbar.js";
import Cookies from 'js-cookie';
import PrivateRoute from "./utils/PrivateRoute.js";

function App() {
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [updated, setUpdated] = useState(false);

  const toggleUpdated = () => {
    setUpdated(!updated);
  }

  useEffect(() => {
    const name = Cookies.get("name") || null;
    const email = Cookies.get("email") || null;
    const role = Cookies.get("profile") || null;

    setCurrentUserName(name);
    setCurrentUserEmail(email);
    setCurrentUserRole(role);
  }, [updated]);

  return (
    <Router>
      <AppContent
        currentUserName={currentUserName}
        currentUserEmail={currentUserEmail}
        currentUserRole={currentUserRole}
        toggleUpdated={toggleUpdated}
      />
    </Router>
  );
}

function AppContent({ currentUserName, currentUserEmail, currentUserRole, toggleUpdated }) {
  const location = useLocation();
  console.log(location)

  return (
    <div>
      <ResponsiveAppBar name={currentUserName} role={currentUserRole} toggleUpdated={toggleUpdated} />
      {currentUserName && <Chatbot />}
      <Routes>
        <Route path="/" element={<Rooms />} />
        <Route path="/rooms/:roomId" element={<RoomDetail role={currentUserRole} />} />
        <Route path="/login" element={<LoginFlow toggleUpdated={toggleUpdated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cypher-auth" element={<CypherAuth />} />
        <Route path="/question-auth" element={<QuestionAuth />} />

        <Route
          path="/update-room/:roomId"
          element={
            <PrivateRoute allowedRoles={['property-agent']}>
              <UpdateList />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <PrivateRoute allowedRoles={['property-agent']}>
              <UserConcern />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute allowedRoles={['property-agent']}>
              <AddNewListing />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['property-agent']}>
              <LookerStudioEmbed />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

