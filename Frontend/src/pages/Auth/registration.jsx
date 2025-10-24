import { useEffect } from "react"
import pkceSetup from "../../utils/pkceSetup"

export default function Registration() {
    useEffect(()=>{
        (async () => {
             const url=await pkceSetup("registration");
             window.location.assign(url);
        })()
       
    },[])
     return(<div>
              ...loading
     </div>)
}