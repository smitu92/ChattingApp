// //this is guild for context API
// import React, { createContext, useContext, useState } from 'react';

// // 1. Create null context
// const CounterContext = createContext(null);

// // 2. Provider component
// function CounterProvider({ children }) {
//   const [count, setCount] = useState(0);
  
//   const value = { count, setCount };
  
//   return (
//       <CounterContext.Provider value={value}>
//             {children}
//       </CounterContext.Provider>
//   );
// }

// // 3. Components that use context
// function Counter() {
//   const { count, setCount } = useContext(CounterContext);
//   console.log(useContext(CounterContext));
//   console.log(CounterContext)
//   return (
//     <div>
//       <h2>Count: {count}</h2>
//       <button onClick={() => setCount(count + 1)}>+</button>
//       <button onClick={() => setCount(count - 1)}>-</button>
//     </div>
//   );
// }

// function DisplayCount() {
//   const { count } = useContext(CounterContext);
  
//   return <p>Current count is: {count}</p>;
// }

// // 4. Main App with wrapper
// export default function Guild1() {
//   return (
//     <CounterProvider> {/* 👈 Wrapper provides data */}
//       <h1>Counter App</h1>
//       <Counter />      {/* 👈 Can access count */}
//       <DisplayCount /> {/* 👈 Can also access count */}
//     </CounterProvider>
//   );
// }

import Dexie from 'dexie';
import { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
const db=new Dexie("TestDB");
  db.version(1).stores({
            items:"id,ProductName,price",
            user:'id,userName,email'
        });
const ThemeContext = createContext(null);

export default function Guild1() {
    useEffect(()=>{
        (async () => {
      
        // await  db.items.add({id:crypto.randomUUID(),ProductName:"chocklatedf",price:840});
        // await db.user.add({id:crypto.randomUUID(),userName:"smitP",email:"smitopdfatel@mdads"});
// Get by primary key
const user = await db.user.get("dsfds");

// Get first record
// const firstUser = await db.user.orderBy('name').first();

// Count records
const userCount = await db.user.count();
  console.log(user,userCount);
  Dexie.delete("FriendDatabase");
  db.delete().then(() => {
    console.log("Database successfully deleted");
}).catch((err) => {
    console.error("Could not delete database");
}).finally(() => {
    // Do what should be done next...
});

        })()
       
    })
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
    const fun=()=>{
        console.log("hello");
    }
  return (
    <Panel title="Welcome">
        dsfdsf
      <Button fun={fun}>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className =  theme==="dark" ? "bg-grey": "bg-white" ;
  console.log(children);
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children ,fun}) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  console.log(children)
   
  // ✅ Only call if fun exists
  if (fun) {
    fun();
  }
  return (
    <button className={className}>
      {children}
    </button>
  );
}
