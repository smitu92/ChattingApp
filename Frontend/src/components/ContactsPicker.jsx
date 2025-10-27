// import { useEffect } from "react";
// import { useState, useMemo } from "react";
// import SearchUsernames from "../../services/main/SearchUsername";

// export default function ContactsPicker({ open, onClose, users, existingPeerIds, onPick }) {
//   const [q, setQ] = useState("");
//   const [filtered,setfiltered]=useState(null)

//       useEffect(()=>{
//             (async () => {
//                const timeout=setTimeout(async () => {
//                 const r=await SearchUsernames(q);
//                 // const {data}=r;
//                 // console.log(r);
//                 console.log(r.data);
//                 const finalList=r.data.map((obj)=>obj.item);
//                 console.log(finalList);
//                 if (r.ok) {
//                     setfiltered(finalList || null || [{}]);
//                     return;
//                 }
//                 console.log("error for search from useEffect",r);

                    
//                 }, 0);
//                return ()=>clearTimeout(timeout)

//             })()
//       },[q])
//   if (!open) return null;
//   if (!filtered) {
//      return (
//       <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
//         <div className="text-center space-y-4">
//           <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
//           <div className="text-xl font-bold">Loading RetroChat OS...</div>
//           <div className="text-sm text-gray-600">Syncing your data</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center">
//       <div className="w-[92%] max-w-[520px] rounded-3xl border-2 border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,0.25)] overflow-hidden">
        
//         {/* Header */}
//         <div className="px-4 py-3 border-b-2 border-black bg-[#fbc88c] flex items-center justify-between">
//           <div className="font-extrabold">Start a new chat</div>
//           <button onClick={onClose} className="px-3 py-1 rounded-xl border-2 border-black bg-white">✖</button>
//         </div>

//         {/* Search */}
//         <div className="p-3 border-b-2 border-black">
//           <input
//             value={q}
//             onChange={e => setQ(e.target.value)}
//             placeholder="Search contacts…"
//             className="w-full rounded-2xl border-2 border-black px-3 py-2 outline-none"
//           />
//         </div>

//         {/* Results */}
//         <div className="max-h-[60vh] overflow-y-auto p-3">
//           {filtered?.map(u => {
//             return(
//             <button
//               key={u.id}
//               onClick={() => onPick(u)}
//               className="w-full flex items-center gap-3 p-3 mb-2 rounded-2xl border-2 border-black bg-white hover:brightness-105 text-left"
//             >
//               <div className="w-12 h-12 grid place-items-center text-2xl rounded-2xl border-2 border-black bg-white"><img src={u?.avatar} alt={u?.username} /></div>
//               <div className="min-w-0">
//                 <div className="font-bold truncate">{u?.username}</div>
//                 {/* <div className="text-xs opacity-70">{u.status}</div> */}
//               </div>
//             </button>
//           )})}
//           {!filtered?.length && (
//             <div className="text-center py-8 text-sm opacity-70">
//               {q ? "No contacts found." : "Everyone’s already in your chat list."}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// components/ContactsPicker.jsx - COMPLETE FINAL VERSION
// components/ContactsPicker.jsx - FIXED VERSION
import { useEffect, useState } from "react";
import SearchUsernames from "../../services/main/SearchUsername";

export default function ContactsPicker({ open, onClose, users, existingPeerIds, onPick }) {
  const [q, setQ] = useState("");
  const [filtered, setFiltered] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const r = await SearchUsernames(q);
        console.log("Search results:", r.data);
        
        const finalList = r.data.map((obj) => obj.item);
        
        if (r.ok) {
          setFiltered(finalList || []);
        } else {
          console.log("Error searching:", r);
          setFiltered([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [q, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="w-full max-w-[520px] rounded-3xl border-2 border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-3 border-b-2 border-black bg-[#fbc88c] flex items-center justify-between">
          <div className="font-extrabold">Start a new chat</div>
          <button 
            onClick={onClose} 
            className="px-3 py-1 rounded-xl border-2 border-black bg-white hover:bg-red-100 transition-colors"
          >
            ✖
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b-2 border-black">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search contacts..."
            className="w-full rounded-2xl border-2 border-black px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-black border-r-transparent" />
              <p className="mt-2 text-sm text-gray-600">Searching...</p>
            </div>
          ) : filtered && filtered.length > 0 ? (
            filtered.map((u) => (
              <button
                key={u._id || u.id}
                onClick={() => {
                  // 🔥 FIX: Pass the full user object with proper structure
                  onPick({
                    _id: u._id,
                    id: u._id, // For compatibility
                    username: u.username,
                    avatar: u.avatar,
                    bio: u.bio,
                    email: u.email,
                    // Include any other fields ChatWindow needs
                  });
                }}
                className="w-full flex items-center gap-3 p-3 mb-2 rounded-2xl border-2 border-black bg-white hover:bg-yellow-100 hover:shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-all text-left"
              >
                <div className="w-12 h-12 flex-shrink-0 grid place-items-center text-2xl rounded-2xl border-2 border-black bg-white overflow-hidden">
                  {u?.avatar ? (
                    <img 
                      src={u.avatar} 
                      alt={u?.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{u?.username || u?.name || 'Unknown'}</div>
                  {u?.bio && (
                    <div className="text-xs opacity-70 truncate">{u.bio}</div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-sm opacity-70">
              {q ? "No contacts found." : "Type to search..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
