import Dexie from "dexie";

const inxdb = new Dexie("AppIndexDB");

inxdb.version(1).stores({
  users: "_id, username, picture, bio, lastSeen",
  chatListidx: "_id, participants, lastMessage, lastupdated",
  messages: "_id, senderId, receiverId, roomId, text, file, sentTime, receivedTime"
});

export default inxdb;
