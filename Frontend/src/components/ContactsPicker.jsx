import { useEffect } from "react";
import { useState, useMemo } from "react";
import SearchUsernames from "../../services/main/SearchUsername";

export default function ContactsPicker({ open, onClose, users, existingPeerIds, onPick }) {
  const [q, setQ] = useState("");
  const [filtered,setfiltered]=useState("")
  // always run hooks, even if open=false
//   const availableContacts = useMemo(() => {
//     return users.filter(u => !existingPeerIds.has(u.id));
//   }, [users, existingPeerIds]);
   

//   const filtered = useMemo(() => {
//     const t = q.trim().toLowerCase();
//     if (!t) return availableContacts;
//     return availableContacts.filter(
//       u =>
//         u.name.toLowerCase().includes(t) ||
//         (u.status && u.status.toLowerCase().includes(t))
//     );
//   }, [q, availableContacts]);

  // then return nothing if closed

      useEffect(()=>{
            (async () => {
               const timeout=setTimeout(async () => {
                const r=await SearchUsernames(q);
                console.log("error for search from useEffect",r);
                if (r.ok) {
                    setfiltered(r.usernames);
                }
                    
                }, 900);
               return ()=>clearTimeout(timeout)

            })()
      },[q])
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center">
      <div className="w-[92%] max-w-[520px] rounded-3xl border-2 border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-3 border-b-2 border-black bg-[#fbc88c] flex items-center justify-between">
          <div className="font-extrabold">Start a new chat</div>
          <button onClick={onClose} className="px-3 py-1 rounded-xl border-2 border-black bg-white">✖</button>
        </div>

        {/* Search */}
        <div className="p-3 border-b-2 border-black">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search contacts…"
            className="w-full rounded-2xl border-2 border-black px-3 py-2 outline-none"
          />
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {filtered.map(u => (
            <button
              key={u.id}
              onClick={() => onPick(u)}
              className="w-full flex items-center gap-3 p-3 mb-2 rounded-2xl border-2 border-black bg-white hover:brightness-105 text-left"
            >
              <div className="w-12 h-12 grid place-items-center text-2xl rounded-2xl border-2 border-black bg-white">{u.avatar}</div>
              <div className="min-w-0">
                <div className="font-bold truncate">{u?.item?.username}</div>
                <div className="text-xs opacity-70">{u.status}</div>
              </div>
            </button>
          ))}
          {!filtered.length && (
            <div className="text-center py-8 text-sm opacity-70">
              {q ? "No contacts found." : "Everyone’s already in your chat list."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

