import url  from "./axiosBaseUrlAuth";
export default async function RefreshTokenCall() {
     // const rt= document.cookie.includes('rt');
     // console.log(rt);
     // if (!rt) return {error:"No rt so login",redirect:true}; // this should be not readble by js cuz httpsonly is true so
       try {
           /*  const res=await axios.get("url/refresh",{
               headers:{
                    Authorization:rt
               }
                    no need of that cuz we have given route to cookie so 
            }); */
            const res=await url.get(`/authservice/refresh`,{ withCredentials:true});
            console.log(res);
            if(res.data.ok) {
               console.log("it is correct");
               return {accessToken:res.data.accessToken};
          };
            return {error:"rt is expired so login",redirect:true};


       } catch (e) {
              console.log(e);
              return {error:"something happened wrong to get token and so please do login again"};
       }

}