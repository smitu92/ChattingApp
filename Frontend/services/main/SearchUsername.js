import MainAppUrl from "../utils/basicUrl.js";

export default async function SearchUsernames(searchpar) {
    try {
         const {data}=await MainAppUrl.post('/search',{
          searchpar
      });
      console.log(data);
      if (data.ok) {
         return {usernames:data.usernames,message:"successfuly a request is done ",ok:true}
      }
        
    } catch (error) {
           console.error("error while searching usernames",error);
           return {error:error,message:"error while searching usernames",ok:false}
           
    }
     
      
    
}