// components/ChatList.jsx - COMPLETE FIXED VERSION
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

export default function ChatList({
  users,
  chats,
  activeId,
  search,
  onSearch,
  onOpenProfile,
  onPickChat,
  onNewChatClick,
}) {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const lookup = (peerId) => users.find(u => u.id === peerId);

  const goToProfile = () => {
    navigate('/profile');
  };

  // Saved Messages Row
  function SavedMessagesRow() {
    const isActive = activeId === "saved-messages";
    const base =
      `w-full flex items-center gap-3 p-3 rounded-2xl border-2 mb-2 border-black hover:brightness-105 text-left transition-all ` +
      (isActive ? "bg-gradient-to-r from-purple-200 to-pink-200 shadow-[4px_4px_0_rgba(0,0,0,0.25)]" : "bg-white");

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onPickChat("saved-messages")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPickChat("saved-messages");
        }}
        className={base}
      >
        <div className="w-12 h-12 min-w-12 grid place-items-center text-2xl rounded-2xl border-2 border-black bg-gradient-to-br from-blue-400 to-purple-500 shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
          📌
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-bold truncate">Saved Messages</div>
          </div>
          <div className="text-xs opacity-80 truncate">Your personal space</div>
        </div>
      </div>
    );
  }

  // Regular Chat Row
  function Row({ chat }) {
    const u = lookup(chat.peerId);
    const last = chat.messages[chat.messages.length - 1];
    const isActive = chat.id === activeId;
    const base =
      `w-full flex items-center gap-3 p-3 rounded-2xl border-2 mb-2 border-black hover:brightness-105 text-left transition-all ` +
      (isActive ? "bg-[#fdf3e6] shadow-[4px_4px_0_rgba(0,0,0,0.25)]" : "bg-white");

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onPickChat(chat.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPickChat(chat.id);
        }}
        className={base}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile(u);
          }}
          className="w-12 h-12 min-w-12 grid place-items-center text-2xl rounded-2xl border-2 border-black bg-white transition-transform hover:scale-110 overflow-hidden"
          title="View profile"
        >
          {u?.avatar && typeof u.avatar === 'string' && u.avatar.startsWith('http') ? (
            <img src={u.avatar} alt={u?.name} className="w-full h-full object-cover" />
          ) : (
            <span>{u?.avatar || '👤'}</span>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-bold truncate">{u?.name} </div>
            <div className="ml-auto text-xs opacity-70">
              {last
                ? new Date(last.ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
          </div>
          <div className="text-xs opacity-80 truncate">
            {last?.text || "Say hi 👋"}
          </div>
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
    <div className="flex flex-col gap-3 min-w-0 h-full">
      {/* Top bar with Profile Button */}
      <div className="rounded-2xl border-2 border-black bg-white p-3 flex items-center justify-between shadow-[6px_6px_0_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-2">
          {/* Profile Avatar Button */}
          <button
            onClick={goToProfile}
            className="group relative flex-shrink-0"
            title="Go to Profile"
          >
            <img
              src={
                user?.avatarUrl ||
                "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg"
              }
              alt="Your profile"
              className="h-10 w-10 rounded-full border-2 border-black object-cover shadow-[2px_2px_0_rgba(0,0,0,0.25)] transition-all group-hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] group-hover:-translate-y-0.5"
            />
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400"></span>
          </button>

          <div className="font-extrabold">Chats</div>
        </div>

        <button
          onClick={onNewChatClick}
          className="px-3 py-1 rounded-xl border-2 border-black bg-white hover:bg-yellow-200 transition-colors"
        >
          + New
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border-2 border-black bg-white px-3 py-2 flex items-center gap-2">
        <span className="text-xl">🔍</span>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search messages"
          className="w-full bg-transparent outline-none"
        />
      </div>

      {/* List panel with Saved Messages at top */}
      <div className="rounded-2xl border-2 border-black bg-white p-1 overflow-y-auto min-h-[56vh] md:min-h-[60vh] lg:min-h-[64vh] max-h-[72vh]">
        {/* Always show Saved Messages first */}
        <SavedMessagesRow />
        
        {/* Regular chats */}
        {chats.length ? (
          chats.map((c) => <Row key={c.id} chat={c} />)
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}