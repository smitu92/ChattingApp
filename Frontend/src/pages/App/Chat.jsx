// import { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppStore } from "../../store/appStore";
// import useMediaQuery from "../../hooks/useMediaQuery";
// import ChatList from "../../components/ChatList";
// import ChatWindow from "../../components/ChatWindow";
// import ProfileModal from "../../components/ProfileModal";
// import ContactsPicker from "../../components/ContactsPicker";
// import crateRoomId from "../../../services/main/creatRoomId";
// import insertData from "../../../services/offline/controllers/add";
// import inxdb from "../../db/dexieDbs/index";

// const USERS = [
//   { id: "u1", name: "Retro Designers", avatar: "🎨", status: "online", description: "Design gang." },
//   { id: "u2", name: "Build Buddies", avatar: "🛠️", status: "away", description: "Builders unite." },
//   { id: "u3", name: "Meme Dept.", avatar: "😂", status: "offline", description: "Send memes only." },
//   { id: "u4", name: "Leader-nim", avatar: "🧠", status: "online", description: "Boss mode." },
// ];

// const INITIAL_CHATS = [
//   { id: "c1", peerId: "u1", messages: [{ id: "m1", from: "me", text: "✨", ts: Date.now() }] },
//   { id: "c2", peerId: "u2", messages: [] },
// ];

// export default function Chat() {
//   const user = useAppStore((s) => s.user);
//   const navigate = useNavigate();

//   // State
//   const [chats, setChats] = useState(INITIAL_CHATS);
//   const [savedMessages, setSavedMessages] = useState([]);
//   const [activeId, setActiveId] = useState("saved-messages");
//   const [previewChat, setPreviewChat] = useState(null);
//   const [search, setSearch] = useState("");
//   const [profileUser, setProfileUser] = useState(null);
//   const [showPicker, setShowPicker] = useState(false);

//   // Layout state
//   const isTabletUp = useMediaQuery("(min-width: 768px)");
//   const [fullChat, setFullChat] = useState(false);
//   const [mobileMode, setMobileMode] = useState("list");

//   // Load saved messages from Dexie
//   useEffect(() => {
//     if (!user?._id) return;

//     (async () => {
//       try {
//         const saved = await inxdb.messages
//           .where('roomId')
//           .equals('saved-messages')
//           .and(msg => msg.senderId === user._id)
//           .sortBy('sentTime');

//         if (saved && saved.length > 0) {
//           const formattedMessages = saved.map(msg => ({
//             id: msg._id,
//             from: "me",
//             text: msg.text,
//             file: msg.file,
//             ts: msg.sentTime
//           }));
//           setSavedMessages(formattedMessages);
//           console.log("📌 Loaded", saved.length, "saved messages");
//         }
//       } catch (err) {
//         console.log("📌 No saved messages found", err);
//       }
//     })();
//   }, [user?._id]);

//   // Saved Messages chat object
//   const SAVED_MESSAGES_CHAT = useMemo(() => ({
//     id: "saved-messages",
//     peerId: "self",
//     isSavedMessages: true,
//     messages: savedMessages
//   }), [savedMessages]);

//   // Active chat (includes preview)
//   const activeChat = useMemo(() => {
//     if (activeId === "saved-messages") return SAVED_MESSAGES_CHAT;
//     if (previewChat && previewChat.id === activeId) return previewChat;
//     return chats.find(c => c.id === activeId) || null;
//   }, [chats, activeId, SAVED_MESSAGES_CHAT, previewChat]);

//   const filteredChats = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     const nameOf = (peerId) => USERS.find(u => u.id === peerId)?.name || "";
//     return q ? chats.filter(c => nameOf(c.peerId).toLowerCase().includes(q)) : chats;
//   }, [search, chats]);

//   const existingPeerIds = useMemo(() => new Set(chats.map(c => c.peerId)), [chats]);

//   // Actions
//   function pickChat(cid) {
//     setActiveId(cid);
//     if (!isTabletUp) setMobileMode("chat");
//   }

//   const goToProfile = () => navigate('/profile');

//   const cancelPreview = () => {
//     setPreviewChat(null);
//     setActiveId("saved-messages");
//   };

//   async function sendMessage(text, file = null) {
//     if (!text || !text.trim()) return;

//     // 1) Saved messages
//     if (activeId === "saved-messages") {
//       const timestamp = Date.now();
//       const messageId = `sm_${user._id}_${timestamp}`;

//       const newMessage = {
//         id: messageId,
//         from: "me",
//         text,
//         file: file || null,
//         ts: timestamp
//       };

//       setSavedMessages(prev => [...prev, newMessage]);

//       try {
//         await inxdb.messages.add({
//           _id: messageId,
//           senderId: user._id,
//           receiverId: user._id,
//           roomId: "saved-messages",
//           text: text || "",
//           file: file || null,
//           sentTime: timestamp,
//           receivedTime: timestamp
//         });
//         console.log("📌 Saved message to Dexie");
//       } catch (err) {
//         console.error("❌ Failed to save:", err);
//       }
//       return;
//     }

//     // 2) Preview chat -> convert to real chat
//     if (activeId && activeId.startsWith("preview_") && previewChat) {
//       const preview = previewChat;
//       const newChatId = "c" + Date.now();

//       const persistedChat = {
//         id: newChatId,
//         peerId: preview.peerId,
//         messages: []
//       };

//       try {
//         const chatListEntry = {
//           _id: String(newChatId),
//           participants: [String(user?._id || ""), String(preview.peerId)],
//           lastMessage: "",
//           lastupdated: Date.now()
//         };
//         await insertData(inxdb, "chatListidx", chatListEntry);
//       } catch (err) {
//         console.warn("Could not persist chatList:", err);
//       }

//       setChats(prev => [persistedChat, ...prev]);
//       setPreviewChat(null);
//       setActiveId(newChatId);

//       const timestamp = Date.now();
//       const messageObj = {
//         id: "m" + timestamp,
//         from: "me",
//         text,
//         file: file || null,
//         ts: timestamp
//       };

//       setChats(prev => prev.map(c => 
//         c.id === newChatId 
//           ? { ...c, messages: [...c.messages, messageObj] } 
//           : c
//       ));

//       try {
//         await inxdb.messages.add({
//           _id: messageObj.id,
//           senderId: user._id,
//           receiverId: preview.peerId,
//           roomId: newChatId,
//           text: text || "",
//           file: file || null,
//           sentTime: timestamp,
//           receivedTime: timestamp
//         });
//       } catch (err) {
//         console.warn("Failed to persist message:", err);
//       }

//       return;
//     }

//     // 3) Regular chat
//     setChats(prev => prev.map(c => c.id === activeId
//       ? {
//           ...c,
//           messages: [...c.messages, {
//             id: "m" + Date.now(),
//             from: "me",
//             text,
//             file: file || null,
//             ts: Date.now()
//           }]
//         }
//       : c));
//   }

//   async function startChatWithUser(selectedUser) {
//     const item = selectedUser?.item || selectedUser;
    
//     if (!item || !item._id) {
//       console.warn("startChatWithUser: invalid user", selectedUser);
//       return;
//     }

//     // Check if already in chats
//     const existing = chats.find(c => 
//       c.peerId === String(item._id) || 
//       c.peerId === item.id
//     );
    
//     if (existing) {
//       pickChat(existing.id);
//       return;
//     }

//     // Create preview chat
//     const previewId = `preview_${Date.now()}`;
//     const preview = {
//       id: previewId,
//       peerId: String(item._id),
//       isPreview: true,
//       messages: [],
//       _userMeta: item
//     };

//     setPreviewChat(preview);
//     setActiveId(previewId);

//     // Cache user in Dexie
//     try {
//       const userRecord = {
//         _id: String(item._id),
//         username: item.username || "Unknown",
//         picture: item.avatar || null,
//         bio: item.bio || "",
//         lastSeen: null,
//       };
      
//       const existingUser = await inxdb.users.get(String(item._id));
//       if (!existingUser) {
//         await insertData(inxdb, "users", userRecord);
//       }
//     } catch (err) {
//       console.debug("Could not cache user:", err);
//     }

//     // Add to USERS array for display
//     const tempUser = {
//       id: String(item._id),
//       name: item.username,
//       avatar: item.avatar || "👤",
//       status: "offline",
//       description: item.bio || ""
//     };
    
//     if (!USERS.find(u => u.id === tempUser.id)) {
//       USERS.push(tempUser);
//     }
//   }

//   // Avatar Button
//   const AvatarButton = () => (
//     <button onClick={goToProfile} className="group relative flex-shrink-0" title="Go to Profile">
//       <img
//         src={user?.avatarUrl || "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg"}
//         alt="Your profile"
//         className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full border-2 border-black object-cover shadow-[2px_2px_0_rgba(0,0,0,0.25)] transition-all group-hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] group-hover:-translate-y-0.5"
//       />
//       <span className="absolute bottom-0 right-0 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 rounded-full border-2 border-white bg-green-400" />
//     </button>
//   );

//   // App Title
//   const AppTitle = () => (
//     <div className="flex items-center justify-between rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] mb-4 px-4 py-3 lg:px-6">
//       <div className="font-extrabold text-base sm:text-lg md:text-xl pl-14 lg:pl-0">RetroChat OS</div>
//       <AvatarButton />
//     </div>
//   );

//   return (
//     <div className="min-h-screen w-full px-4 py-6">
//       <div className={`mx-auto w-full ${isTabletUp ? (fullChat ? "max-w-[1000px]" : "max-w-[1200px]") : "max-w-[640px]"}`}>
//         <AppTitle />

//         {/* DESKTOP/TABLET */}
//         {isTabletUp ? (
//           fullChat ? (
//             <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden h-[78vh] min-h-0">
//               <ChatWindow
//                 users={activeChat?.isSavedMessages ? [{ id: 'self', name: user?.name || 'You', avatar: '📌', status: 'online' }] : USERS}
//                 chat={activeChat}
//                 onSend={sendMessage}
//                 onToggleFull={() => setFullChat(false)}
//                 isFullScreen={true}
//                 isSavedMessages={activeChat?.isSavedMessages}
//                 isPreview={activeChat?.isPreview}
//                 onCancelPreview={cancelPreview}
//               />
//             </div>
//           ) : (
//             <div className="grid gap-4" style={{ gridTemplateColumns: "320px minmax(400px, 1fr)" }}>
//               <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] p-3 min-w-0 min-h-[7vh]">
//                 <ChatList
//                   users={USERS}
//                   chats={filteredChats}
//                   activeId={activeId}
//                   search={search}
//                   onSearch={setSearch}
//                   onOpenProfile={setProfileUser}
//                   onPickChat={pickChat}
//                   onNewChatClick={() => setShowPicker(true)}
//                 />
//               </div>

//               <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden min-w-0 h-[78vh] min-h-0">
//                 <ChatWindow
//                   users={activeChat?.isSavedMessages ? [{ id: 'self', name: user?.name || 'You', avatar: '📌', status: 'online' }] : USERS}
//                   chat={activeChat}
//                   onSend={sendMessage}
//                   onToggleFull={() => setFullChat(true)}
//                   isFullScreen={false}
//                   isSavedMessages={activeChat?.isSavedMessages}
//                   isPreview={activeChat?.isPreview}
//                   onCancelPreview={cancelPreview}
//                 />
//               </div>
//             </div>
//           )
//         ) : (
//           // MOBILE
//           mobileMode === "list" ? (
//             <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] p-3 min-h-[72vh]">
//               <ChatList
//                 users={USERS}
//                 chats={filteredChats}
//                 activeId={activeId}
//                 search={search}
//                 onSearch={setSearch}
//                 onOpenProfile={setProfileUser}
//                 onPickChat={pickChat}
//                 onNewChatClick={() => setShowPicker(true)}
//               />
//             </div>
//           ) : (
//             <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden h-[78vh] min-h-0">
//               <ChatWindow
//                 users={activeChat?.isSavedMessages ? [{ id: 'self', name: user?.name || 'You', avatar: '📌', status: 'online' }] : USERS}
//                 chat={activeChat}
//                 onSend={sendMessage}
//                 onBack={() => setMobileMode("list")}
//                 isFullScreen={false}
//                 isSavedMessages={activeChat?.isSavedMessages}
//                 isPreview={activeChat?.isPreview}
//                 onCancelPreview={cancelPreview}
//               />
//             </div>
//           )
//         )}
//       </div>

//       {/* Modals */}
//       <ProfileModal
//         open={!!profileUser}
//         onClose={() => setProfileUser(null)}
//         user={profileUser}
//       />
//       <ContactsPicker
//         open={showPicker}
//         onClose={() => setShowPicker(false)}
//         users={USERS}
//         existingPeerIds={existingPeerIds}
//         onPick={(u) => { startChatWithUser(u); setShowPicker(false); }}
//       />
//     </div>
//   );
// }



// src/pages/Chat.jsx
import { useState, useMemo, useEffect } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import ProfileModal from "../../components/ProfileModal";
import ContactsPicker from "../../components/ContactsPicker";
import inxdb from "../../db/dexieDbs/index";
import { useAppStore } from "../../store/appStore.js";
import { useSocketStore } from "../../store/useSocketStore.js";


const USERS = [
    { id: "u1", name: "Retro Designers", avatar: "🎨", status: "online", description: "Design gang." },
    { id: "u2", name: "Build Buddies", avatar: "🛠️", status: "away", description: "Builders unite." },
    { id: "u3", name: "Meme Dept.", avatar: "😂", status: "offline", description: "Send memes only." },
    { id: "u4", name: "Leader-nim", avatar: "🧠", status: "online", description: "Boss mode." },
];

export default function Chat() {
    const user = useAppStore((s) => s.user);
    const accessToken = useAppStore((s) => s.accessToken);
    
    // 🔥 Get socket from Zustand store
    const { socket, isConnected, joinRoom, sendMessage: socketSendMessage, on, off } = useSocketStore();

    // Saved Messages
    const SAVED_MESSAGES_CHAT = {
        id: "saved_messages",
        peerId: "self",
        isSaved: true,
        messages: []
    };

    // State
    const [chats, setChats] = useState([SAVED_MESSAGES_CHAT]);
    const [savedMessages, setSavedMessages] = useState([]);
    const [activeId, setActiveId] = useState("saved_messages");
    const [search, setSearch] = useState("");
    const [profileUser, setProfileUser] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [showProfilePage, setShowProfilePage] = useState(false);
    const [previewChat, setPreviewChat] = useState(null);

    // Layout state
    const isTabletUp = useMediaQuery("(min-width: 768px)");
    const [fullChat, setFullChat] = useState(false);
    const [mobileMode, setMobileMode] = useState("list");

    // ============================================
    // 1. LISTEN FOR INCOMING MESSAGES
    // ============================================
    useEffect(() => {
        if (!socket) return;

        function handleNewMessage(data) {
            console.log('📨 New message received:', data);
            
            // Update chat messages
            setChats(prev => prev.map(chat => 
                chat.id === data.roomId
                    ? {
                        ...chat,
                        messages: [...chat.messages, {
                            id: data.messageId,
                            from: data.senderId === user._id ? 'me' : 'them',
                            text: data.text,
                            file: data.file || null,
                            ts: data.timestamp
                        }]
                    }
                    : chat
            ));

            // Save to IndexedDB
            if (data.roomId !== 'saved_messages') {
                inxdb.messages.add({
                    _id: data.messageId,
                    senderId: data.senderId,
                    roomId: data.roomId,
                    text: data.text || "",
                    file: data.file || null,
                    sentTime: data.timestamp,
                }).catch(err => console.warn('IndexedDB save error:', err));
            }
        }

        on('newMessage', handleNewMessage);

        return () => {
            off('newMessage', handleNewMessage);
        };
    }, [socket, user?._id, on, off]);

    // ============================================
    // 2. LOAD USER'S ROOMS ON MOUNT
    // ============================================
    useEffect(() => {
        if (!user?._id || !accessToken) return;

        async function loadUserRooms() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/user/${user._id}`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });

                if (!response.ok) throw new Error('Failed to load rooms');

                const { rooms } = await response.json();

                const transformedChats = rooms.map(room => ({
                    id: room._id,
                    peerId: room.participants.find(p => p !== user._id),
                    messages: [],
                    unreadCount: room.unreadCount || 0,
                    isPinned: room.isPinned || false,
                    isMuted: room.isMuted || false,
                    lastMessage: room.lastMessage || null
                }));

                setChats(prev => [SAVED_MESSAGES_CHAT, ...transformedChats]);

            } catch (error) {
                console.error('Failed to load rooms:', error);
            }
        }

        loadUserRooms();
    }, [user?._id, accessToken]);

    // ============================================
    // 3. LOAD SAVED MESSAGES
    // ============================================
    useEffect(() => {
        if (!user?._id) return;

        async function loadSavedMessages() {
            try {
                const messages = await inxdb.messages
                    .where('roomId')
                    .equals('saved_messages')
                    .toArray();

                const formatted = messages.map(msg => ({
                    id: msg._id,
                    from: 'me',
                    text: msg.text,
                    file: msg.file || null,
                    ts: msg.sentTime
                }));

                setSavedMessages(formatted);
            } catch (err) {
                console.error('Failed to load saved messages:', err);
            }
        }

        loadSavedMessages();
    }, [user?._id]);

    // ============================================
    // 4. DERIVED VALUES
    // ============================================
    const activeChat = useMemo(() => {
        if (activeId === "saved_messages") {
            return { ...SAVED_MESSAGES_CHAT, messages: savedMessages };
        }
        if (activeId?.startsWith("preview_")) {
            return previewChat;
        }
        return chats.find(c => c.id === activeId) || null;
    }, [chats, activeId, savedMessages, previewChat]);

    const filteredChats = useMemo(() => {
        const q = search.trim().toLowerCase();
        const nameOf = (peerId) => {
            if (peerId === "self") return "Saved Messages";
            return USERS.find(u => u.id === peerId)?.name || "";
        };
        return q ? chats.filter(c => nameOf(c.peerId).toLowerCase().includes(q)) : chats;
    }, [search, chats]);

    const existingPeerIds = useMemo(() => new Set(chats.map(c => c.peerId)), [chats]);

    // ============================================
    // 5. ACTIONS
    // ============================================
    function pickChat(cid) {
        setActiveId(cid);
        if (!isTabletUp) setMobileMode("chat");

        if (cid !== "saved_messages" && !cid.startsWith("preview_")) {
            loadChatHistory(cid);
            
            // 🔥 Join Socket.IO room using Zustand action
            if (isConnected) {
                joinRoom(cid, user._id);
            }
        }
    }

    async function loadChatHistory(roomId) {
        const chat = chats.find(c => c.id === roomId);
        if (chat && chat.messages.length > 0) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/rooms/${roomId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!response.ok) throw new Error('Failed to load messages');

            const { messages } = await response.json();

            const formatted = messages.map(msg => ({
                id: msg._id,
                from: msg.senderId === user._id ? 'me' : 'them',
                text: msg.text,
                file: msg.file || null,
                ts: msg.sentTime
            }));

            setChats(prev => prev.map(c => 
                c.id === roomId ? { ...c, messages: formatted } : c
            ));

        } catch (err) {
            console.error('Failed to load chat history:', err);
        }
    }

    async function startChatWithUser(selectedUser) {
  console.log("📞 Starting chat with:", selectedUser);

  // Check if chat already exists
  const existing = chats.find(c => c.peerId === selectedUser._id || c.peerId === selectedUser.id);
  if (existing) {
    console.log("✅ Chat already exists:", existing.id);
    pickChat(existing.id);
    setShowPicker(false);
    return;
  }

  // 🔥 Create preview chat with FULL user data
  const previewId = `preview_${selectedUser._id || selectedUser.id}`;
  const preview = {
    id: previewId,
    peerId: selectedUser._id || selectedUser.id,
    messages: [],
    isPreview: true,
    // 🔥 IMPORTANT: Store user data for ChatWindow to display
    userData: {
      _id: selectedUser._id,
      username: selectedUser.username,
      avatar: selectedUser.avatar,
      bio: selectedUser.bio,
      email: selectedUser.email,
      status: "online" // Default status
    }
  };

  console.log("👁️ Created preview chat:", preview);

  setPreviewChat(preview);
  setActiveId(previewId);
  setShowPicker(false);
  if (!isTabletUp) setMobileMode("chat");
}

    // ============================================
    // 6. CREATE ROOM (called from MessageInput)
    // ============================================
    async function createRoomForPreview(peerId) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    participants: [user._id, peerId]
                })
            });

            if (!response.ok) throw new Error('Failed to create room');

            const { roomId, isNew } = await response.json();
            console.log(`✅ Room ${isNew ? 'created' : 'found'}:`, roomId);

            // Create real chat
            const realChat = {
                id: roomId,
                peerId: peerId,
                messages: []
            };

            setChats(prev => [realChat, ...prev.filter(c => !c.id.startsWith("preview_"))]);
            setPreviewChat(null);
            setActiveId(roomId);

            // 🔥 Join Socket.IO room using Zustand action
            if (isConnected) {
                joinRoom(roomId, user._id);
            }

            return roomId;

        } catch (error) {
            console.error('Failed to create room:', error);
            throw error;
        }
    }

    // ============================================
    // 7. PROFILE PAGE (same as before)
    // ============================================
    const ProfilePage = () => (
        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] p-6 min-h-[78vh]">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => {
                        setShowProfilePage(false);
                        if (!isTabletUp) setMobileMode("list");
                    }}
                    className="px-4 py-2 rounded-xl border-2 border-black bg-yellow-300 hover:bg-yellow-400 active:shadow-none shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-all font-bold"
                >
                    ← Back
                </button>
                <h2 className="text-2xl font-extrabold">My Profile</h2>
                <div className="w-20"></div>
            </div>

            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.25)] overflow-hidden bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center">
                        {user?.avatar || user?.picture ? (
                            <img src={user.avatar || user.picture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl font-bold text-white">
                                {user?.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                        )}
                    </div>
                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-extrabold">{user?.username || "User"}</h3>
                    <p className="text-gray-600">{user?.email || "user@example.com"}</p>
                    {user?.bio && <p className="text-sm text-gray-500 max-w-md">{user.bio}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-6">
                    <div className="rounded-2xl border-2 border-black bg-blue-200 p-4 text-center shadow-[4px_4px_0_rgba(0,0,0,0.25)]">
                        <div className="text-2xl font-bold">{chats.length - 1}</div>
                        <div className="text-sm font-semibold">Chats</div>
                    </div>
                    <div className="rounded-2xl border-2 border-black bg-pink-200 p-4 text-center shadow-[4px_4px_0_rgba(0,0,0,0.25)]">
                        <div className="text-2xl font-bold">
                            {chats.reduce((acc, c) => acc + c.messages.length, 0)}
                        </div>
                        <div className="text-sm font-semibold">Messages</div>
                    </div>
                    <div className="rounded-2xl border-2 border-black bg-green-200 p-4 text-center shadow-[4px_4px_0_rgba(0,0,0,0.25)]">
                        <div className="text-2xl font-bold">
                            {isConnected ? 'Online' : 'Offline'}
                        </div>
                        <div className="text-sm font-semibold">Status</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const AppHeader = () => (
        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] mb-3 px-4 py-2">
            <div className="flex items-center justify-between">
                <div className="font-extrabold text-lg">RetroChat OS</div>
                
                <button
                    onClick={() => {
                        setShowProfilePage(true);
                        if (!isTabletUp) setMobileMode("profile");
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-black bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 active:shadow-none shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-all group"
                >
                    <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-white flex items-center justify-center relative">
                        {user?.avatar || user?.picture ? (
                            <img src={user.avatar || user.picture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm font-bold">
                                {user?.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                        )}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    
                    <span className="font-bold text-sm hidden sm:inline group-hover:underline">
                        {user?.username || "User"}
                    </span>
                </button>
            </div>
        </div>
    );

    // ============================================
    // 8. RENDER (same as before)
    // ============================================
    if (showProfilePage && (!isTabletUp || mobileMode === "profile")) {
        return (
            <div className="min-h-screen w-full px-4 py-6">
                <div className={`mx-auto w-full ${isTabletUp ? "max-w-[800px]" : "max-w-[640px]"}`}>
                    <AppHeader />
                    <ProfilePage />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full px-4 py-6">
            <div className={`mx-auto w-full ${isTabletUp ? (fullChat ? "max-w-[1000px]" : "max-w-[1200px]") : "max-w-[640px]"}`}>
                <AppHeader />

                {isTabletUp ? (
                    fullChat ? (
                        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden h-[75vh]">
                            <ChatWindow
                                users={USERS}
                                chat={activeChat}
                                onCreateRoom={createRoomForPreview}
                                setSavedMessages={setSavedMessages}
                                setChats={setChats}
                                onToggleFull={() => setFullChat(false)}
                                isFullScreen={true}
                                currentUser={user}
                            />
                        </div>
                    ) : (
                        <div className="grid gap-4" style={{ gridTemplateColumns: "320px minmax(400px, 1fr)" }}>
                            <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] p-3 min-w-0 h-[75vh]">
                                <ChatList
                                    users={USERS}
                                    chats={filteredChats}
                                    activeId={activeId}
                                    search={search}
                                    onSearch={setSearch}
                                    onOpenProfile={setProfileUser}
                                    onPickChat={pickChat}
                                    onNewChatClick={() => setShowPicker(true)}
                                    currentUser={user}
                                />
                            </div>

                            <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden min-w-0">
                                <ChatWindow
                                    users={USERS}
                                    chat={activeChat}
                                    onCreateRoom={createRoomForPreview}
                                    setSavedMessages={setSavedMessages}
                                    setChats={setChats}
                                    onToggleFull={() => setFullChat(true)}
                                    isFullScreen={false}
                                    currentUser={user}
                                />
                            </div>
                        </div>
                    )
                ) : (
                    mobileMode === "list" ? (
                        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] p-3 min-h-[75vh]">
                            <ChatList
                                users={USERS}
                                chats={filteredChats}
                                activeId={activeId}
                                search={search}
                                onSearch={setSearch}
                                onOpenProfile={setProfileUser}
                                onPickChat={pickChat}
                                onNewChatClick={() => setShowPicker(true)}
                                currentUser={user}
                            />
                        </div>
                    ) : (
                        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden h-[75vh]">
                            <ChatWindow
                                users={USERS}
                                chat={activeChat}
                                onCreateRoom={createRoomForPreview}
                                setSavedMessages={setSavedMessages}
                                setChats={setChats}
                                onBack={() => setMobileMode("list")}
                                isFullScreen={false}
                                currentUser={user}
                            />
                        </div>
                    )
                )}
            </div>

            <ProfileModal open={!!profileUser} onClose={() => setProfileUser(null)} user={profileUser} />
            <ContactsPicker
                open={showPicker}
                onClose={() => setShowPicker(false)}
                users={USERS}
                existingPeerIds={existingPeerIds}
                onPick={(u) => { startChatWithUser(u); }}
            />
        </div>
    );
}
