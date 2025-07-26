import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { userDb } from "../../IndexDb/user";
import useChatStore from "../store";
import { chatDetailDb } from "../../IndexDb/chatDetailDb";

export default function NewChatButton() {
    const [open, setOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState("");
    const currentuser = useChatStore((state) => state.currentuser);
    const addChatListF=useChatStore((state)=>state.addChatListF);
    const chatListF=useChatStore((state)=>state.chatListF);





    //   const currentUserKey=useChatStore((state)=>state.currentUserKey);


    useEffect(() => {
        if (!currentuser) return;

        const fetchUsers = async () => {
            try {
                const result = await userDb.getUsers();
                const filtered = result.filter((u) => u.userId !== currentuser);
                setAllUsers(filtered);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, [currentuser]);

    const filteredUsers = allUsers.filter((user) => {
        const uname = user?.username || user?.name || "";
        return uname.toLowerCase().includes(search.trim().toLowerCase());
    });
    //   const testtt= async () => {
    //   try {
    //     const result = await userDb.getUser("user_005");
    //     console.log("Got user:", result);
    //     const added = await userDb.updateUser({ ...result, chatList: "dummy-id" });
    //     console.log("User updated?", added);
    //   } catch (err) {
    //     console.error("Test failed", err);z
    //   }
    // };

    async function OnNewUser(user) {
        // const chatList=await userDb.getChatList(currentUserKey);
        const prevdata = await userDb.getUser(currentuser);
        console.log(prevdata);
        const { chatList } = prevdata;
        console.log(chatList);
        console.log(chatList);
        console.log(currentuser);
        console.log(user);
        console.log("it is OnNewUser");
       
        if (!chatList.length) {
            console.log("chatlist");
            try {
                const req = await chatDetailDb.addChatDetails({
                    _id: crypto.randomUUID(),
                    participants: [currentuser, user.userId],
                    LastMessage: null,
                    LastTimeStamp: null
                });
                // console.log(req);


                await userDb.updateUser({ ...prevdata, chatList: [...prevdata.chatList, req._id] });
                const receiverData = await userDb.getUser(user.userId);
                console.log(receiverData);
                const req4 = await userDb.updateUser({ ...receiverData, chatList: [...receiverData.chatList, req._id] });
                console.log(req4);
                if (!chatListF.length) {
                    addChatListF(req);
                }

                return ;


            } catch (error) {
                console.log(error);
            }
        }
        console.log("it is spiderman");

        async function checkParticipantsOnChatList(chatList, receiverId) {
            if (!Array.isArray(chatList)) {
                console.error("❌ chatList is not an array:", chatList);
                throw new Error("chatList must be an array");
            }
            console.log(receiverId);
            const allChats = await Promise.all(
                chatList.map((id) => chatDetailDb.getChatFromId(id))
            );
            console.log(allChats);
            const matchedChats = allChats.filter((chat) => {
                return chat?.participants?.includes(receiverId);
            });

            return matchedChats;
        }
        // console.log("Before checkParticipantsOnChatList");
        // console.log("typeof chatList:", typeof chatList);
        // console.log("isArray:", Array.isArray(chatList));
        // console.log(chatList);

        const result = await checkParticipantsOnChatList(chatList, user.userId);
        console.log(result);
        if (!result.length) {
            const req = await chatDetailDb.addChatDetails({
                _id: crypto.randomUUID(),
                participants: [currentuser, user.userId],
                LastMessage: null,
                LastTimeStamp: null
            });
            const receiverData=await userDb.getUser(user.userId);
            console.log(receiverData);
            const flag = await userDb.updateUser({ ...prevdata, chatList: [...prevdata.chatList, req._id] });
            if (flag) {
               const req4= await userDb.updateUser({...receiverData,chatList:[...receiverData.chatList,req._id]});
               console.log(req4);
               const updatereceiverdata=await userDb.getUser(user.userId);
               console.log(updatereceiverdata);
                // console.log(req);
                addChatListF(req);
                console.log(chatListF);
                return
            }
        }
        console.log("u were doing chat with him/her already");

    }

    return (
        <>
            {/* Floating Add Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 z-50"
            >
                <Plus />
            </button>

            {/* Overlay Dialog */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-24 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-4 shadow-lg">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* User List */}
                        <div className="max-h-64 overflow-y-auto">
                            {filteredUsers.length === 0 ? (
                                <p className="text-gray-500 text-sm">No users found.</p>
                            ) : (
                                filteredUsers.map((user) => (
                                    <button
                                        key={user.userId}
                                        onClick={() => {
                                            // TODO: Start chat logic
                                            setOpen(false);
                                            OnNewUser(user);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                                    >
                                        {user.name || `User ${user.userId}`}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
