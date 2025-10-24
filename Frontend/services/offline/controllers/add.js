export default async function insertData(db,table,object) {
    try {
      // if (!await(db.table(table)) && table==="chatListidx") {
      //      db.version(1).stores({
      //   chatListidx: '_id,participants,lastMessage,lastupdated'
      // });
      // }
       await db.table(table).add({...object})
        
    } catch (error) {
         console.error(`this is error while doing insertion into ${db}`);
         throw error;
    }
}

