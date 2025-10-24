// components/ChatInfoPanel.jsx

import { useEffect, useState } from "react";
import useChatStore from "../store";
import socket from "../hooks/socket";
import { userDb } from "../db/user";




export default function ChatMessage() {
  const roomId = useChatStore((state) => state.roomId ); //roomid
  const messages = useChatStore((state) => state.messages);
  const currentuser = useChatStore((state) => state.currentuser);
  const addMessages = useChatStore((state) => state.addMessages);
  // const [currentTimeStamp,setTimeStamp]=useState(new  Date().toLocaleTimeString());
  const [msg, addMsg] = useState([]);
 
  useEffect(()=>{
        console.log(msg);
  },[msg])
  useEffect(() => {
    if (!messages) {
      return
    }

    const perMsg = messages.filter((chat) =>chat.chatRoomId ===roomId) //personalized messages
    
    console.log(perMsg);
    
    //sol timestamp
    addMsg(perMsg);

  }, [roomId ,messages])

  useEffect(() => {
    if (!socket || !currentuser) return;

    const handleReceiveMessage = async (data) => {
      const receiver = await userDb.getUser(data.receiverId);
      if (receiver?.userId === currentuser) {
        console.log("📥 Received message:", data);
        console.log(msg);
        addMsg(prev => [...prev, data]);
        addMessages([data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    //✅ Cleanup to prevent multiple listeners
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [currentuser]);
  //  async function Tempory(data) {
  //        const receiver = await userDb.getUser(data.receiverId);
  //     if (receiver?.userId === currentuser) {
  //       console.log(currentuser);
  //       console.log("📥 Received message:", data);
  //       addMsg(data);
  //     }
  //     return () => {
  //     socket.off("receive_message",Tempory );
  //   };
  //  }
  // socket.on("receive_message",Tempory)

  return (
    <>
      {msg?.map((chat,i) =>


      (<div key={i}>      
         <div className={`${currentuser===chat.senderId ? 'self-start' : 'self-end'} bg-white p-3 rounded-xl shadow max-w-md`}>
                  {chat.text}
          </div>
      
      </div> )


      )

      }

    </>
  );
}
