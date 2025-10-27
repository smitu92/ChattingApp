import express from "express";
import { mongochatUser } from "../DB/schema/chatUser.js";

const router=express.Router();


router.get("/users",async (req,res)=>{
        console.log("hello from users testing route");
        const allsigneduser=await mongochatUser.find();
        console.log(allsigneduser);
        const allSignedUserObj=allsigneduser.map((obj)=>obj.username);
        let updateurlIs=false;
       async function updateAvatarOfuser() {
                const arrayOfImages=[
                        "https://pet-health-content-media.chewy.com/wp-content/uploads/2024/09/11171429/202105shiba-inu-1214044812-scaled-1.jpg",
                        "https://avatarfiles.alphacoders.com/364/thumb-350-364731.webp",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREGZQ32Zwhko7y3v-Ez4BiPclGRlSrbLtTlA&s"

                ];
                let i=0;
                for (const e of allsigneduser) {
                          await mongochatUser.findByIdAndUpdate(e._id,{avatar:arrayOfImages[i]});
                          i++;
                }
        }
        if (updateurlIs) {
                updateAvatarOfuser();
        }
        return res.json(allSignedUserObj);

})


export default router;