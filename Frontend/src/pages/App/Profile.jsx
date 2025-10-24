// import React, { useState, useEffect, useRef, createContext, useContext } from "react";
// import { createPortal } from "react-dom";
// import useAppStore from "../../store/appStore.js";


// /**
//  * Responsive, accessible Profile page
//  * - Mobile‑first, no fixed page widths
//  * - Grid layout that adapts at md+
//  * - Avatar editor with preview modal (via React Portal)
//  * - Page‑scoped context to avoid prop drilling
//  */

// // -------------------- Context (page‑scoped) --------------------
// const ProfileContext = createContext(null);
//  function useProfile() {
//   const ctx = useContext(ProfileContext);
//   if (!ctx) throw new Error("useProfile must be used within <ProfileProvider>");
//   return ctx;
// }

// function ProfileProvider({ children }) {
//     const user=useAppStore((state)=>state.user);
//     console.log("delhi");
    
//   const [profile, setProfile] = useState({
//     name: user?.name ||"Smit Patel", 
//     username:user?.username ||"smit",
//     email:user?.email || "smit20@gmail.com",
//     bio: "Web dev • MERN • Learning system design",
//     avatarUrl:
//       "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg",
//   });

//   // 🔥 sync when Zustand's user updates
//   useEffect(() => {
//     if (user) {
//       console.log(user);
//       setProfile((prev) => ({
//         ...prev,
//         name: user.name ?? prev.name,
//         username: user.username ?? prev.username,
//         email: user.email ?? prev.email,
//       }));
//     }
//   }, [user]);
//   const value = { profile, setProfile };
//   return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
// }

// // -------------------- Simple Portal Modal --------------------
// function Modal({ open, onClose, title = "Dialog", children }) {
//   if (!open) return null;
//   return createPortal(
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         className="absolute inset-0 bg-black/40"
//         onClick={onClose}
//         aria-hidden="true"
//       />
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-label={title}
//         className="relative w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
//       >
//         {children}
//       </div>
//     </div>,
//     document.body
//   );
// }

// // -------------------- Avatar (editable) --------------------
// function EditableAvatar() {
//   const { profile, setProfile } = useProfile();
//   const inputRef = useRef(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [open, setOpen] = useState(false);

//   const onPick = () => inputRef.current?.click();

//   const onFileChange = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     const url = URL.createObjectURL(f);
//     setPreviewUrl(url);
//     setOpen(true);
//   };

//   // Revoke object URL to avoid memory leaks
//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   const confirm = () => {
//     if (previewUrl) setProfile((p) => ({ ...p, avatarUrl: previewUrl }));
//     setOpen(false);
//     setPreviewUrl(null);
//   };
 
 
//   return (
//     <div className="flex flex-col items-center gap-3">
//       <img
//         src={profile.avatarUrl}
//         alt={`${profile.name} avatar`}
//         className="size-32 md:size-40 rounded-full object-cover"
//       />
//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/*"
//         onChange={onFileChange}
//         className="hidden"
//       />
//       <button
//         onClick={onPick}
//         className="rounded-xl border px-3 py-1.5 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/30"
//       >
//         Change picture
//       </button>

//       <Modal open={open} onClose={() => setOpen(false)} title="Preview new avatar">
//         <div className="space-y-4">
//           <div className="flex items-center justify-center">
//             {previewUrl ? (
//               <img
//                 src={previewUrl}
//                 alt="Preview"
//                 className="size-40 rounded-full object-cover"
//               />
//             ) : (
//               <div className="size-40 animate-pulse rounded-full bg-gray-200" />
//             )}
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 setPreviewUrl(null);
//               }}
//               className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={confirm}
//               className="rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
//             >
//               Confirm
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// // -------------------- Profile header & fields --------------------
// function ProfileHeader() {
//   const { profile } = useProfile();
//   return (
//     <header className="grid grid-cols-1 items-center gap-6 md:grid-cols-[160px,1fr]">
//       <EditableAvatar />
//       <div className="min-w-0 space-y-1">
//         <h1 className="truncate text-2xl font-semibold md:text-3xl">{profile.name}</h1>
//         <p className="text-sm text-gray-600">@{profile.username}</p>
//         <a
//           href={`mailto:${profile.email}`}
//           className="inline-block truncate text-sm text-blue-600 underline-offset-2 hover:underline"
//         >
//           {profile.email}
//         </a>
//       </div>
//     </header>
//   );
// }

// function BioCard() {
//   const { profile, setProfile } = useProfile();
//   const [editing, setEditing] = useState(false);
//   const [draft, setDraft] = useState(profile.bio);

//   useEffect(() => setDraft(profile.bio), [profile.bio]);

//   return (
//     <section className="rounded-2xl border bg-white p-4 shadow-sm">
//       <div className="flex items-center justify-between">
//         <h2 className="text-base font-semibold">Bio</h2>
//         {!editing ? (
//           <button
//             onClick={() => setEditing(true)}
//             className="rounded-lg border px-2.5 py-1 text-xs hover:bg-gray-50"
//           >
//             Edit
//           </button>
//         ) : (
//           <div className="space-x-2">
//             <button
//               onClick={() => {
//                 setProfile((p) => ({ ...p, bio: draft.trim() }));
//                 setEditing(false);
//               }}
//               className="rounded-lg bg-black px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => {
//                 setDraft(profile.bio);
//                 setEditing(false);
//               }}
//               className="rounded-lg border px-2.5 py-1 text-xs hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>

//       {!editing ? (
//         <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{profile.bio}</p>
//       ) : (
//         <textarea
//           value={draft}
//           onChange={(e) => setDraft(e.target.value)}
//           rows={4}
//           className="mt-2 w-full resize-y rounded-xl border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
//           placeholder="Write a short bio..."
//         />
//       )}
//     </section>
//   );
// }

// function DetailsList() {
//     const { profile } = useProfile();
//   const items = [
//     { label: "Full name", value: profile.name },
//     { label: "Username", value: `@${profile.username}` },
//     { label: "Email", value: profile.email },
//   ];
//   return (
//     <section className="rounded-2xl border bg-white p-4 shadow-sm">
//       <h2 className="mb-3 text-base font-semibold">Details</h2>
//       <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
//         {items.map((it) => (
//           <div key={it.label} className="rounded-xl border p-3">
//             <dt className="text-xs text-gray-500">{it.label}</dt>
//             <dd className="truncate text-sm font-medium">{it.value}</dd>
//           </div>
//         ))}
//       </dl>
//     </section>
//   );
// }

// // -------------------- Page --------------------
// export default function ProfilePage() {
//     const user=useAppStore((state)=>state.user);
//     console.log(user);
//     console.log("Profile render start:", user);
//     console.count("Profile render");

//   return (
//     <ProfileProvider>
//       <main className="container mx-auto max-w-3xl px-4 py-8">
//         <div className="space-y-6">
//           <ProfileHeader />
//           <BioCard />
//           <DetailsList />
//         </div>
//       </main>
//     </ProfileProvider>
//   );
// }









import React, { useState, useEffect, useRef } from "react";
import useAppStore from "../../store/appStore.js";

export default function ProfilePage() {
  const user = useAppStore((s) => s.user);
  console.log("ProfilePage user from store:", user);

  if (!user) return <div className="p-6 text-gray-600">Loading profile...</div>;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="space-y-6">
        <ProfileHeader user={user} />
        <BioCard user={user} />
        <DetailsList user={user} />
      </div>
    </main>
  );
}

function ProfileHeader({ user }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [open, setOpen] = useState(false);

  const onPick = () => inputRef.current?.click();
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setOpen(true);
  };

  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const confirm = async () => {
    const updated = { ...user, avatarUrl: previewUrl };
    useAppStore.setState({ user: updated });
    setOpen(false);
    setPreviewUrl(null);
  };

  return (
    <header className="grid grid-cols-1 items-center gap-6 md:grid-cols-[160px,1fr]">
      <div className="flex flex-col items-center gap-3">
        <img
          src={
            user.avatarUrl ||
            "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg"
          }
          alt={`${user.name} avatar`}
          className="size-32 md:size-40 rounded-full object-cover"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
        <button
          onClick={onPick}
          className="rounded-xl border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
        >
          Change picture
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="size-40 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-40 animate-pulse rounded-full bg-gray-200" />
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setPreviewUrl(null);
                    }}
                    className="rounded-xl border px-3 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirm}
                    className="rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-1">
        <h1 className="truncate text-2xl font-semibold md:text-3xl">
          {user.name || "User"}
        </h1>
        <p className="text-sm text-gray-600">@{user.username || "username"}</p>
        <a
          href={`mailto:${user.email}`}
          className="inline-block truncate text-sm text-blue-600 underline-offset-2 hover:underline"
        >
          {user.email}
        </a>
      </div>
    </header>
  );
}

function BioCard({ user }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user.bio || "Web dev • MERN • Learning system design");

  useEffect(() => setDraft(user.bio || ""), [user.bio]);

  const save = () => {
    const updated = { ...user, bio: draft.trim() };
    useAppStore.setState({ user: updated });
    setEditing(false);
  };

  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Bio</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border px-2.5 py-1 text-xs hover:bg-gray-50"
          >
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={save}
              className="rounded-lg bg-black px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg border px-2.5 py-1 text-xs hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
          {user.bio || "No bio yet"}
        </p>
      ) : (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          className="mt-2 w-full resize-y rounded-xl border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Write a short bio..."
        />
      )}
    </section>
  );
}

function DetailsList({ user }) {
  const items = [
    { label: "Full name", value: user.name || "User" },
    { label: "Username", value: `@${user.username || "username"}` },
    { label: "Email", value: user.email || "example@email.com" },
  ];

  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold">Details</h2>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl border p-3">
            <dt className="text-xs text-gray-500">{it.label}</dt>
            <dd className="truncate text-sm font-medium">{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
