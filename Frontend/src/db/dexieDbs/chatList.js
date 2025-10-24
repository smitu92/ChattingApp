
import Dexie from "dexie";


      const chatListidx = new Dexie('AppIndexDB');
      chatListidx.version(1).stores({
        chatListidx: '_id,participants,lastMessage,lastupdated'
      });
  
export default chatListidx;