// WhatsApp-style list with stable height + empty state
export default function ChatList({
  users,
  chats,
  activeId,
  search,
  onSearch,
  onOpenProfile,   // (user) => void
  onPickChat,      // (chatId) => void
  onNewChatClick,  // () => void
}) {
  const lookup = (peerId) => users.find(u => u.id === peerId);

  function Row({ chat }) {
    const u = lookup(chat.peerId);
    const last = chat.messages[chat.messages.length - 1];
    const base =
      `w-full flex items-center gap-3 p-3 rounded-2xl border-2 mb-2 border-black hover:brightness-105 text-left ` +
      (chat.id === activeId ? "bg-[#fdf3e6]" : "bg-white");

    return (
      <div
        role="button" tabIndex={0}
        onClick={() => onPickChat(chat.id)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onPickChat(chat.id); }}
        className={base}
      >
        <button
          type="button"
          onClick={(e)=>{ e.stopPropagation(); onOpenProfile(u); }}
          className="w-12 h-12 min-w-12 grid place-items-center text-2xl rounded-2xl border-2 border-black bg-white"
          title="View profile"
        >
          {u?.avatar}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-bold truncate">{u?.name} </div>
            <div className="ml-auto text-xs opacity-70">
              {last ? new Date(last.ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ""}
            </div>
          </div>
          <div className="text-xs opacity-80 truncate">{last?.text || "Say hi 👋"}</div>
        </div>
      </div>
    );
  }

  function EmptyState() {
    return (
      <div className="h-full w-full grid place-items-center p-6">
        <div className="text-center">
          <div className="text-sm opacity-70 mb-3">No chats yet</div>
          <button
            onClick={onNewChatClick}
            className="px-4 py-2 rounded-2xl border-2 border-black bg-white hover:brightness-105"
          >
            + Start a new chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* top bar */}
      <div className="rounded-2xl border-2 border-black bg-white p-3 flex items-center justify-between shadow-[6px_6px_0_rgba(0,0,0,0.25)]">
        <div className="font-extrabold">Chats</div>
        <button onClick={onNewChatClick} className="px-3 py-1 rounded-xl border-2 border-black bg-white">+ New</button>
      </div>

      {/* search */}
      <div className="rounded-2xl border-2 border-black bg-white px-3 py-2 flex items-center gap-2">
        <span className="text-xl">🔍</span>
        <input
          value={search}
          onChange={(e)=>onSearch(e.target.value)}
          placeholder="Search messages"
          className="w-full bg-transparent outline-none"
        />
      </div>

      {/* list panel — fixed min-height per breakpoint, scroll when long */}
      <div
        className="
          rounded-2xl border-2 border-black bg-white p-1 overflow-y-auto
          min-h-[56vh] md:min-h-[60vh] lg:min-h-[64vh]
          max-h-[72vh]
        "
      >
        {chats.length ? chats.map((c) => <Row key={c.id} chat={c} />) : <EmptyState />}
      </div>
    </div>
  );
}

