import { create } from "zustand";
import { devtools } from "zustand/middleware";



const useAppStore=create(devtools((set)=>({
    user:null,
    accesstoken:null,
    // setUser:(data_user)=>set(()=>{
    //     console.log(data_user)
    //     return {user:data_user};
             
    // }),
    
     // expects full user object
      setUser: (data_user) => {
        console.log("[store] setUser called:", data_user);
        set({ user: data_user ?? null });
      },
    setAccessToken:(token)=>set(()=>{       
          return {accesstoken:token}
    })

})));



export default useAppStore;