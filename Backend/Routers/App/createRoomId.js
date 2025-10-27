import express from "express";
import { ChatRoomMongo } from "../../DB/schema/chatRoom";

const router=express.Router();

const createHashedRoom=(userId1, userId2) => ([userId1,userId2].sort().join('_'));



router.get("/create",async (req,res)=>{

     try {
        const {userId1,userId2}=req.body;
          
        // Step 1: Create participant hash
        const participantHash = createHashedRoom(userId1, userId2);

          // Step 2: Try to find existing room (FAST - uses unique index)
        let room = await ChatRoomMongo.findOne({ participantHash });
        
        if (room) {
            // Room exists! Return it
            return res.json({
                roomId: room._id,
                isNew: false,
                message: "Existing room found"
            });
        }

         
        // Step 3: Room doesn't exist, create new one
        room = await ChatRoomMongo.create({
            participants: [userId1, userId2],
            participantHash: participantHash,
            isGroup: false,
            createdAt: new Date(),
            lastMessage: null
        });
        
        return res.status(201).json({
            roomId: room._id,
            isNew: true,
            message: "New room created"
        });
     } catch (e) {
            console.error("Room creation error:", error);
            res.status(500).json({ error: "Failed to create/find room" });
     }
})