import { useEffect, useMemo, useRef, useState } from "react";

export default function ChatWindow({
  users,
  chat,
  onSend,
  onBack,          // mobile: back to list
  onToggleFull,    // desktop: split/full toggle
  isFullScreen,    // boolean
}) {
  const scroller = useRef(null);
  const [text, setText] = useState("");
  const peer = useMemo(() => (chat ? users.find(u => u.id === chat.peerId) : null), [chat, users]);
  const msgCount = chat?.messages?.length || 0;
  console.log(msgCount);
console.log(chat,users);
  // scroll only when chat changes or new messages arrive
  useEffect(() => {
    if (!scroller.current) return;
    scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [chat?.id, msgCount]);

  if (!chat) return <div className="p-8">Pick a chat to start messaging.</div>;

  return (
    // full width on small screens; never too narrow on desktop
    <div className="flex flex-col w-full md:min-w-[560px]">
      {/* Header */}
      <div className="px-3 py-2 border-b-2 border-black bg-white flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1 rounded-xl border-2 border-black bg-white md:hidden"
            aria-label="Back"
          >
            ←
          </button>
        )}
        <div className="w-9 h-9 grid place-items-center rounded-xl border-2 border-black bg-white text-lg" title={peer?.name}>
          {peer?.avatar}
        </div>
        <div className="font-bold">{peer?.name}</div>

        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1 rounded-xl border-2 border-black bg-white">📞</button>
          <button className="px-3 py-1 rounded-xl border-2 border-black bg-white">📹</button>

          {/* Split/Full toggle is INSIDE the app (chat header) */}
          {onToggleFull && (
            <button
              onClick={onToggleFull}
              className="px-3 py-1 rounded-xl border-2 border-black bg-white hidden md:inline"
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
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-[#fdf3e6] min-h-[42vh] md:min-h-[52vh]"
      >
        {chat.messages.length === 0 ? (
          <div className="h-full w-full grid place-items-center opacity-70">
            <div className="text-sm">No messages yet. Say hi 👋</div>
          </div>
        ) : (
          chat.messages.map((m) => (
            <div key={m.id} className={`mb-3 flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[72%] px-4 py-2 rounded-2xl border-2 border-black ${
                  m.from === "me" ? "bg-[#a9e2b2]" : "bg-white"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                <div className="text-[10px] opacity-70 mt-1">
                  {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          onSend(text);
          setText("");
        }}
        className="px-3 py-3 flex items-center gap-2 border-t-2 border-black bg-white"
      >
        <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">😊</button>
        <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">📎</button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-2xl border-2 border-black px-3 py-2 outline-none"
        />
        <button type="submit" className="px-4 py-2 rounded-2xl border-2 border-black bg-[#a9e2b2]">➤ Send</button>
      </form>
    </div>
  );
}
