import { useState } from "react";
import { chatDB2 } from "../db/Chat";
import useChatStore from "../store";
import socket from "../hooks/socket";

export default function MessageInput() {
  const roomId =useChatStore((state)=>state.roomId );
  const addMessages=useChatStore((state)=>state.addMessages);
  const currentuserId = useChatStore((state) => state.currentuser);
  const receiverId = useChatStore((state) => state.receiverId);

    
    const [msg, addMsg] = useState();
    function handleInput(e) {
        addMsg(e.target.value);
    }
    function sendMessageToUser(value) {
         socket.emit("send_message",value);
    }
    function handleSend() {
        async function addMessageInDb(){
            
           const msgObject={
                  _id:crypto.randomUUID(),
                  chatRoomId:roomId ,
                  timeStamp:new Date().toISOString(),
                  senderId:currentuserId,
                  receiverId:receiverId,
                  text:msg,

            }
            console.log(msg);
            const req=await chatDB2.addMessage(msgObject);
            console.log(req);
            sendMessageToUser(req);
            addMessages([req]);
            addMsg(" ");
        }
        console.log(roomId);
        // Only call if there's text to send
    if (msg?.trim()) addMessageInDb();
        
    }
    return (<>
        <input
            className="flex-1 p-2 rounded-md border"
            placeholder="Type your message"
            onChange={(e)=>handleInput(e)}
            value={msg || ""}
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md" onClick={handleSend}>
            send
        </button>




    </>)
}