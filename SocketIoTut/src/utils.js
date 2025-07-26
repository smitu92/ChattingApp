import { userDb } from "../IndexDb/user.js";


const dummyUsers = [
  {
    username: "Alice Johnson",
    userId: "user_001",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🦊",
  },
  {
    username: "Bob Smith",
    userId: "user_002",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐻",
  },
  {
    username: "Charlie Chen",
    userId: "user_003",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐯",
  },
  {
    username: "Dana White",
    userId: "user_004",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐱",
  },
  {
    username: "Ethan Hawke",
    userId: "user_005",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🦁",
  },
  {
    username: "Fiona Blue",
    userId: "user_006",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🦋",
  },
  {
    username: "George Green",
    userId: "user_007",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐸",
  },
  {
    username: "Hannah Gray",
    userId: "user_008",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐨",
  },
  {
    username: "Isaac Lin",
    userId: "user_009",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🦉",
  },
  {
    username: "Jade Moon",
    userId: "user_010",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐼",
  },
  {
    username: "Kevin Doe",
    userId: "user_011",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🦖",
  },
  {
    username: "Lily Zhao",
    userId: "user_012",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🦢",
  },
  {
    username: "Max Power",
    userId: "user_013",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐺",
  },
  {
    username: "Nina Rose",
    userId: "user_014",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐰",
  },
  {
    username: "Oscar King",
    userId: "user_015",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐵",
  },
  {
    username: "Paula Dean",
    userId: "user_016",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐧",
  },
  {
    username: "Quincy Vega",
    userId: "user_017",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🦄",
  },
  {
    username: "Rachel Kim",
    userId: "user_018",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🦊",
  },
  {
    username: "Steve Hill",
    userId: "user_019",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🐳",
  },
  {
    username: "Tina Snow",
    userId: "user_020",
    chatList: [],
    createdAt: new Date().toISOString(),
    profile: "🕊️",
  },
];

export default async function addUserdb() {
   
    dummyUsers.forEach(async user => {
     await userDb.addUser(user);
});
}
addUserdb();
