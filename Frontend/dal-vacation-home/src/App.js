import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../src/CommonComponents/Headers/Header.jsx";
import Login from "./Features/User-Authentication/Login";
import UserConcern from "./Features/Message-passing/UserConcern.jsx";
import Rooms from "./CommonComponents/Rooms/Rooms.jsx";
import RoomDetail from "../src/CommonComponents/RoomDetail/RoomDetail.jsx"
import AddNewListing from "./CommonComponents/AddNewListing/AddNewListing.jsx";
import VacationSearchBar from "./CommonComponents/SearchBar/VaccationSearchBar.jsx";
import Chatbot from "./Features/Virtual-Assistant/index.js";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Chatbot />
        <Routes>
          <Route path="/" element={<Rooms />} />
          <Route path="/rooms/:roomId" element={<RoomDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Login />} />
          <Route path="/tickets" element={<UserConcern />} />
          <Route path="/add" element={<AddNewListing/>}/>
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
