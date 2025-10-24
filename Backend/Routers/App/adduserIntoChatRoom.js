import express, { json } from "express";
import { ChatRoom } from "../../DB/schema/chatRoom.js";

const router=express.Router();


router.post("/makeNewRoomId",async(req,res)=>{
         const i=req.body;
         console.log(i);
         try {
            const r=await ChatRoom.create({
                participants:[
                     i.u1,
                     i.u2
                ]
         })
            console.log(r);
            return res.status(200).json({message:"successfuly roomId is created",roomId:r,ok:true});
         } catch (error) {
               console.log(error);
               return res.status(404).json({message:"failed to add user",ok:false,error:error});
         }
        
})
export default router;