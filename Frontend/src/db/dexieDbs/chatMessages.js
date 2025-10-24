import Dexie from "dexie";

const msgIdx=new Dexie('AppIndexDB');
 msgIdx.version(1).stores({
    messages:"_id,senderId,receiverId,roomId,text,file,sentTime,receivedTime"
 })

 export default msgIdx;