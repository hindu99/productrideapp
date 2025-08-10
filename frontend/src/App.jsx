import React from 'react';
import './App.css';
import Login from  './pages/Login/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup/signup.jsx';
import Requirementpage from './pages/Requirementpage/requirementpage.jsx';
import RequirementWriting from './components/RequirmentBugWritingBox/requirmentbugwritingbox.jsx';
import Sidebar from './components/Sidebar/sidebar.jsx';
import Pagelayout from './components/PageLayouts/pagelayout.jsx'



function App() {
  //const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/requirementbox" element={<RequirementWriting />} />
        <Route path="/requirementpage" element={<Requirementpage />} />|*
      </Routes>
    </Router>
  );
}

export default App
