export const userDb = {
  db: null,

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("users", 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        // Fix: 'contains' ➝ 'contains'
        if (!db.objectStoreNames.contains("users")) {
          // Fix: 'keypath' ➝ 'keyPath'
          const store = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });

          store.createIndex("chatList", "chatList", { unique: false });
          store.createIndex("userId", "userId", { unique: true });
        }
      };

      request.onsuccess = (event) => {
        userDb.db = event.target.result;
        resolve();
      };

      request.onerror = (e) => reject("DB Open Error: " + e.target.error);
    });
  },

  async addUser(user) {
    try {
      const tx = this.db.transaction("users", "readwrite"); // Fix: 'transcation' ➝ 'transaction'
      const store = tx.objectStore("users");
      const req = store.add(user); // no await needed here, it's synchronous

      return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  },
   async updateUser(user) {
    try {
      const tx = this.db.transaction("users", "readwrite"); // Fix: 'transcation' ➝ 'transaction'
      const store = tx.objectStore("users");
      const req = store.put(user); // no await needed here, it's synchronous

      return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  async getUsers() {
    try {
      const tx = this.db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const req = store.getAll();

      return new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      return error;
    }
  },

  async getUser(userId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const index = store.index("userId");
      const req = index.get(userId); // Fix: index.get(userId), not index(userId)

      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  },
  async getChatList(loggedUserId){
    return new Promise((resolve,reject)=>{
            const tx=this.db.transaction("users","readonly");
            const store=tx.objectStore("users");
            const index=store.index("chatList");
            console.log(loggedUserId)
            const req=index.get(loggedUserId);

            req.onsuccess=()=>{
              console.log(req.result);
              resolve(req.result);
            }
            req.onerror=(e)=>reject(e.target.error);


    })
  }
};
