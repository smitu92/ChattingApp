import { useEffect } from "react";
import pkceSetup from "../../utils/pkceSetup";
import useAppStore from "../../store/appStore";


export default function Login() {
    const setAccessToken=useAppStore((state)=>state.setAccessToken);

    useEffect(() => {
        (async () => {
        //    console.log('🔍 All cookies before deletion:');
        // console.log(document.cookie);
        
        // // Check if rt exists
        // const hasRT = document.cookie.includes('rt');
        // console.log('🔍 Has RT cookie:', hasRT);
        
        // if (hasRT) {
        //     // Try multiple deletion attempts
        //     document.cookie = 'rt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        //     document.cookie = 'rt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost';
            
        //     console.log('🗑️ Attempted deletion');
        //     console.log('🔍 Cookies after deletion:');
        //     console.log(document.cookie);
        // }
        

            // Clear access token
            setAccessToken(null);
                const url = await pkceSetup("login");
                window.location.assign(url); // or: window.location.href = url;
        

            
        })();
    }, []);
    return (<div className="">
        ...loading
    </div>)
}