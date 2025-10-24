export const seedChats = [
  {
    id: "1",
    name: "Retro Designers",
    status: "online",
    avatar: "🎨",
    messages: [
      { id: "m1", from: "them", text: "Welcome to DesignerCC!", ts: Date.now() - 600000 },
      { id: "m2", from: "me", text: "Everything the same but the name? 😂", ts: Date.now() - 580000 },
    ],
  },
  {
    id: "2",
    name: "Build Buddies",
    status: "away",
    avatar: "🛠️",
    messages: [
      { id: "m1", from: "them", text: "Ship UI Phase-1 today?", ts: Date.now() - 360000 },
      { id: "m2", from: "me", text: "On it. Retro vibes only.", ts: Date.now() - 300000 },
    ],
  },
  {
    id: "3",
    name: "Meme Dept.",
    status: "offline",
    avatar: "🤡",
    messages: [
      { id: "m1", from: "them", text: "Install Creative Clown loading…", ts: Date.now() - 7200000 },
    ],
  },
];