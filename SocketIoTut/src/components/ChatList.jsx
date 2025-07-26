
import { useEffect, useState } from "react";
import useChatStore from "../store";
import { userDb } from "../../IndexDb/user";
import { chatDetailDb } from "../../IndexDb/chatDetailDb";
import { chatDB2 } from "../../IndexDb/Chat";

export default function ChatList() {
  const addChatWindowToggle = useChatStore((state) => state.addChatWindowToggle);
  // const chatWindowToggle = useChatStore((state) => state.chatWindowToggle);
  let chatListF = useChatStore((state) => state.chatListF);
  const setRoomId = useChatStore((state) => state.setRoomId); //roomid
  const addChatListF = useChatStore((state) => state.addChatListF);
  const currentuser = useChatStore((state) => state.currentuser);
  const clearChatListF = useChatStore((state) => state.clearChatListF);
  const setReceiverId = useChatStore((state) => state.setReceiverId);
  const addMessages=useChatStore((state)=>state.addMessages);
  const messages=useChatStore((state)=>state.messages);





  const [activeUser, setActiveUser] = useState(null);
  useEffect(() => {
    console.log(chatListF);


  }, [chatListF]);

  // function handleToggle(selecteduser) {

  //           if (selecteduser.participants[1]) {
  //                if (flag) {
  //                      addChatWindowToggle(true);setToggle(selecteduser.participants[1]);
  //                      setFlag(false);
  //                }else{
  //                    setFlag(true);
  //                    addChatWindowToggle(false); setToggle(null);
  //                }

  //           }
  //         }
  function handleToggle(chat) {
        const reciever=chat.participants.filter((e)=>e!==currentuser);

    const isSameUser = activeUser === (reciever[0]);

    if (isSameUser) {
      setActiveUser(null);
      addChatWindowToggle(false); // Close window
    } else {
      setActiveUser(reciever[0]);
      addChatWindowToggle(true);  // Open window
      setRoomId(chat._id);//roomid; //1
      console.log(chat._id);
      const getAllMessages=async () => {
          const allMessages= await chatDB2.getAllIndex("chatRoomId");
          // console.log(allMessages);
          const filteredMessages=allMessages.filter((c)=> c.chatRoomId===chat._id);
          console.log(filteredMessages);
          const sortedMessages=filteredMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
          console.log(sortedMessages)
          addMessages(sortedMessages);
          return filteredMessages
      }

     getAllMessages();
      setReceiverId(...reciever);
    }
  }
useEffect(()=>{
        console.log(messages);
},[messages])
  useEffect(() => {

     console.log("hello");
  clearChatListF();
  fetchChatListFromDb();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentuser]);

  const fetchChatListFromDb = async () => {
    if (!currentuser) {
      return;
    }

    const { chatList } = await userDb.getUser(currentuser);
    console.log(chatList);

    if (!chatList.length) {
      return;
    }
    async function checkParticipantsOnChatList(chatList) {
      if (!Array.isArray(chatList)) {
        console.error("❌ chatList is not an array:", chatList);
        throw new Error("chatList must be an array");
      }
      const allChats = await Promise.all(
        chatList.map((id) => chatDetailDb.getChatFromId(id))
      );
      console.log(allChats);
      addChatListF(allChats);


    }
    checkParticipantsOnChatList(chatList);

  }

  if (!chatListF.length) {
    return
  }

  return (
    <div className="p-4 space-y-4">
      <input
        className="w-full px-3 py-2 rounded-md border text-sm"
        placeholder="Search..."
      />
      {chatListF?.map((chat, i) => {
        const user=chat.participants.filter((e)=>e!==currentuser);
        const isActive =  (user[0])=== activeUser;
        // console.log("active user:",activeUser,"\nuser:",user,"status:",isActive);

        // console.log(user);
        return (<div key={i} className={`flex justify-between items-center ${isActive ? 'bg-violet-400' : 'bg-white  hover:bg-indigo-50 '} p-3 rounded-lg shadow cursor-pointer`}>
          <button onClick={() => { handleToggle(chat) }}>
            <div>
              <div className="font-semibold">{chat?.name}</div>
              <div className="text-2xs text-gray-500">{user[0]}</div>
            </div>
            <div className="text-xs text-gray-400">{chat?.time}</div>
          </button>

        </div>)
      }

      )}
    </div>
  );
}
