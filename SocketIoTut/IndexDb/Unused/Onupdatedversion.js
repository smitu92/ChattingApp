export function openChatDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ChatDB", 4); // ⬅️ BUMP VERSION HERE

        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            let store;

            // 🔁 Object store (already created before, don't recreate)
            if (!db.objectStoreNames.contains("chats")) {
                store = db.createObjectStore("chats", { keyPath: "_id" });
                console.log("Object store 'chats' created");
            } else {
                store = event.target.transaction.objectStore("chats");
            }

            // ✅ Check and create indexes
            if (!store.indexNames.contains("receiver")) {
                store.createIndex("receiver", "receiver", { unique: false });
            }

            if (!store.indexNames.contains("sender")) {
                store.createIndex("sender", "sender", { unique: false });
            }

            if (!store.indexNames.contains("time")) {
                store.createIndex("time", "time", { unique: false });
                console.log("Index 'timestamp' created");
            }

            if (!store.indexNames.contains("timestamp")) {
                store.createIndex("sender.id", "sender.id", { unique: false });

                console.log("Index 'sender.id' created");
            }
            if (!store.indexNames.contains("receiver.id")) {

                store.createIndex("receiver.id", "receiver.id", { unique: false });
                console.log("Index 'receiver.id' created");
            }

        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject("Error opening DB: " + event.target.errorCode);
        };
    });
}

export async function getFromAll(indexName, value) {
    const db = await openChatDB(); // uses the latest version with all indexes
    return new Promise((resolve, reject) => {
        const tx = db.transaction("chats", "readonly");
        const store = tx.objectStore("chats");

        if (!store.indexNames.contains(indexName)) {
            return reject(`Index '${indexName}' not found`);
        }

        const index = store.index(indexName);
        const request = index.getAll(value);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject("Error reading from index: " + request.error);
        };
    });
}