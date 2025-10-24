import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAppStore from "../../store/appStore.js";
import requestForAccT from "../../../services/Auth/userCall.js";
import insertData from "../../../services/offline/controllers/add.js";
import userIdx from "../../db/dexieDbs/userDB.js";
import Dexie from "dexie";


export default function Auth_callBack() {
    const nav=useNavigate();
    const setAccessToken=useAppStore((state)=>state.setAccessToken);
    const setUser=useAppStore((state)=>state.setUser);
    useEffect(() => {

        (async () => {
            const queryParams = new URLSearchParams(window.location.search)
            const state = queryParams.get("state");
            const code = queryParams.get("code");
            const codeVerifier = localStorage.getItem("pkce_verifier");
            const fstate = localStorage.getItem("oauth_state");
            console.log({fstate,code,codeVerifier,state});
            if (state !== fstate || !code || !codeVerifier) {
                console.error("State or other parameters are not valid.");
                // Redirect to an error page or the home page
                // nav("/auth/login");
                // return;
            }

            // Prepare the parameters for the POST request body
            const params = {
                grant_type:"authorization_code",
                client_id: "chat-ui",
                redirect_uri: "http://localhost:5174/auth/callback",
                code_verifier: codeVerifier,
                code: code,
            };

            try {
                // Step 1: Make a POST request to your backend's token endpoint
                const response = await fetch("http://localhost:2000/authservice/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        
                    },
                    body: JSON.stringify(params),
                    credentials: "include",    
                });
            
                console.log(response);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Step 2: Handle the tokens received from the backend
                // Your backend will respond with access_token, refresh_token, etc.
                console.log("Tokens received:", data);
                console.log(data.accessToken);
                setAccessToken(data.accessToken);
                // console.log("callback nu accesstoken",accesstoken); //react needs time to update accesstoken
                
                const res=await requestForAccT(data.accessToken);
                if (res.ok) {
                    console.log("callback nu user",res.user);
                    localStorage.setItem('uId',res.user._id);
                    console.log(await userIdx.table("user").where("_id").equals(res.user._id).first());
                    // console.log(await Dexie.exists("AppIndexDB"),await userIdx.table.user) //wrong way to access userIdx.table.user
                    if((!(await Dexie.exists("AppIndexDB"))) || (!(await userIdx.table("user").where("_id").equals(res.user._id).first()))){
                             await insertData(userIdx,"user",res.user);
                    }
                    setUser(res.user._id);
                    nav("/Profile");
                   
                }
                return (<><div>something went wrong with error {res.error} and status {res.status} ,plese do login again</div></>)
                // Store the tokens securely (e.g., in memory, or in a state management system)
                // Then, redirect the user to the main chat application.
                // For example, if you get an access token, you could store it and then navigate.
               

            } catch (error) {
                console.error("Token exchange failed:", error);
                // Handle the error, maybe show an error message to the user
            }
        })()
    }, [])
    // useEffect(()=>{

    // },[accesstoken])
    return (<div>
        ...wait
    </div>

    )
}
