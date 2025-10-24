import { Routes, Route } from "react-router-dom"
import Chat from "./pages/App/Chat.jsx"
import Login from "./pages/Auth/login";
import Auth_callBack from "./pages/Auth/authCallback";
import Registration from "./pages/Auth/registration";
import ProfilePage from "./pages/App/Profile.jsx";
import Guild1 from "./pages/App/guild.jsx";
import Testing from "./pages/App/testing.jsx";

export default function App() {


  
  return (

      <Routes>
            {/* <Route path="/" element={<Applayout/>}>
            
                    <Route path="Chat" element={<Chat/>}/>
                    <Route path="Profile" element={<Profile/>}/>
            </Route> */}
            <Route path="/auth" >
                        <Route path="login" element={<Login/>}/>
                        <Route path="callback" element={<Auth_callBack/>}/>
                        <Route path="registration" element={<Registration/>}/>
            </Route>
            <Route path="/testing" element={<Testing/>}/>
                             
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/" element={<Chat/>}/>
            <Route path="/guild1" element={<Guild1/>}/>

            


      </Routes>

      )
}