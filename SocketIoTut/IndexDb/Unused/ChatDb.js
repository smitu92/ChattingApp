import { openDB } from 'idb';

export const ChatDB = {
  db: null,

  async init() {
    this.db = await openDB('chat-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('chats')) {
          const store = db.createObjectStore('chats', {
            keyPath: 'id', // UUID or timestamp
            autoIncrement: false,
          });

          // Create useful indexes
          store.createIndex('sender', 'sender');
          store.createIndex('receiver', 'receiver');
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('sender_receiver', ['sender', 'receiver']);
        }
      },

    });
  },


  async addChat(messageObj) {
    return this.db.add('chats', messageObj);
  },

  async getAllChats() {
    return this.db.getAll('chats');
  },
//   async getChatsBySender(sender) {
//     return this.db.getAllFromIndex('chats', 'sender', sender);
//   },

//   async getChatsByReceiver(receiver) {
//     return this.db.getAllFromIndex('chats', 'receiver', receiver);
//   },

//   async getChatsBetweenUsers(sender, receiver) {
//     return this.db.getAllFromIndex('chats', 'sender_receiver', [sender, receiver]);
//   },
};
