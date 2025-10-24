import { useEffect, useRef, useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const taRef = useRef(null);

  // auto-grow up to 6 lines
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    const next = Math.min(ta.scrollHeight, 160); // ~6 lines cap
    ta.style.height = next + "px";
  }, [text]);

  const canSend = text.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSend) return;
    onSend(text);
    setText("");
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit}
      className="px-3 py-3 flex items-end gap-2 border-t-2 border-black bg-white">
      <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">😊</button>
      <button type="button" className="px-3 py-2 rounded-2xl border-2 border-black bg-white">📎</button>

      <textarea
        ref={taRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder="Type a message…"
        className="flex-1 min-h-[42px] max-h-40 resize-none rounded-2xl border-2 border-black px-3 py-2 outline-none"
      />

      <button
        type="submit"
        disabled={!canSend}
        className={`px-4 py-2 rounded-2xl border-2 border-black ${
          canSend ? "bg-[#a9e2b2]" : "bg-gray-200 cursor-not-allowed"
        }`}
      >
        ➤ Send
      </button>
    </form>
  );
}
