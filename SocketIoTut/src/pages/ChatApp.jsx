import SidebarNavigation from "../components/SidebarNavigation";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import ChatInfoPanel from "../components/ChatInfoPanel";
import UserSwitcher from "../components/userSwitch";
import NewChatButton from "../components/newchat";
import useChatStore from "../store";


export default function ChatApp() {
    const chatWindowToggle=useChatStore((state)=>state.chatWindowToggle);
    const handleUserChange = (user) => {
        console.log("Now chatting as:", user);
        // your logic to load chat
    };
    return (
        <div className="w-screen h-screen flex bg-gradient-to-br from-indigo-100 to-purple-100 font-sans text-gray-800 overflow-hidden">
            {/* Sidebar */}
            <div className="w-20 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg">
                <SidebarNavigation />
            </div>
         
            <UserSwitcher onUserChange={handleUserChange} />
     
            <NewChatButton />

            
      <div className="w-80 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg overflow-y-auto">
        <ChatList />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md rounded-md m-4 shadow-lg overflow-hidden">
        {chatWindowToggle && <ChatWindow />}
      </div>

      {/* Info Panel */}
      <div className="w-80 bg-white/80 backdrop-blur-md border-l border-gray-200 shadow-lg overflow-y-auto">
        <ChatInfoPanel />
      </div>
    </div>
  );
}
