import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  lastMessage: {
    type: String, // or `ref: 'Message'` if you want to populate message object
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  created:{
    type:Date,
    default:Date.now
  }
});

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
