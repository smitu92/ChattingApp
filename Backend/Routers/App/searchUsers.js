import express from 'express';
import { mongochatUser } from '../../DB/schema/chatUser.js';
import Fuse from 'fuse.js';



const router=express.Router();


router.post('/search',async (req,res)=>{
            const searchParameters=req.body;
            const {searchpar}=searchParameters;
            console.log(searchpar);
            const fuseOptions={
                threshold: 0.8,
                keys:[
                    "username"
                ]
            }
            try {
                const usernames=await mongochatUser.find();
                console.log(usernames);
                const fuse=new Fuse(usernames,fuseOptions);
                const r= fuse.search(searchpar);
                console.log("r:",r);
                return res.status(200).json({messages:"successfully search is complated",ok:true,usernames:r});

            } catch (e) {
                  console.error("this is error from search endpoint");
                return res.status(204).json({messages:" search is not complated",ok:false,error:e});

            }
})

export default router;