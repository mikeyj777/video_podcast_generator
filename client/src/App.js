// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PodcastGenerator from './components/PodcastGenerator';
import WorkflowContainer from './components/WorkflowContainer';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/workflow" element={<WorkflowContainer />} />
      </Routes>
    </Router>
  );
}

export default App;