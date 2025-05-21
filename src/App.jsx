import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Properties from './components/Properties';
import ReservationForm from './components/ReservationForm';
 
function App() {
  return (
    <Routes>
      <Route path="/" element={<Properties/>} />
      <Route path="/reserve" element={<ReservationForm/>} />
    </Routes>
  );
}
 
export default App;