import { create } from "zustand";

const useChatStore=create((set)=>({

    currentuser:null,
    roomId:null,
    currentUserKey:null,
    chatListF:[],
    chatWindowToggle:false,
    messages:[],
    receiverId:null,
    setReceiverId:(id)=>set(()=>({receiverId:id})),
    addMessages:(msg)=>set((state)=>{
        console.log(msg);
        return {messages:[...state.messages,...msg]}
    }),

    addChatWindowToggle:(value)=>set(()=>({chatWindowToggle:value})),
    addChatListF:(chat)=>set((state)=>{
        
       return  {chatListF:Array.isArray(chat)? [...state.chatListF,...chat]: [...state.chatListF,chat]}
       }
    ),
    clearChatListF: () => set({ chatListF: [] }),
    addcurrentUser:(user)=>set(()=>({currentuser:user})),
    addCurrentUserKey:(user)=>set(()=>({currentUserKey:user})),
    setRoomId:(user)=>set(()=>({roomId:user})),
    clearMsgArray:()=>set(()=>({messages:[]}))


}))
export default useChatStore;