// const request = indexedDB.open("messageDB", 1);

// request.onupgradeneeded = function (event) {
//   const db = event.target.result;

//   const store = db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });

//   store.createIndex("time", "time", { unique: false });
//   store.createIndex("senderId", "sender.id", { unique: false });
//   store.createIndex("receiverId", "receiver.id", { unique: false });

//   console.log("Object store and indexes created");
// };

// request.onerror = function (event) {
//   console.error("Database error:", event.target.errorCode);
// };

// request.onsuccess = function (event) {
//   const db = event.target.result;
//   console.log("Database opened successfully");

//   // Continue using db
//   window.db = db; // For global use in console testing
// };

export const chatDB2 = {
    db: null,

    async init() {
        return new Promise((resolve, reject) => {

            const request = indexedDB.open("messages", 4);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains("messages")) {
                    const store = db.createObjectStore("messages", { keyPath: "_id",});
                    // store.createIndex("sender.id", "sender.id", { unique: false });
                    // store.createIndex("receiver.id", "receiver.id", { unique: false });
                    store.createIndex("timeStamp", "timeStamp", { unique: false });
                    store.createIndex("chatRoomId", "chatRoomId", { unique: false });
                } else {
                    const store = request.transaction.objectStore("messages");
                    // if (!store.indexNames.contains("sender.id")) {
                    //     store.createIndex("sender.id", "sender.id", { unique: false });
                    // }
                   

                    // if (!store.indexNames.contains("receiver.id")) {
                    //     store.createIndex("receiver.id", "receiver.id", { unique: false });
                    // }
                
                    if (!store.indexNames.contains("timeStamp", "timeStamp")) {
                        store.createIndex("timeStamp", "timeStamp", { unique: false });

                    }
                    if (!store.indexNames.contains("chatRoomId", "chatRoomId")) {
                        store.createIndex("chatRoomId", "chatRoomId", { unique: false });
                    }

                    console.log(store);
                }
            };

            request.onsuccess = (event) => {
                chatDB2.db = event.target.result;
                resolve();
            };

            request.onerror = (e) => reject("DB Open Error: " + e.target.error);
        });
    },

   async addMessage(message) {
        if (!this.db) {
            await this.init();
        }
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("messages", "readwrite");
            const store = tx.objectStore("messages");
            const req = store.add(message);

            req.onsuccess = () => {
                    const id=req.result;
                    const result={...message,_id:id}
                        resolve(result);

            }
                
            req.onerror = (e) => reject("Add Error: " + e.target.error);
        });
    },

    getMessages({ senderId, receiverId }) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("messages", "readonly");
            const store = tx.objectStore("messages");

            const messages = [];
            store.openCursor().onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    const msg = cursor.value;
                    const sId = msg.sender?.id;
                    const rId = msg.receiver?.id;

                    const match =
                        (sId === senderId && rId === receiverId) ||
                        (sId === receiverId && rId === senderId);

                    if (match) messages.push(msg);
                    cursor.continue();
                } else {
                    resolve(messages);
                }
            };

            store.openCursor().onerror = (e) => reject("Cursor Error: " + e.target.error);
        });
    },
  async  getAllIndex( indexName) {
          if (!this.db) {
            await this.init();
        }
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("messages", "readonly");
            const store = tx.objectStore("messages");
            const index = store.index(indexName);
            const req=index.getAll()
            req.onsuccess = () => { 
                // console.log("it is oggy:",req.error);
                return resolve(req.result); }
            req.onerror = (e) => reject("Something went wrong when we were finding ${indexName}", e.target.error);
        })

    },
     async  getAllIndexMessages( indexName,value) {
          if (!this.db) {
            await this.init();
        }
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("messages", "readonly");
            const store = tx.objectStore("messages");
            const index = store.index(indexName);
            const req=index.get(value);
            console.log(req);
            req.onsuccess = () => { 
                // console.log("it is oggy:",req.error);
                return resolve(req.result) }
            req.onerror = (e) => reject("Something went wrong when we were finding ${indexName}", e.target.error);
        })

    },
    getAllMessages() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("messages", "readonly");
            const store = tx.objectStore("messages");

            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e) => reject("GetAll Error: " + e.target.error);
        });
    }
};
