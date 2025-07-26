import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatApp from './pages/ChatApp.jsx';
import Profile from './pages/Profile.jsx';
import { useEffect } from 'react';
import { userDb } from '../IndexDb/user.js';
import { chatDB2 } from '../IndexDb/Chat.js';
import { chatDetailDb } from '../IndexDb/chatDetailDb.js';
import addUserdb from './utils.js';




export default function App() {
    useEffect(()=>{
        async function initDB() {
            await userDb.init();
            await chatDB2.init();
            await chatDetailDb.init();
            await addUserdb();
           
        }
        initDB();
    },[])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatApp/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new" element={<div className="p-6">New chat UI coming soon</div>} />
      </Routes>
    </Router>
  );
}