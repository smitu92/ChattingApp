import MainAppUrl from "../utils/basicUrl.js";

export default async function SearchUsernames(searchpar) {
    try {
         const res=await MainAppUrl.post('/search',{searchpar});
    //   console.log(res);
    //   console.log(res.data);
      if (res.data.ok) {
         return {data:res.data.r,message:"successfuly a request is done ",ok:true}
      }
        
    } catch (error) {
           console.error("error while searching usernames",error);
           return {error:error,message:"error while searching usernames",ok:false}
           
    }
     
      
    
}