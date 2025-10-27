// import { useEffect, useMemo, useRef, useState } from "react";

// export default function ChatWindow({
//   users,
//   chat,
//   onSend,
//   onBack,          // mobile: back to list
//   onToggleFull,    // desktop: split/full toggle
//   isFullScreen,    // boolean
// }) {
//   const scroller = useRef(null);
//   const [text, setText] = useState("");
//   const peer = useMemo(() => (chat ? users.find(u => u.id === chat.peerId) : null), [chat, users]);
//   const msgCount = chat?.messages?.length || 0;
//   console.log(msgCount);
// console.log(chat,users);
//   // scroll only when chat changes or new messages arrive
//   useEffect(() => {
//     if (!scroller.current) return;
//     scroller.current.scrollTop = scroller.current.scrollHeight;
//   }, [chat?.id, msgCount]);

//   if (!chat) return <div className="p-8">Pick a chat to start messaging.</div>;

//   return (
//     // full width on small screens; never too narrow on desktop
//     <div className="flex flex-col w-full md:min-w-[560px]">
//       {/* Header */}
//       <div className="px-3 py-2 border-b-2 border-black bg-white flex items-center gap-2">
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="px-3 py-1 rounded-xl border-2 border-black bg-white md:hidden"
//             aria-label="Back"
//           >
//             ←
//           </button>
//         )}
//         <div className="w-9 h-9 grid place-items-center rounded-xl border-2 border-black bg-white text-lg" title={peer?.name}>
//           {peer?.avatar}
//         </div>
//         <div className="font-bold">{peer?.name}</div>

//         <div className="ml-auto flex items-center gap-2">
//           <button className="px-3 py-1 rounded-xl border-2 border-black bg-white">📞</button>
//           <button className="px-3 py-1 rounded-xl border-2 border-black bg-white">📹</button>

//           {/* Split/Full toggle is INSIDE the app (chat header) */}
//           {onToggleFull && (
//             <button
//               onClick={onToggleFull}
//               className="px-3 py-1 rounded-xl border-2 border-black bg-white hidden md:inline"
//               title={isFullScreen ? "Switch to split view" : "Go full width"}
//             >
//               {isFullScreen ? "🗗 Split" : "🗖 Full"}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Messages */}
//       <div
//         ref={scroller}
//         className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-[#fdf3e6] min-h-[42vh] md:min-h-[52vh]"
//       >
//         {chat.messages.length === 0 ? (
//           <div className="h-full w-full grid place-items-center opacity-70">
//             <div className="text-sm">No messages yet. Say hi 👋</div>
//           </div>
//         ) : (
//           chat.messages.map((m) => (
//             <div key={m.id} className={`mb-3 flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`max-w-[72%] px-4 py-2 rounded-2xl border-2 border-black ${
//                   m.from === "me" ? "bg-[#a9e2b2]" : "bg-white"
//                 }`}
//               >
//                 <div className="whitespace-pre-wrap break-words">{m.text}</div>
//                 <div className="text-[10px] opacity-70 mt-1">
//                   {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Composer */}
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (!text.trim()) return;
//           onSend(text);
//           setText("");
//         }}
//         className="px-3 py-3 flex items-center gap-2 border-t-2 border-black bg-white"
//       >
//         <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">😊</button>
//         <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">📎</button>
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message…"
//           className="flex-1 rounded-2xl border-2 border-black px-3 py-2 outline-none"
//         />
//         <button type="submit" className="px-4 py-2 rounded-2xl border-2 border-black bg-[#a9e2b2]">➤ Send</button>
//       </form>
//     </div>
//   );
// }




// ChatWindow.jsx
// import { useEffect, useMemo, useRef, useState } from "react";
// import MessageInput from "./MessageInput";

// export default function ChatWindow({
//   users,
//   chat,
//   onSend,
//   onBack,          // mobile: back to list
//   onToggleFull,    // desktop: split/full toggle
//   isFullScreen,    // boolean
// }) {
//   const scroller = useRef(null);
//   const composerRef = useRef(null);
//   const [text, setText] = useState("");
//   const peer = useMemo(
//     () => (chat ? users.find((u) => u.id === chat.peerId) : null),
//     [chat, users]
//   );
//   const msgCount = chat?.messages?.length || 0;

//   // scroll to bottom when chat or messages change
//   useEffect(() => {
//     if (!scroller.current) return;
//     // small timeout to ensure layout updated (textarea resize etc.)
//     requestAnimationFrame(() => {
//       scroller.current.scrollTop = scroller.current.scrollHeight;
//     });
//   }, [chat?.id, msgCount]);

//   // keep scroller padded so composer never covers messages.
//   useEffect(() => {
//     const sc = scroller.current;
//     if (!sc) return;

//     // returns composer height + safe-bottom inset (in px)
//     const computePadding = () => {
//       const composerEl = composerRef.current;
//       if (!composerEl) return 0;
//       const composerRect = composerEl.getBoundingClientRect();
//       // CSS variable --safe-bottom is set on the root (see style on root below)
//       const rootStyles = getComputedStyle(document.documentElement);
//       const safeBottom = parseFloat(rootStyles.getPropertyValue("--safe-bottom")) || 0;
//       return Math.ceil(composerRect.height + safeBottom + 8); // +8px breathing room
//     };

//     const applyPadding = () => {
//       sc.style.paddingBottom = computePadding() + "px";
//     };

//     applyPadding();

//     // Watch for composer size changes
//     let ro;
//     try {
//       ro = new ResizeObserver(applyPadding);
//       if (composerRef.current) ro.observe(composerRef.current);
//     } catch (e) {
//       // ResizeObserver unsupported — fallback to window resize
//       console.log(e);
//       window.addEventListener("resize", applyPadding);
//     }

//     // visualViewport helps detect on-screen keyboard changes
//     const vv = window.visualViewport;
//     const onVV = () => {
//       // small delay for layout to settle
//       setTimeout(() => applyPadding(), 50);
//     };
//     if (vv) vv.addEventListener("resize", onVV);

//     return () => {
//       if (ro && composerRef.current) ro.unobserve(composerRef.current);
//       if (!ro) window.removeEventListener("resize", applyPadding);
//       if (vv) vv.removeEventListener("resize", onVV);
//     };
//   }, [composerRef, text]); // re-run when text changes (textarea height may change)

//   if (!chat) return <div className="p-8">Pick a chat to start messaging.</div>;

//   return (
//     // ensure CSS var (--safe-bottom) resolves to env(safe-area-inset-bottom)
//     // parent should have fixed height (eg h-[78vh]); ChatWindow uses h-full
//     <div className="flex flex-col w-full md:min-w-[560px] h-full" style={{ "--safe-bottom": "env(safe-area-inset-bottom)" }}>
//       {/* Header */}
//       <div className="px-3 py-2 border-b-2 border-black bg-white flex items-center gap-2">
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="px-3 py-1 rounded-xl border-2 border-black bg-white md:hidden"
//             aria-label="Back"
//           >
//             ←
//           </button>
//         )}

//         <div
//           className="w-9 h-9 grid place-items-center rounded-xl border-2 border-black bg-white text-lg"
//           title={peer?.name}
//         >
//           {peer?.avatar}
//         </div>
//         <div className="font-bold truncate">{peer?.name}</div>

//         <div className="ml-auto flex items-center gap-2">
//           <button className="px-3 py-1 rounded-xl border-2 border-black bg-white">📞</button>
//           <button className="px-3 py-1 rounded-xl border-2 border-black bg-white">📹</button>

//           {onToggleFull && (
//             <button
//               onClick={onToggleFull}
//               className="px-3 py-1 rounded-xl border-2 border-black bg-white hidden md:inline"
//               title={isFullScreen ? "Switch to split view" : "Go full width"}
//             >
//               {isFullScreen ? "🗗 Split" : "🗖 Full"}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Messages */}
//       <div
//         ref={scroller}
//         className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-[#fdf3e6] min-h-[42vh] md:min-h-[52vh]"
//       >
//         {chat.messages.length === 0 ? (
//           <div className="h-full w-full grid place-items-center opacity-70">
//             <div className="text-sm">No messages yet. Say hi 👋</div>
//           </div>
//         ) : (
//           chat.messages.map((m) => (
//             <div key={m.id} className={`mb-3 flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`max-w-[72%] px-4 py-2 rounded-2xl border-2 border-black ${
//                   m.from === "me" ? "bg-[#a9e2b2]" : "bg-white"
//                 }`}
//               >
//                 <div className="whitespace-pre-wrap break-words">{m.text}</div>
//                 <div className="text-[10px] opacity-70 mt-1">
//                   {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Composer (sticky bottom, measured by parent via composerRef) */}
//       <div ref={composerRef}>
//         <MessageInput
//           onSend={(val) => {
//             onSend(val);
//             setText(""); // keep local state in sync (MessageInput manages own state)
//           }}
//         />
//       </div>
//     </div>
//   );
// }




// components/ChatWindow.jsx - COMPLETE FINAL VERSION
// src/components/ChatWindow.jsx - COMPLETE FINAL VERSION
import { useEffect, useRef, useMemo } from "react";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  users,
  chat,
  onCreateRoom,
  setSavedMessages,
  setChats,
  onBack,
  onToggleFull,
  isFullScreen,
  currentUser
}) {
  const scroller = useRef(null);
  const composerRef = useRef(null);

  // Determine if this is saved messages or preview
  const isSavedMessages = chat?.id === "saved_messages" || chat?.isSaved;
  const isPreview = chat?.isPreview || chat?.id?.startsWith("preview_");

  // Get peer user info
  const peer = useMemo(() => {
    if (!chat) return null;

    // Saved Messages
    if (isSavedMessages) {
      return {
        name: "Saved Messages",
        avatar: "📌",
        status: "online",
        description: "Messages saved for later"
      };
    }

    // Preview Chat - use stored userData
    if (isPreview && chat.userData) {
      return {
        name: chat.userData.username || "Unknown",
        avatar: chat.userData.avatar || "👤",
        status: chat.userData.status || "online",
        description: chat.userData.bio || ""
      };
    }

    // Regular chat - lookup from users array
    return users.find(u => u.id === chat.peerId) || {
      name: "Unknown User",
      avatar: "👤",
      status: "offline"
    };
  }, [chat, users, isSavedMessages, isPreview]);

  const msgCount = chat?.messages?.length || 0;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!scroller.current) return;
    requestAnimationFrame(() => {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    });
  }, [chat?.id, msgCount]);

  // Dynamic padding for message list (accounts for input height)
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;

    const computePadding = () => {
      const composerEl = composerRef.current;
      if (!composerEl) return 0;
      const composerRect = composerEl.getBoundingClientRect();
      const rootStyles = getComputedStyle(document.documentElement);
      const safeBottom = parseFloat(rootStyles.getPropertyValue("--safe-bottom")) || 0;
      return Math.ceil(composerRect.height + safeBottom + 8);
    };

    const applyPadding = () => {
      sc.style.paddingBottom = computePadding() + "px";
    };

    applyPadding();

    let ro;
    try {
      ro = new ResizeObserver(applyPadding);
      if (composerRef.current) ro.observe(composerRef.current);
    } catch (e) {
      window.addEventListener("resize", applyPadding);
    }

    const vv = window.visualViewport;
    const onVV = () => setTimeout(() => applyPadding(), 50);
    if (vv) vv.addEventListener("resize", onVV);

    return () => {
      if (ro && composerRef.current) ro.unobserve(composerRef.current);
      if (!ro) window.removeEventListener("resize", applyPadding);
      if (vv) vv.removeEventListener("resize", onVV);
    };
  }, [composerRef]);

  // Empty state - no chat selected
  if (!chat) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gray-600">Pick a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col w-full min-w-0 h-full min-h-0" 
      style={{ "--safe-bottom": "env(safe-area-inset-bottom)" }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b-2 border-black bg-white flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1 rounded-xl border-2 border-black bg-white hover:bg-gray-100 transition-colors"
            aria-label="Back"
            title="Back to list"
          >
            ←
          </button>
        )}

        <div
          className="w-9 h-9 grid place-items-center rounded-xl border-2 border-black bg-white text-lg overflow-hidden flex-shrink-0"
          title={peer?.name}
        >
          {peer?.avatar && typeof peer.avatar === 'string' && peer.avatar.startsWith('http') ? (
            <img src={peer.avatar} alt={peer?.name} className="w-full h-full object-cover" />
          ) : (
            <span>{peer?.avatar || '👤'}</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-bold truncate">{peer?.name || 'Unknown'}</div>
          {isPreview && (
            <div className="text-xs text-gray-500">Preview - send a message to start chat</div>
          )}
          {!isPreview && !isSavedMessages && peer?.status && (
            <div className="text-xs text-gray-500">{peer.status}</div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {!isPreview && !isSavedMessages && (
            <>
              <button 
                className="px-3 py-1 rounded-xl border-2 border-black bg-white hover:bg-gray-100 transition-colors"
                title="Voice call"
              >
                📞
              </button>
              <button 
                className="px-3 py-1 rounded-xl border-2 border-black bg-white hover:bg-gray-100 transition-colors"
                title="Video call"
              >
                📹
              </button>
            </>
          )}

          {onToggleFull && !isPreview && (
            <button
              onClick={onToggleFull}
              className="px-3 py-1 rounded-xl border-2 border-black bg-white hover:bg-gray-100 transition-colors hidden md:inline"
              title={isFullScreen ? "Switch to split view" : "Go full width"}
            >
              {isFullScreen ? "🗗 Split" : "🗖 Full"}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scroller} 
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 bg-[#fdf3e6]"
      >
        {(!chat.messages || chat.messages.length === 0) ? (
          <div className="h-full w-full grid place-items-center opacity-70">
            <div className="text-center">
              <div className="text-4xl mb-2">{isSavedMessages ? '📌' : '👋'}</div>
              <div className="text-sm">
                {isSavedMessages 
                  ? "Your personal space for notes and reminders" 
                  : isPreview
                    ? "Send a message to start the conversation"
                    : "No messages yet. Say hi!"}
              </div>
            </div>
          </div>
        ) : (
          chat.messages.map((m) => (
            <div 
              key={m.id} 
              className={`mb-3 flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[72%] px-4 py-2 rounded-2xl border-2 border-black ${
                  m.from === "me" ? "bg-[#a9e2b2]" : "bg-white"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                {m.file && (
                  <div className="mt-2 text-xs opacity-70">
                    📎 {m.file.name || 'Attachment'}
                  </div>
                )}
                <div className="text-[10px] opacity-70 mt-1">
                  {new Date(m.ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div ref={composerRef}>
        <MessageInput
          chat={chat}
          currentUser={currentUser}
          onCreateRoom={onCreateRoom}
          setSavedMessages={setSavedMessages}
          setChats={setChats}
        />
      </div>
    </div>
  );
}
