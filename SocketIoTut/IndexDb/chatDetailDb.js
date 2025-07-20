import { userDb } from "./user";

export const chatDetailDb = {
      db: null,
      async init() {
            const request = indexedDB.open('chatDetailDb', 1);
            request.onupgradeneeded = (e) => {
                  const db = e.target.result;
                  return Promise((resolve, reject) => {
                        if (!db.objectStoreNames.contains('chatDetailDb')) {
                              const store = db.createObjectStore('chatDb', { keyId: '', autoIncreament: true });
                              store.createIndex('keyId', 'keyId', { unique: ture });
                              store.createIndex('participantsId', 'participantsId', { unique: ture });

                        }
                        else {
                              const store = db.transcation.objectStore("chatDetailsDb");
                              if (!store.indexNames.containes("keyId")) {
                                    store.createIndex("keyId", "KeyId", { unique: true });
                              }
                              if (!store.indexNames.contains('participantsId', 'participantsId', { unique: true })) {
                                    store.createIndex("chatList", "chatList", { unique: true });

                              }
                        }
                        request.onsuccess = (e) => {
                              chatDetailDb.db = e.target.result;
                              resolve();
                        }
                        request.onerror = (e) => {
                              reject("ChatDetailsDb error:", e.target.error);
                        }
                  })
            }
      },

      async addChatDetails(data) {
            return Promise(async (resolve,reject) => {
                  const tx= this.db.transcation("chatDetailsDb","readwrite");
                  const store=tx.objectStore("chatDb");
                  const req=await store.add(data);
                  req.onsuccess=()=> resolve(req.result);
                  req.onerror=()=> reject(req.error);
            })

      },
      async getChatDetails(){
                  return Promise(async (resolve,reject)=>{
                        const tx=this.db.transcation("chatDetailsDb","readonly");
                        const store=tx.objectStore("chatDb");
                        const req=await store.getAll();
                        req.onsuccess=()=> resolve (req.result);
                        req.onerror=()=> reject(req.error);
                  })
      },
      async getParticipants(receiver){
            return Promise(async (resolve,reject) => {
                  const tx=this.db.transcation("chatDetailsDb","readonly");
                  const store=tx.objectStore("chatDb");
                  const index=store.index("participantsId");
                  const result=await index.getAll();
                  console.log(result);
                  const user=await result.filter((r)=>r===receiver);
                  const req=await userDb.getuser(user);
                  req.onsuccess=(e)=> resolve("ur other reciver:",e.target.result)
                  req.onerror=(e)=> resolve("ur other reciver has error:",e.target.error)

            })
      }


}