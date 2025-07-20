import { openDB } from 'idb';
import { demo2, demo3 } from './Chat';

// demo1: Getting started

// ✅ Better: make demo1 async and wait for DB to open
async function demo1() {
  const db1 = await openDB('db1', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('store1')) {
        db.createObjectStore('store1');
      }
      if (!db.objectStoreNames.contains('store2')) {
        db.createObjectStore('store2');
      }
    },
  });

  const db2 = await openDB('db2', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('store3')) {
        db.createObjectStore('store3', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('store4')) {
       const store= db.createObjectStore('store4', { autoIncrement: true });
       store.createIndex("TestIndex","test index");
      }
      
    },
  });

  console.log('Databases initialized:', db1.name, db2.name);
}

function MainDb() {
  (async ()=>{
       await  demo1();
        demo2();
       demo3();
  })();
      
      
}

export default MainDb;