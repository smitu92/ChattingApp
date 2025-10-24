import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";


export default  function Applayout() {
    return(<div>

            
        <Sidebar/>
        <Outlet/>



    </div>)
}