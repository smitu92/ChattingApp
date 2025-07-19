import { create } from 'zustand';

const useStore = create((set) => ({
  messages: [],
  addMessage: (msg) => set((state) =>{
     return {
        messages: [...state.messages, msg],
     }
  },
),
chatRoom:{},
addChatRoom:(Room)=>set((state)=>{
        return {
             chatRoom:{_id:Room._id,messages:[...state.messages]}
               }
})
  
}));

export default useStore;