import mongoose from "mongoose";

// ✅ NEW: UserRoom Collection (mapping/index)
const UserRoomSchema = new mongoose.Schema({
    userId: { type: String, required: true },      // Who owns this
    roomId: { type: String, required: true },      // Which room
    lastMessageTimestamp: Date,                     // For sorting
    unreadCount: { type: Number, default: 0 },     // Unread messages
    isPinned: { type: Boolean, default: false },   // User pinned chat
    isMuted: { type: Boolean, default: false },    // User muted chat
    isArchived: { type: Boolean, default: false }, // User archived
    deletedAt: Date,                               // Soft delete
});



// CRITICAL INDEXES for fast lookup
UserRoomSchema.index({ userId: 1, lastMessageTimestamp: -1 });  // Primary query
UserRoomSchema.index({ userId: 1, roomId: 1 }, { unique: true }); // Prevent duplicates
UserRoomSchema.index({ roomId: 1 });  // For room updates


export const UserRoomSchemaMongo = mongoose.model("UserRoomSchema", UserRoomSchema);