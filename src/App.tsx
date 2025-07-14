import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Statistics from './pages/Statitscs';
import Redirect from './pages/Redirect';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Statistics />} />
        <Route path="/:shortcode" element={<Redirect />} />
      </Routes>
    </Router>
  );
}

export default App;
