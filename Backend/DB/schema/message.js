import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or you can remove this for group chat
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  text: {
    type: String,
    trim: true,
  },
  file: {
    type: String, // or { url: String, type: String } if supporting multiple file types
  },
  sentTime: {
    type: Date,
    default: Date.now,
  },
  receivedTime: Date,
});

export const Message = mongoose.model("Message", messageSchema);
