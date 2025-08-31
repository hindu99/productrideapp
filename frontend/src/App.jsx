import React, { useEffect } from 'react';
import './App.css';
import Login from  './pages/Login/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup/signup.jsx';
import Requirementpage from './pages/Requirementpage/requirementpage.jsx';
import RequirementWriting from './components/RequirmentBugWritingBox/requirmentbugwritingbox.jsx';
import Sidebar from './components/Sidebar/sidebar.jsx';
import Pagelayout from './components/PageLayouts/pagelayout.jsx'
import Createusers from './pages/Adminpages/createuser.jsx';
import Createprojects from './pages/Adminpages/createproject.jsx';

import Adminmainpage from './pages/Adminpages/adminmain.jsx';
import Board from './pages/Kanbanboard/board.jsx';
import Entrypage from './pages/Entrypage/entrypage.jsx';





function App() {
  //const [count, setCount] = useState(0)

/*This function multitablogout is used for multitab logout, in case if a user press Logot
*Then the Logout function will remove tokern and projecct Id
*Then because there is a chnage in the storage this gets activated 
*If no token in storage main app will direct everything to login page

*/
  useEffect(() => {
  const multitablogout = (e) => {
    if (e.key === 'token' && !e.newValue) {
      // If token is cleard all the tabs will be directed to loginpage 
      window.location.href = '/';
    }
  };
//check for change in storage 
  window.addEventListener('storage', multitablogout);
  return () => window.removeEventListener('storage', multitablogout);
}, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/requirementbox" element={<RequirementWriting />} />
        <Route path="/adminmainpage" element={<Adminmainpage />} />
        <Route path="/requirementpage" element={<Requirementpage />} />
        <Route path="/createproject" element={<Createprojects />} />
        <Route path="/createnonadminuser" element={<Createusers />} />|
        <Route path="/Board" element={<Board />} />|
        <Route path="/entrypage" element={<Entrypage />} />|
      </Routes>
    </Router>
  );
}

export default App
