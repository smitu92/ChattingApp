import MainAppUrl from "../utils/basicUrl";

export default async function crateRoomId(u) {
    const currU=localStorage.getItem("uId")
       try {
            const data={
                u1:u._id,
                u2:currU
            }
            const r=await MainAppUrl.post("/makeNewRoomId",data)
            console.log(r);
            if(r.data.ok) return {message:"it is successfuly crated",ok:true,roomId:r.data.roomId}
            return {error:r.data.error};
       } catch (e) {
            console.log(e);
             return {error:e,ok:false};
       }
}