import { openDB } from 'idb';

// demo2: add some data into db1/store1/
export async function demo2() {
  const db1 = await openDB('db1', 1);
  db1.add('store1', 'hello world', 'message');
  db1.add('store1', true, 'delivered');
  db1.close();
}

// demo3: error handling
export async function demo3() {
  const db1 = await openDB('db1', 1);
  db1
    .add('store1', 'hello again!!', 'new message')
    .then(result => {
      console.log('success!', result);
    })
    .catch(err => {
      console.error('error: ', err);
    });
  db1.close();
}