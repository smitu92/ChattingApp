export default function ProfileModal({ open, onClose, user }) {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center">
      <div className="w-[92%] max-w-[420px] rounded-3xl border-2 border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="px-4 py-3 border-b-2 border-black bg-[#fbc88c] flex items-center justify-between">
          <div className="font-extrabold">Profile</div>
          <button onClick={onClose} className="px-3 py-1 rounded-xl border-2 border-black bg-white">✖</button>
        </div>

        <div className="p-5">
          <div className="w-20 h-20 rounded-2xl border-2 border-black bg-white grid place-items-center text-3xl mb-3">
            {user.avatar}
          </div>
          <div className="font-extrabold text-lg">{user.name}</div>
          <div className="text-sm opacity-70 mt-1">{user.status}</div>
          {user.description && <div className="text-sm mt-3">{user.description}</div>}
          <div className="mt-5 flex gap-2">
            <button className="px-4 py-2 rounded-2xl border-2 border-black bg-white">📞 Call</button>
            <button className="px-4 py-2 rounded-2xl border-2 border-black bg-white">📹 Video</button>
          </div>
        </div>
      </div>
    </div>
  );
}
