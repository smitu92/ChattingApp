
import AuthBaseUrl from "./axiosBaseUrlAuth";

export default async function requestForAccT(token) {//to get user id and user details not for access token
     try {
        console.log(AuthBaseUrl);
        console.log(token);
          const res=await AuthBaseUrl.get(`/user/me`,{
            headers:{
                Authorization:`Bearear ${token}` 
            }
          });
          console.log(res);
          if(res.data.ok) return {user:res.data.user,message:"successfully request is complated",ok:true};
          return {ok:false,status:res.status(),error:res.data.message}
     } catch (e) {
           console.log(e);
           return {error:"we failed fetch ur profile"}
     }
}