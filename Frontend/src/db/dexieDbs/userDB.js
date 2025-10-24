import Dexie from "dexie";

      //
      // Declare Database
      //
      const userIdx = new Dexie('AppIndexDB');
      userIdx.version(1).stores({
        user: '_id, username, picture, bio, lastSeen'
      });
    //  export function initappIdx() {
    //       const userIdx = new Dexie('AppIndexDB');
    //     userIdx.version(1).stores({
    //     user: '_id'
    //   });
    //   }
export default userIdx;