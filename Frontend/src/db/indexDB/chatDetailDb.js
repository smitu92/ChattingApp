// import { userDb } from "./user";

// export const chatDetailDb = {
//       db: null,
//       async init() {
//             return new Promise((resolve, reject) => {
//             const request = indexedDB.open('chatDetailDb', 3);
//             request.onupgradeneeded = (e) => {
//                   const request = e.target.result;
               
//                         if (!request.objectStoreNames.contains('chatDb')) {
//                               const store = request.createObjectStore('chatDb', { keyPath: 'id', autoIncreament: true });
//                               store.createIndex('_id', '_id', { unique: true });
//                               store.createIndex('participantsId', 'participantsId', { unique: true });

//                         }
//                         else {
//                               const store = request.transcation.objectStore("chatDb");
//                               if (!store.indexNames.containes("_id")) {
//                                     store.createIndex("_id", "_id", { unique: true });
//                               }
//                               if (!store.indexNames.contains('participantsId')) {
//                                     store.createIndex("participantsId", "participantsId", { unique: true });

//                               }
//                         }
//                         request.onsuccess = (e) => {
//                               this.db = e.target.result;
//                               resolve();
//                         }
//                         request.onerror = (e) => {
//                               reject("ChatDetailsDb error:", e.target.error);
//                         }
//       }})
//             }
      
//       },

//       async addChatDetails(data) {
//             return new Promise((resolve,reject) => {
//                   const tx= this.db.transcation("chatDb","readwrite");
//                   const store=tx.objectStore("chatDb");
//                   const req=store.add(data);
//                   req.onsuccess=()=> resolve(req.result);
//                   req.onerror=()=> reject(req.error);
//             })

//       },
//       async getChatDetails(){
//                   return new Promise( (resolve,reject)=>{
//                         const tx=this.db.transcation("chatDb","readonly");
//                         const store=tx.objectStore("chatDb");
//                         const req=store.getAll();
//                         req.onsuccess=()=> resolve (req.result);
//                         req.onerror=()=> reject(req.error);
//                   })
//       },
//       async getParticipants(receiver){
//             return new Promise( (resolve,reject) => {
//                   const tx=this.db.transcation("chatDb","readonly");
//                   const store=tx.objectStore("chatDb");
//                   const index=store.index("participantsId");
//                   const result= index.getAll();
//                   console.log(result);
//                   const user=result.filter((r)=>r===receiver);
//                   const req=userDb.getUser(user);
//                   req.onsuccess=(e)=> resolve("ur other reciver:",e.target.result)
//                   req.onerror=(e)=> reject("ur other reciver has error:",e.target.error)
//             })
//       },
//       async getChatFromId(chatId){
//              return new Promise( (resolve,reject) => {
//                   const tx=this.db.transcation("chatDb","readonly");
//                   const store=tx.objectStore("chatDb");
//                   const index=store.index("KeyId");
//                   const req= index.get(chatId);
                  
//                   req.onsuccess=()=> resolve("ur other reciver:",req.result);
//                   req.onerror=()=> reject("ur other reciver has error:",req.error);
//             })
//       },
//       async checkParticipantsOnChatList(chatList,receiverId){
//             return new Promise((resolve,reject)=>{
//                    const Allchats=chatList.map((chatid)=>this.getChatFromId(chatid));
//                    const req=Allchats.filter((chat)=>{
//                          const isValidUser=chat.participants.filter((user)=>user===receiverId);
//                           if (isValidUser) {
//                               return chat;
//                           }
//                    });
//                    req.onsuccess=(e)=>resolve(e.target.result);
//                    req.onerror=(e)=>reject(e.target.error);
//             })

//       }


// }

export const chatDetailDb = {
  db: null,

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("chatDetailDb", 4);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("chatDb")) {
          const store = db.createObjectStore("chatDb", {
            keyPath: "_id",
          });
          store.createIndex("participantsId", "participants", { unique: false }); // not unique!
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve();
      };

      request.onerror = (e) => {
        reject("Failed to open DB: " + e.target.error);
      };
    });
  },

  async addChatDetails(data) {
      if (!this.db) {
            await this.init();
      }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("chatDb", "readwrite");
      const store = tx.objectStore("chatDb");
      const req = store.add(data);

          req.onsuccess = () => {
                const insertedId = req.result;
                const fullData = { ...data, id: insertedId };
            //     console.log("new chat created", fullData);
                resolve(fullData); // 🎯 return the full inserted data
          }
          req.onerror = () => reject(req.error);
    });
  },

  async getChatDetails() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("chatDb", "readonly");
      const store = tx.objectStore("chatDb");
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async getParticipants(receiverId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("chatDb", "readonly");
      const store = tx.objectStore("chatDb");
      const index = store.index("participantsId");
      const req = index.getAll(receiverId);

      req.onsuccess = () => {
        const results = req.result;
        resolve(results); // return matching chat records
      };

      req.onerror = () => reject(req.error);
    });
  },

  async getChatFromId(chatId) {
       if (!this.db) {
            await this.init();
      }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("chatDb", "readonly");
      const store = tx.objectStore("chatDb");
      const req = store.get(chatId); // use get directly with keyPath

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },


};
