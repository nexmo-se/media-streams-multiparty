import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Room from './pages/Room/index';
import GoodBye from './pages/GoodBye/index';
import RoomCreation from './pages/RoomCreation';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import { RoomProvider } from './Context/RoomContext';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import WaitingRoom from './pages/WaitingRoom';
import UserProvider from './Context/user';
import SessionProvider from './Context/session';

function App() {
  return (
    <Router>
      <UserProvider>
        <SessionProvider>
          <Routes>
            <Route path="/create-room" element={<RoomCreation />} />
            <Route path="/waiting-room/:roomName" element={<WaitingRoom />} />

            <Route
              path="/room/:roomName"
              element={
                // <div className="">
                <Room></Room>
                // </div>
              }
            />
            <Route path="/thankyou" element={<GoodBye />} />
            <Route path="*" element={<RoomCreation />} />
          </Routes>
        </SessionProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
