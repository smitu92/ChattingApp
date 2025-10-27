import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
   _id: String,  // Or ObjectId
    participants: [String],  // Array of user IDs [userId1, userId2]
    participantHash: String, // NEW: Sorted hash for quick lookup
    isGroup: { type: Boolean, default: false },
    createdAt: Date,
    updatedAt: Date,
    lastMessage: {
        text: String,
        timestamp: Date
    }
});
chatRoomSchema.index({ participants: 1 });  // Index on participants array
chatRoomSchema.index({ participantHash: 1 }, { unique: true });  // Unique hash index

export const ChatRoomMongo = mongoose.model("ChatRoom", chatRoomSchema);
