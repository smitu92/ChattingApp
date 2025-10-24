import { create } from "zustand";

const useChatStore=create((set)=>({


    roomId:null,

    chatListzut:[],
    chatWindowToggle:false,
    messageszut:[],

    addMessageszut:(msg)=>set((state)=>{
        console.log(msg);
        return {messages:[...state.messages,...msg]}
    }),

    addChatWindowToggle:(value)=>set(()=>({chatWindowToggle:value})),
    addChatListzut:(chat)=>set((state)=>{
        
       return  {chatListF:Array.isArray(chat)? [...state.chatListF,...chat]: [...state.chatListF,chat]}
       }
    ),
    clearChatListF: () => set({ chatListF: [] }),

    setRoomId:(user)=>set(()=>({roomId:user})),
    clearMsgArray:()=>set(()=>({messages:[]}))


}))
export default useChatStore;