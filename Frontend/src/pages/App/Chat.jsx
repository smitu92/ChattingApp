import { useMemo, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import ProfileModal from "../../components/ProfileModal";
import ContactsPicker from "../../components/ContactsPicker";
import { useEffect } from "react";
import useAppStore from "../../store/appStore.js";
import RefreshTokenCall from "../../../services/Auth/RefreshTokenCall.js";
import { useNavigate } from "react-router-dom";
import reload from "../../../services/offline/controllers/atReload.js";
import { useRef } from "react";
import crateRoomId from "../../../services/main/creatRoomId.js";
import insertData from "../../../services/offline/controllers/add.js";
import inxdb from "../../db/dexieDbs/index.js";
import Dexie from "dexie";
import readData from "../../../services/offline/controllers/read.js";
import userIdx from "../../db/dexieDbs/userDB.js";


// --- demo users/chats (swap with your data) ---
const USERS = [
    { id: "u1", name: "Retro Designers", avatar: "🎨", status: "online", description: "Design gang." },
    { id: "u2", name: "Build Buddies", avatar: "🛠️", status: "away", description: "Builders unite." },
    { id: "u3", name: "Meme Dept.", avatar: "😂", status: "offline", description: "Send memes only." },
    { id: "u4", name: "Leader-nim", avatar: "🧠", status: "online", description: "Boss mode." },
];
const INITIAL_CHATS = [
    { id: "c1", peerId: "u1", messages: [{ id: "m1", from: "me", text: "✨", ts: Date.now() }] },
    { id: "c2", peerId: "u2", messages: [] },
];

export default function Chat() {
    // state
    const [chats, setChats] = useState(INITIAL_CHATS);
    const [activeId, setActiveId] = useState(chats[0]?.id);
    const [search, setSearch] = useState("");
    const [profileUser, setProfileUser] = useState(null);                 
    const [showPicker, setShowPicker] = useState(false);

    const nav = useNavigate();
    const userLoadedRef = useRef(false);

    //zustand
    const accesstoken = useAppStore((state) => state.accesstoken);
    const setAccessToken = useAppStore((state) => state.setAccessToken);
    const setUser = useAppStore((state) => state.setUser);
    const user = useAppStore((state) => state.user);



    // layout
    const isTabletUp = useMediaQuery("(min-width: 768px)");    // tablet breakpoint
    const [fullChat, setFullChat] = useState(false);           // tablet/desktop full-width chat
    const [mobileMode, setMobileMode] = useState("list");      // "list" | "chat"
    console.log("hello");

    // derived , this is for to show search people name from u haved alredy conv
    const activeChat = useMemo(() => chats.find(c => c.id === activeId) || null, [chats, activeId]);
    const filteredChats = useMemo(() => {
        const q = search.trim().toLowerCase();
        const nameOf = (peerId) => USERS.find(u => u.id === peerId)?.name || "";
        return q ? chats.filter(c => nameOf(c.peerId).toLowerCase().includes(q)) : chats;
    }, [search, chats]);
    const existingPeerIds = useMemo(() => new Set(chats.map(c => c.peerId)), [chats]);

    // actions
    function pickChat(cid) {
        setActiveId(cid);
        if (!isTabletUp) setMobileMode("chat");
    }
    function sendMessage(text) {
        setChats(prev => prev.map(c => c.id === activeId
            ? { ...c, messages: [...c.messages, { id: "m" + Date.now(), from: "me", text, ts: Date.now() }] }
            : c));
    }
    async function startChatWithUser(user) {
        const existing = chats.find(c => c.peerId === user.id);
        if (existing) { pickChat(existing.id); return; }
        console.log(user.item._id);
        const r=await crateRoomId(user.item);
        console.log(r);
        const db=inxdb;        
        const newmemberInchatList={
                _id: String(r.roomId._id),
                participants:r.roomId.participants,
                lastMessage:" ",
                lastupdated:" "
        };
        await insertData(db,"chatListidx",newmemberInchatList);
        const newuser={
            _id:String(user.item._id),
            username:user.item.username,
            picture:user.item?.avatar ? user.item?.avatar :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp8lMOE92n_uev3ytEoVbB9JT-ejulqmu4uA&s",
            bio:user.item?.bio,
            lastSeen:null,
        }
        const i=await insertData(db,"users",newuser);
        console.log("i",i);
        console.log(r.roomId);
        console.log(r);
        const id = "c" + Date.now();
        const next = { id, peerId: user.id, messages: [] };
        setChats(p => [next, ...p]);
        pickChat(id);
    }
    function PreviewSelUser() {
        
    }
    //   fetch accesstoken 
    useEffect(() => {
        let cancelled = false;
        (async () => {

            // 1) Ensure access token
            let token = accesstoken;
            if (!token) {
                const res = await RefreshTokenCall();
                console.log(res);
                // if (!res?.redirect) return nav("/auth/login");
                token = res?.accessToken ?? null;
                console.log(token);
                // if (cancelled || !token) return nav("/auth/login");
                setAccessToken(token);
            }

            // 2) Load user only once (even if token refreshes every 10 min)
            if (!userLoadedRef.current) {
                const uid = localStorage.getItem("uId");
                // const user = await reload(inxdb, "users", uid); // your Dexie getter
                if (cancelled) return;
                const data_user = await readData(userIdx, "user", uid);
                console.log(data_user);
                setUser(data_user);
                console.log("after setUser, store user:", useAppStore.getState().user);
                userLoadedRef.current = true; // guard against re-runs
            }
        })();

        return () => { cancelled = true; };
    }, []); // runs once
    useEffect(()=>{
        console.log(user);
    },[user])



    // render helpers
    const AppTitle = () => (
        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] mb-4 px-4 py-3">
            <div className="font-extrabold">RetroChat OS</div>
        </div>
    );

    return (
        <div className="min-h-screen w-full px-4 py-6">
            {/* keep title INSIDE app width */}
            <div className={`mx-auto w-full ${isTabletUp ? (fullChat ? "max-w-[1000px]" : "max-w-[1200px]") : "max-w-[640px]"}`}>
                <AppTitle />

                {/* TABLET+/DESKTOP */}
                {isTabletUp ? (
                    fullChat ? (
                        // -------- FULL CHAT ONLY (list hidden) --------
                        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden h-[78vh]">
                            <ChatWindow
                                users={USERS}
                                chat={activeChat}
                                onSend={sendMessage}
                                onToggleFull={() => setFullChat(false)}   // <-- back to split
                                isFullScreen={true}
                            />
                        </div>
                    ) : (
                        // -------- SPLIT VIEW --------
                        <div
                            className="grid gap-4"
                            style={{ gridTemplateColumns: "320px minmax(400px, 1fr)" }} // safe min chat width
                        >
                            <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] p-3 min-w-0 min-h-[7vh]">
                                <ChatList
                                    users={USERS}
                                    chats={filteredChats}
                                    activeId={activeId}
                                    search={search}
                                    onSearch={setSearch}
                                    onOpenProfile={setProfileUser}
                                    onPickChat={pickChat}
                                    onNewChatClick={() => setShowPicker(true)}
                                />
                            </div>

                            <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden min-w-0">
                                <ChatWindow
                                    users={USERS}
                                    chat={activeChat}
                                    onSend={sendMessage}
                                    onToggleFull={() => setFullChat(true)}    // <-- go full
                                    isFullScreen={false}
                                />
                            </div>
                        </div>
                    )
                ) : (
                    // -------- MOBILE (list ↔ chat) --------
                    mobileMode === "list" ? (
                        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] p-3 min-h-[72vh]">
                            <ChatList
                                users={USERS}
                                chats={filteredChats}
                                activeId={activeId}
                                search={search}
                                onSearch={setSearch}
                                onOpenProfile={setProfileUser}
                                onPickChat={pickChat}
                                onNewChatClick={() => setShowPicker(true)}
                            />
                        </div>
                    ) : (
                        <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] overflow-hidden h-[78vh]">
                            <ChatWindow
                                users={USERS}
                                chat={activeChat}
                                onSend={sendMessage}
                                onBack={() => setMobileMode("list")}
                                isFullScreen={false}
                            />
                        </div>
                    )
                )}
            </div>

            {/* Modals */}
            <ProfileModal
                open={!!profileUser}
                onClose={() => setProfileUser(null)}
                user={profileUser}
            />
            <ContactsPicker
                open={showPicker}
                onClose={() => setShowPicker(false)}
                users={USERS}
                existingPeerIds={existingPeerIds}
                onPick={(u) => { startChatWithUser(u); setShowPicker(false); }}
            />
        </div>
    );
}
