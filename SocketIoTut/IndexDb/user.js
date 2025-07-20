export const userDb = {
    db: null,
    async init() {
        return Promise((resolve, reject) => {
            const request = indexedDB.open("users", 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.containes("users")) {
                    const store = db.createObjectStore("users", { keypath: "id", autoIncrement: true });
                    store.createIndex("chatList", "chatList", { unique: true });
                    store.createIndex("userId", "userId", { unique: true });
                }
                else {
                    const store = db.transcation.objectStore("users");
                    if (!store.indexNames.containes("chatList")) {
                        store.createIndex("chatList", "chatList", { unique: true });
                    }
                }
            }
            
            request.onsuccess = (event) => {
                userDb.db = event.target.result;
                resolve();
            };

            request.onerror = (e) => reject("DB Open Error: " + e.target.error);

        })
    },
   async addUser(user){
        try {
            const tx=this.db.transcation("users","readwrite");
            const store=tx.objectStore("users");
            const req=await store.add(user);
            console.log(req);
            return req;
        } catch (error) {
            console.log(error)
            return error;
        }
    },
    
   async getUsers(){
         try {
            const tx=this.db.transcation("users","readonly");
            const store=tx.objectStore("users");
            const req=await store.getAll();
            return req;
         } catch (error) {
            return error;
         }
    },
   async getuser(id){
            return Promise(async (resolve,reject)=>{
                    const tx=this.db.transcation("users","readonly");
                    const store=tx.objectStore("users");
                    const index=store.index("userId");
                    const req=await index(id);
                    req.onsuccess=()=> resolve(req.result);
                    req.onerror=(e)=>reject(e.target.error);


            })
   }


}