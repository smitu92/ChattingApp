import { Routes, Route } from "react-router-dom"
import Chat from "./pages/App/Chat.jsx"
import Login from "./pages/Auth/login";
import Auth_callBack from "./pages/Auth/authCallback";
import Registration from "./pages/Auth/registration";
import ProfilePage from "./pages/App/Profile.jsx";
import Guild1 from "./pages/App/guild.jsx";

import './store/appStore.js'
import './store/chatStore.js'
import AppLayout from "./pages/App/AppLayout.jsx";
import SettingsPage from "./components/setting.jsx";
import TestALLUser from "./pages/App/testing.jsx";

export default function App() {
  return (
    <Routes>
      {/* Auth routes - no layout needed */}
      <Route path="/auth">
        <Route path="login" element={<Login/>}/>
        <Route path="callback" element={<Auth_callBack/>}/>
        <Route path="registration" element={<Registration/>}/>
      </Route>
      
      {/* ⭐ ALL app routes wrapped in AppLayout */}
      <Route path="/" element={<AppLayout/>}>
        <Route index element={<Chat/>}/>  {/* / route */}
        <Route path="profile" element={<ProfilePage/>}/>
        <Route path="testing" element={<TestALLUser/>}/>
        <Route path="guild1" element={<Guild1/>}/>
        <Route path="settings" element={<SettingsPage/>}/> {/* ← NEW */}
      </Route>
    </Routes>
  )
}