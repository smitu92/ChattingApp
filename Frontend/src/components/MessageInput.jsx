// import { useEffect, useRef, useState } from "react";

// export default function MessageInput({ onSend }) {
//   const [text, setText] = useState("");
//   const taRef = useRef(null);

//   // auto-grow up to 6 lines
//   useEffect(() => {
//     const ta = taRef.current;
//     if (!ta) return;
//     ta.style.height = "0px";
//     const next = Math.min(ta.scrollHeight, 160); // ~6 lines cap
//     ta.style.height = next + "px";
//   }, [text]);

//   const canSend = text.trim().length > 0;

//   function handleSubmit(e) {
//     e.preventDefault();
//     if (!canSend) return;
//     onSend(text);
//     setText("");
//   }

//   function onKey(e) {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (canSend) handleSubmit(e);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}
//       className="px-3 py-3 flex items-end gap-2 border-t-2 border-black bg-white">
//       <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">😊</button>
//       <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">📎</button>

//       <textarea
//         ref={taRef}
//         rows={1}
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         onKeyDown={onKey}
//         placeholder="Type a message…"
//         className="flex-1 min-h-[42px] max-h-40 resize-none rounded-2xl border-2 border-black px-3 py-2 outline-none"
//       />

//       <button
//         type="submit"
//         disabled={!canSend}
//         className={`px-4 py-2 rounded-2xl border-2 border-black ${
//           canSend ? "bg-[#a9e2b2]" : "bg-gray-200 cursor-not-allowed"
//         }`}
//       >
//         ➤ Send
//       </button>
//     </form>
//   );
// }

// MessageInput.jsx
// import { forwardRef, useEffect, useRef, useState } from "react";

// const MessageInput = forwardRef(function MessageInput({ onSend }, ref) {
//   const [text, setText] = useState("");
//   const taRef = useRef(null);
//   const rootRef = useRef(null);

//   // expose DOM ref if parent passes one
//   useEffect(() => {
//     if (!ref) return;
//     if (typeof ref === "function") ref(rootRef.current);
//     else ref.current = rootRef.current;
//   }, [ref]);

//   // auto-grow textarea up to ~6 lines
//   useEffect(() => {
//     const ta = taRef.current;
//     if (!ta) return;
//     ta.style.height = "0px";
//     const next = Math.min(ta.scrollHeight, 160); // cap height ~160px
//     ta.style.height = next + "px";
//   }, [text]);

//   const canSend = text.trim().length > 0;

//   function handleSubmit(e) {
//     e?.preventDefault();
//     if (!canSend) return;
//     onSend(text.trim());
//     setText("");
//   }

//   function onKey(e) {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (canSend) handleSubmit();
//     }
//   }

//   return (
//     // sticky + bottom uses CSS variable set by parent: --safe-bottom (env(safe-area-inset-bottom))
//     <form
//       ref={rootRef}
//       onSubmit={handleSubmit}
//       className="px-3 py-3 flex items-end gap-2 border-t-2 border-black bg-white"
//       style={{
//         position: "sticky",
//         bottom: "calc(var(--safe-bottom, 0px))", // sits above safe area
//         zIndex: 10,
//       }}
//     >
//       <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">😊</button>
//       <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">📎</button>

//       <textarea
//         ref={taRef}
//         rows={1}
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         onKeyDown={onKey}
//         placeholder="Type a message…"
//         className="flex-1 min-h-[42px] max-h-40 resize-none rounded-2xl border-2 border-black px-3 py-2 outline-none"
//       />

//       <button
//         type="submit"
//         disabled={!canSend}
//         className={`px-4 py-2 rounded-2xl border-2 border-black ${
//           canSend ? "bg-[#a9e2b2]" : "bg-gray-200 cursor-not-allowed"
//         }`}
//       >
//         ➤ Send
//       </button>
//     </form>
//   );
// });

// export default MessageInput;



// src/components/MessageInput.jsx - COMPLETE FINAL VERSION
import { forwardRef, useEffect, useRef, useState } from "react";

import { useAppStore } from "../store/appStore";
import inxdb from "../db/dexieDbs/index";
import { useSocketStore } from "../store/useSocketStore";

const MessageInput = forwardRef(function MessageInput({ 
  chat,
  currentUser,
  onCreateRoom,
  setSavedMessages,
  setChats
}, ref) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const taRef = useRef(null);
  const rootRef = useRef(null);
  const fileInputRef = useRef(null);

  const { isConnected, sendMessage: socketSendMessage } = useSocketStore();
  const accessToken = useAppStore((s) => s.accessToken);

  // Expose DOM ref if parent passed one
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(rootRef.current);
    else ref.current = rootRef.current;
  }, [ref]);

  // Auto-grow textarea (cap at 160px)
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    const next = Math.min(ta.scrollHeight, 160);
    ta.style.height = next + "px";
  }, [text]);

  const canSend = text.trim().length > 0 || file !== null;

  // ============================================
  // MAIN SEND HANDLER
  // ============================================
  async function handleSubmit(e) {
    e?.preventDefault();
    if (!canSend || isSending) return;

    const messageText = text.trim();
    const timestamp = Date.now();

    // A) SAVED MESSAGES
    if (chat.id === "saved_messages" || chat.isSaved) {
      const messageId = `sm_${currentUser._id}_${timestamp}`;
      const newMessage = {
        id: messageId,
        from: "me",
        text: messageText,
        file: file || null,
        ts: timestamp
      };

      setSavedMessages(prev => [...prev, newMessage]);

      // Save to IndexedDB
      try {
        await inxdb.messages.add({
          _id: messageId,
          senderId: currentUser._id,
          receiverId: currentUser._id,
          roomId: "saved_messages",
          text: messageText || "",
          file: file || null,
          sentTime: timestamp,
        });
        console.log("📌 Saved message to IndexedDB");
      } catch (err) {
        console.error("❌ Failed to save to IndexedDB:", err);
      }

      // Clear input
      setText("");
      setFile(null);
      return;
    }

    // B) PREVIEW CHAT - CREATE ROOM FIRST
    if (chat.isPreview || chat.id?.startsWith("preview_")) {
      setIsSending(true);
      try {
        console.log("🔨 Creating room for preview chat...");
        
        // Call API to create room
        const roomId = await onCreateRoom(chat.peerId);
        
        if (!roomId) {
          throw new Error("Failed to create room");
        }

        console.log("✅ Room created:", roomId);

        // Create message object
        const messageObj = {
          id: `temp_${timestamp}`,
          from: "me",
          text: messageText,
          file: file || null,
          ts: timestamp
        };

        // Update local state
        setChats(prev => prev.map(c => 
          c.id === roomId 
            ? { ...c, messages: [messageObj] }
            : c
        ));

        // Send via Socket.IO
        if (isConnected) {
          socketSendMessage({
            roomId: roomId,
            senderId: currentUser._id,
            receiverId: chat.peerId,
            text: messageText,
            file: file || null,
            timestamp: timestamp
          });
          console.log("📤 Message sent via Socket.IO");
        } else {
          console.warn("⚠️ Socket not connected, message queued locally");
        }

        // Save to IndexedDB
        try {
          await inxdb.messages.add({
            _id: messageObj.id,
            senderId: currentUser._id,
            receiverId: chat.peerId,
            roomId: roomId,
            text: messageText || "",
            file: file || null,
            sentTime: timestamp,
          });
        } catch (err) {
          console.warn("IndexedDB save error:", err);
        }

        // Clear input
        setText("");
        setFile(null);

      } catch (error) {
        console.error("❌ Failed to send first message:", error);
        alert("Failed to send message. Please try again.");
      } finally {
        setIsSending(false);
      }
      return;
    }

    // C) EXISTING ROOM - Regular message send
    setIsSending(true);
    try {
      const messageObj = {
        id: `temp_${timestamp}`,
        from: "me",
        text: messageText,
        file: file || null,
        ts: timestamp
      };

      // Update local state immediately (optimistic update)
      setChats(prev => prev.map(c => 
        c.id === chat.id 
          ? { ...c, messages: [...c.messages, messageObj] }
          : c
      ));

      // Send via Socket.IO
      if (isConnected) {
        socketSendMessage({
          roomId: chat.id,
          senderId: currentUser._id,
          receiverId: chat.peerId,
          text: messageText,
          file: file || null,
          timestamp: timestamp
        });
        console.log("📤 Message sent via Socket.IO");
      } else {
        console.warn("⚠️ Socket not connected, message queued locally");
      }

      // Save to IndexedDB
      try {
        await inxdb.messages.add({
          _id: messageObj.id,
          senderId: currentUser._id,
          receiverId: chat.peerId,
          roomId: chat.id,
          text: messageText || "",
          file: file || null,
          sentTime: timestamp,
        });
      } catch (err) {
        console.warn("IndexedDB save error:", err);
      }

      // Clear input
      setText("");
      setFile(null);

    } catch (error) {
      console.error("❌ Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend && !isSending) handleSubmit();
    }
  }

  function handleFileSelect(e) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <form
      ref={rootRef}
      onSubmit={handleSubmit}
      className="px-3 py-3 flex flex-col gap-2 border-t-2 border-black bg-white"
      style={{ position: "sticky", bottom: "calc(var(--safe-bottom, 0px))", zIndex: 10 }}
    >
      {/* File Preview */}
      {file && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-black bg-gray-50">
          <span className="text-sm">📎 {file.name}</span>
          <button
            type="button"
            onClick={removeFile}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ✖
          </button>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2">
        <button 
          type="button" 
          className="px-3 py-2 rounded-2xl border-2 border-black bg-white hover:bg-gray-100 transition-colors"
          title="Emoji (coming soon)"
        >
          😊
        </button>
        
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 rounded-2xl border-2 border-black bg-white hover:bg-gray-100 transition-colors"
          title="Attach file"
        >
          📎
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />

        <textarea
          ref={taRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type a message…"
          className="flex-1 min-h-[42px] max-h-40 resize-none rounded-2xl border-2 border-black px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
          disabled={isSending}
        />

        <button 
          type="submit"
          disabled={!canSend || isSending}
          className={`px-4 py-2 rounded-2xl border-2 border-black transition-colors ${
            canSend && !isSending
              ? "bg-[#a9e2b2] hover:bg-[#8fd699]" 
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          {isSending ? "..." : "➤ Send"}
        </button>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="text-xs text-yellow-600 px-3">
          ⚠️ Offline - messages will be sent when connection is restored
        </div>
      )}
    </form>
  );
});

export default MessageInput;
