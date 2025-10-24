import { useEffect } from "react"
import useAppStore from "../../store/appStore.js";

 export default function Testing() {
    const user=useAppStore((s)=>s.user);
    console.log(user);
    useEffect(()=>{
        console.log("this is testing and this are user details:",user);
    },[user])
    return (<div>

        {user};

    </div>)
}