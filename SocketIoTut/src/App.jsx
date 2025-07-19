/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Chat from './Chat/Chat.jsx';
import Display from './Chat/Display/Display.jsx';
import users from '../public/user.js';
import useStore from './GlobalStore.js';
import MainDb from '../IndexDb/index.js';
import { ChatDB } from '../IndexDb/ChatDb.js';
import { openChatDB } from '../IndexDb/Onupdatedversion.js';
import { chatDB2 } from '../IndexDb/NewDb/Chat.js';

function AskToChat({ setCreRoom }) {
  return (
    <div className='fixed top-0 right-0 z-20 '>
      <button
        onClick={() => setCreRoom(true)}
        className='bg-red-500 h-[20px] w-[20px text-2xl font-extrabold text-lime-600'
      >
        Want To chat ?
      </button>
    </div>
  )
}

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showIdentityMenu, setShowIdentityMenu] = useState(false); // Toggle menu
  const [Allusers, setAllusers] = useState(users);
  const [isWant, setIswant] = useState(false);
  const [creRoom, setCreRoom] = useState(false);
  const addChatRoom = useStore((s) => s.addChatRoom);
  const handleSelect = (user) => {
    setSelectedUser((prev) => (prev === user ? null : user));
  };
  useEffect(() => {
    // MainDb();
    //     ChatDB.init();
    //     openChatDB().then(async (db) => {
    //   const tx = db.transaction("chats", "readonly");
    //   const store = tx.objectStore("chats");

    //   console.log("✅ Available indexes:", [...store.indexNames]);

    //   // Make sure 'time' index was created correctly
    //   const index = store.index("time");

    //   const result = await new Promise((resolve, reject) => {
    //     const req = index.getAll(); // Gets all records sorted by 'time'
    //     req.onsuccess = () => resolve(req.result);
    //     req.onerror = () => reject(req.error);
    //   });

    //   // Log all chat messages with time
    //   console.log("✅ All chats sorted by time:");
    //   console.log(result);
    //   result.forEach(chat => {
    //     console.log(`[${chat.time}] ${chat.sender.name}: ${chat.message}`);
    //   });
    // });
    async function waitDb() {
      await chatDB2.init();
    }
    waitDb();


  }, [])
  const handleCurrentUserSelect = (user) => {
    setCurrentUser(user);
    setShowIdentityMenu(false); // Close menu on selection
  };

  const toggleMenu = () => setShowIdentityMenu((prev) => !prev);

  useEffect(() => {
    let updatedUser = users.filter(e => e._id !== currentUser?._id);
    setAllusers(updatedUser);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && selectedUser) {
      console.log("this is setIswant ")
      setIswant(true)
    }
    if (creRoom) {
      const roomId = {
        _id: crypto.randomUUID(),
      }
      addChatRoom(roomId);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, selectedUser, isWant, creRoom])

  return (
    <div className="flex flex-col h-full w-full gap-3 p-4 relative">

      {/* 🔁 Toggle Profile Selector */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleMenu}
          className="w-12 h-12 rounded-full shadow-lg bg-[#D6EFD8] flex items-center justify-center text-green-900 font-bold text-xl hover:scale-105 transition"
          title="Select your profile"
        >
          {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
        </button>
      </div>

      {/* 🧍 Identity Selector Popup */}
      {showIdentityMenu && (
        <div className="absolute top-20 right-4 bg-[#D6EFD8] rounded-xl p-4 shadow-lg z-10 w-[250px] max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Select Your Profile</h3>
          <div className="grid grid-cols-2 gap-3">
            {users.map((user, idx) => {
              const isMe = currentUser && currentUser._id === user._id;
              return (
                <button
                  key={idx}
                  onClick={() => handleCurrentUserSelect(user)}
                  className={`flex flex-col items-center p-3 rounded-lg text-sm border transition-all duration-150
                    ${isMe ? 'bg-green-700 text-white scale-105' : 'bg-[#D6EFD8] hover:bg-green-100 text-green-900'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${isMe ? 'bg-white text-green-700' : 'bg-green-200 text-green-800'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm mt-1 truncate">{user.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {isWant && <AskToChat setCreRoom={setCreRoom} />}


      {/* 1. Chat User Selector */}
      <div className="max-h-40 overflow-y-auto bg-white border rounded-lg p-2 shadow-sm scrollbar-thin scrollbar-thumb-gray-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Select a user to chat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Allusers.map((user, idx) => {
            const isSelected = selectedUser && selectedUser._id === user._id;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(user)}
                className={`flex flex-col items-center p-3 rounded-lg transition-transform duration-200 border
              ${isSelected ? 'bg-blue-600 text-white scale-105 shadow-md' : 'bg-gray-50 hover:bg-blue-100 text-gray-800'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg 
              ${isSelected ? 'bg-white text-blue-600' : 'bg-blue-200 text-blue-800'}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="mt-2 text-sm font-medium truncate">{user.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Chat Display */}
      <div className="flex-grow min-h-0 bg-blue-200 rounded p-3 overflow-y-auto shadow-inner">
        <Display selectedUser={selectedUser} currentUser={currentUser} />
      </div>

      {/* 3. Chat Input */}
      <Chat selectedUser={selectedUser} currentUser={currentUser} />
    </div>
  );
}

export default App;
