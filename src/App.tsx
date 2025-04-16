
import './App.css'
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Staff from './components/Staff';
import Farmers from './components/Farmers';
import Agent from './components/Agent';
import BankAgent from './components/BankAgent';
import FarmerDetails from './components/FarmerDetails';
import FPO from './components/FPO';

function App() {
 
  return (
    <Router>
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fpo" element={<FPO />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/bank-agent" element={<BankAgent />} />
          <Route path="/farmers/:id" element={<FarmerDetails />} />
          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </div>
  </Router>
  )
}

export default App
