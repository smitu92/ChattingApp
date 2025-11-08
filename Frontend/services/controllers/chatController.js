// // services/offline/controllers/chatController.js - DEXIE OPERATIONS

// import inxdb from "../../src/db/dexieDbs";


// /**
//  * Load saved messages for a user
//  * @param {string} userId - User ID
//  * @returns {Promise<Array>} Array of formatted messages
//  */
// export async function loadSavedMessages(userId) {
//   try {
//     const messages = await inxdb.messages
//       .where('roomId')
//       .equals('saved_messages')
//       .and(msg => msg.senderId === userId)
//       .sortBy('sentTime');

//     return messages.map(msg => ({
//       id: msg._id,
//       from: 'me',
//       text: msg.text,
//       file: msg.file || null,
//       ts: msg.sentTime
//     }));
//   } catch (error) {
//     console.error('❌ loadSavedMessages error:', error);
//     return [];
//   }
// }

// /**
//  * Save a message to saved messages
//  * @param {string} messageId - Message ID
//  * @param {string} userId - User ID
//  * @param {string} text - Message text
//  * @param {any} file - File attachment (optional)
//  * @param {number} timestamp - Timestamp
//  */
// export async function saveSavedMessage(messageId, userId, text, file, timestamp) {
//   try {
//     await inxdb.messages.add({
//       _id: messageId,
//       senderId: userId,
//       receiverId: userId,
//       roomId: 'saved_messages',
//       text: text || '',
//       file: file || null,
//       sentTime: timestamp,
//       receivedTime: timestamp
//     });
//   } catch (error) {
//     console.error('❌ saveSavedMessage error:', error);
//     throw error;
//   }
// }

// /**
//  * Load chat history from IndexedDB
//  * @param {string} roomId - Room ID
//  * @returns {Promise<Array>} Array of messages
//  */
// export async function loadChatHistory(roomId) {
//   try {
//     const messages = await inxdb.messages
//       .where('roomId')
//       .equals(roomId)
//       .sortBy('sentTime');

//     return messages;
//   } catch (error) {
//     console.error('❌ loadChatHistory error:', error);
//     return [];
//   }
// }

// /**
//  * Save a regular message to IndexedDB
//  * @param {string} messageId - Message ID
//  * @param {string} senderId - Sender ID
//  * @param {string} roomId - Room ID
//  * @param {string} text - Message text
//  * @param {any} file - File attachment (optional)
//  * @param {number} timestamp - Timestamp
//  */
// export async function saveMessage(messageId, senderId, roomId, text, file, timestamp) {
//   try {
//     await inxdb.messages.add({
//       _id: messageId,
//       senderId: senderId,
//       roomId: roomId,
//       text: text || '',
//       file: file || null,
//       sentTime: timestamp,
//       receivedTime: null
//     });
//   } catch (error) {
//     console.error('❌ saveMessage error:', error);
//     throw error;
//   }
// }

// // chatController.js

// /**
//  * Check if a room exists with a specific participant
//  * @param {string} peerId - Peer user ID
//  * @returns {Promise<string|null>} Room ID if exists, null otherwise
//  */
// export async function checkRoomExistsByParticipant(peerId) {
//   try {
//     // Get all rooms
//     const allRooms = await inxdb.chatListidx.toArray();
    
//     // Find room where peerId is a participant
//     const room = allRooms.find(r => 
//       r.participants && r.participants.includes(peerId)
//     );
    
//     if (room) {
//       console.log('✅ Found existing room with participant:', room._id);
//       return room._id;  // Return the roomId
//     }
    
//     console.log('⚠️ No room found for participant:', peerId);
//     return null;
    
//   } catch (error) {
//     console.error('❌ checkRoomExistsByParticipant error:', error);
//     return null;
//   }
// }


// /**
//  * Check if a room exists in chatList
//  * @param {string} roomId - Room ID to check
//  * @returns {Promise<boolean>} True if room exists
//  */
// export async function checkRoomExists(roomId) {
//   try {
//     const room = await inxdb.chatListidx.get(roomId);
//     return !!room;
//   } catch (error) {
//     console.error('❌ checkRoomExists error:', error);
//     return false;
//   }
// }



// /**
//  * Add room to chatList (with duplicate handling)
//  * @param {string} roomId - Room ID
//  * @param {Array<string>} participants - Array of participant IDs
//  * @param {string} lastMessage - Last message text
//  * @param {number} timestamp - Last updated timestamp
//  */
// export async function addRoomToChatList(roomId, participants, lastMessage = '', timestamp = Date.now()) {
//   try {
//     // Check if already exists
//     const exists = await inxdb.chatListidx.get(roomId);
    
//     if (exists) {
//       console.log('⚠️ Room already exists, updating instead:', roomId);
      
//       // Update existing
//       await inxdb.chatListidx.update(roomId, {
//         lastMessage: lastMessage,
//         lastupdated: timestamp
//       });
      
//       console.log('✅ Updated existing room in chatList:', roomId);
//       return;
//     }

//     // Add new
//     await inxdb.chatListidx.add({
//       _id: roomId,
//       participants: participants,
//       lastMessage: lastMessage,
//       lastupdated: timestamp
//     });
    
//     console.log('✅ Added new room to chatList:', roomId);
    
//   } catch (error) {
//     console.error('❌ addRoomToChatList error:', error);
//     throw error;
//   }
// }


// /**
//  * Update last message in chatList
//  * @param {string} roomId - Room ID
//  * @param {string} lastMessage - Last message text
//  * @param {number} timestamp - Timestamp
//  */
// export async function updateChatListLastMessage(roomId, lastMessage, timestamp) {
//   try {
//     await inxdb.chatListidx.update(roomId, {
//       lastMessage: lastMessage,
//       lastupdated: timestamp
//     });
//   } catch (error) {
//     console.error('❌ updateChatListLastMessage error:', error);
//   }
// }

// /**
//  * Cache user info in users store
//  * @param {Object} userData - User data object
//  */
// export async function cacheUserInfo(userData) {
//   try {
//     const userRecord = {
//       _id: String(userData._id),
//       username: userData.username || 'Unknown',
//       picture: userData.avatar || null,
//       bio: userData.bio || '',
//       lastSeen: null,
//     };

//     const existing = await inxdb.users.get(userRecord._id);
    
//     if (!existing) {
//       await inxdb.users.add(userRecord);
//       console.log('✅ Cached user info:', userRecord._id);
//     }
//   } catch (error) {
//     console.error('❌ cacheUserInfo error:', error);
//   }
// }



// // services/controllers/chatController.js - COMPLETE WITH ALL FIXES

// import inxdb from "../../src/db/dexieDbs";

// /**
//  * Load saved messages for a user
//  */
// export async function loadSavedMessages(userId) {
//   try {
//     const messages = await inxdb.messages
//       .where('roomId')
//       .equals('saved_messages')
//       .and(msg => msg.senderId === userId)
//       .sortBy('sentTime');

//     return messages.map(msg => ({
//       id: msg._id,
//       from: 'me',
//       text: msg.text,
//       file: msg.file || null,
//       ts: msg.sentTime
//     }));
//   } catch (error) {
//     console.error('❌ loadSavedMessages error:', error);
//     return [];
//   }
// }

// /**
//  * Save a message to saved messages
//  */
// export async function saveSavedMessage(messageId, userId, text, file, timestamp) {
//   try {
//     await inxdb.messages.add({
//       _id: messageId,
//       senderId: userId,
//       receiverId: userId,
//       roomId: 'saved_messages',
//       text: text || '',
//       file: file || null,
//       sentTime: timestamp,
//       receivedTime: timestamp
//     });
//   } catch (error) {
//     console.error('❌ saveSavedMessage error:', error);
//     throw error;
//   }
// }

// /**
//  * Load chat history from IndexedDB
//  */
// export async function loadChatHistory(roomId) {
//   try {
//     const messages = await inxdb.messages
//       .where('roomId')
//       .equals(roomId)
//       .sortBy('sentTime');

//     return messages;
//   } catch (error) {
//     console.error('❌ loadChatHistory error:', error);
//     return [];
//   }
// }

// /**
//  * Save a regular message to IndexedDB
//  */
// export async function saveMessage(messageId, senderId, roomId, text, file, timestamp) {
//   try {
//     await inxdb.messages.add({
//       _id: messageId,
//       senderId: senderId,
//       roomId: roomId,
//       text: text || '',
//       file: file || null,
//       sentTime: timestamp,
//       receivedTime: null
//     });
//   } catch (error) {
//     console.error('❌ saveMessage error:', error);
//     throw error;
//   }
// }

// /**
//  * Check if a room exists with a specific participant
//  */
// export async function checkRoomExistsByParticipant(peerId) {
//   try {
//     const allRooms = await inxdb.chatListidx.toArray();
//     const room = allRooms.find(r => 
//       r.participants && r.participants.includes(peerId)
//     );
    
//     if (room) {
//       console.log('✅ Found existing room with participant:', room._id);
//       return room._id;
//     }
    
//     console.log('⚠️ No room found for participant:', peerId);
//     return null;
//   } catch (error) {
//     console.error('❌ checkRoomExistsByParticipant error:', error);
//     return null;
//   }
// }

// /**
//  * Check if a room exists by roomId
//  */
// export async function checkRoomExists(roomId) {
//   try {
//     const room = await inxdb.chatListidx.get(roomId);
//     return !!room;
//   } catch (error) {
//     console.error('❌ checkRoomExists error:', error);
//     return false;
//   }
// }

// /**
//  * Add room to chatList (with duplicate handling)
//  */
// export async function addRoomToChatList(roomId, participants, lastMessage = '', timestamp = Date.now()) {
//   try {
//     const exists = await inxdb.chatListidx.get(roomId);
    
//     if (exists) {
//       console.log('⚠️ Room already exists, updating instead:', roomId);
//       await inxdb.chatListidx.update(roomId, {
//         lastMessage: lastMessage,
//         lastupdated: timestamp
//       });
//       console.log('✅ Updated existing room in chatList:', roomId);
//       return;
//     }

//     await inxdb.chatListidx.add({
//       _id: roomId,
//       participants: participants,
//       lastMessage: lastMessage,
//       lastupdated: timestamp
//     });
    
//     console.log('✅ Added new room to chatList:', roomId);
//   } catch (error) {
//     console.error('❌ addRoomToChatList error:', error);
//     throw error;
//   }
// }

// /**
//  * Update last message in chatList
//  */
// export async function updateChatListLastMessage(roomId, lastMessage, timestamp) {
//   try {
//     await inxdb.chatListidx.update(roomId, {
//       lastMessage: lastMessage,
//       lastupdated: timestamp
//     });
//   } catch (error) {
//     console.error('❌ updateChatListLastMessage error:', error);
//   }
// }

// /**
//  * Cache user info in users store
//  */
// export async function cacheUserInfo(userData) {
//   try {
//     const userRecord = {
//       _id: String(userData._id),
//       username: userData.username || 'Unknown',
//       picture: userData.avatar || null,
//       bio: userData.bio || '',
//       lastSeen: null,
//     };

//     const existing = await inxdb.users.get(userRecord._id);
    
//     if (!existing) {
//       await inxdb.users.add(userRecord);
//       console.log('✅ Cached user info:', userRecord._id);
//     }
//   } catch (error) {
//     console.error('❌ cacheUserInfo error:', error);
//   }
// }

// /**
//  * ✅ NEW: Load all rooms from Dexie
//  */
// export async function loadRoomsFromDexie() {
//   try {
//     const rooms = await inxdb.chatListidx.toArray();
//     console.log('✅ Loaded rooms from Dexie:', rooms.length);
//     return rooms;
//   } catch (error) {
//     console.error('❌ loadRoomsFromDexie error:', error);
//     return [];
//   }
// }

// /**
//  * ✅ NEW: Get cached user info
//  */
// export async function getCachedUserInfo(userId) {
//   try {
//     const user = await inxdb.users.get(userId);
//     return user || null;
//   } catch (error) {
//     console.error('❌ getCachedUserInfo error:', error);
//     return null;
//   }
// }

// services/controllers/chatController.js - COMPLETE CLEAN VERSION

import inxdb from "../../src/db/dexieDbs";

// ============================================
// SAVED MESSAGES
// ============================================
export async function loadSavedMessages(userId) {
  try {
    const messages = await inxdb.messages
      .where('roomId')
      .equals('saved_messages')
      .and(msg => msg.senderId === userId)
      .sortBy('sentTime');

    return messages.map(msg => ({
      id: msg._id,
      from: 'me',
      text: msg.text,
      file: msg.file || null,
      ts: msg.sentTime
    }));
  } catch (error) {
    console.error('❌ loadSavedMessages error:', error);
    return [];
  }
}

export async function saveSavedMessage(messageId, userId, text, file, timestamp) {
  try {
    await inxdb.messages.add({
      _id: messageId,
      senderId: userId,
      receiverId: userId,
      roomId: 'saved_messages',
      text: text || '',
      file: file || null,
      sentTime: timestamp,
      receivedTime: timestamp
    });
  } catch (error) {
    console.error('❌ saveSavedMessage error:', error);
    throw error;
  }
}

// ============================================
// REGULAR MESSAGES
// ============================================
export async function saveMessage(messageId, senderId, roomId, text, file, timestamp) {
  try {
    await inxdb.messages.add({
      _id: messageId,
      senderId: senderId,
      roomId: roomId,
      text: text || '',
      file: file || null,
      sentTime: timestamp,
      receivedTime: null
    });
    console.log('✅ Message saved to Dexie:', messageId);
  } catch (error) {
    console.error('❌ saveMessage error:', error);
    throw error;
  }
}

/**
 * ✅ Load messages for a specific room from Dexie
 */
export async function loadMessagesFromDexie(roomId, userId) {
  try {
    const messages = await inxdb.messages
      .where('roomId')
      .equals(roomId)
      .sortBy('sentTime');

    console.log(`📂 Loaded ${messages.length} messages from Dexie for room ${roomId}`);

    return messages.map(msg => ({
      id: msg._id,
      from: msg.senderId === userId ? 'me' : 'them',
      text: msg.text,
      file: msg.file || null,
      ts: msg.sentTime
    }));
  } catch (error) {
    console.error('❌ loadMessagesFromDexie error:', error);
    return [];
  }
}

// ============================================
// ROOMS
// ============================================
export async function checkRoomExistsByParticipant(peerId) {
  try {
    const allRooms = await inxdb.chatListidx.toArray();
    const room = allRooms.find(r => 
      r.participants && r.participants.includes(peerId)
    );
    
    if (room) {
      console.log('✅ Found existing room with participant:', room._id);
      return room._id;
    }
    
    console.log('⚠️ No room found for participant:', peerId);
    return null;
  } catch (error) {
    console.error('❌ checkRoomExistsByParticipant error:', error);
    return null;
  }
}

export async function checkRoomExists(roomId) {
  try {
    const room = await inxdb.chatListidx.get(roomId);
    return !!room;
  } catch (error) {
    console.error('❌ checkRoomExists error:', error);
    return false;
  }
}

export async function addRoomToChatList(roomId, participants, lastMessage = '', timestamp = Date.now()) {
  try {
    const exists = await inxdb.chatListidx.get(roomId);
    
    if (exists) {
      console.log('⚠️ Room already exists, updating instead:', roomId);
      await inxdb.chatListidx.update(roomId, {
        lastMessage: lastMessage,
        lastupdated: timestamp
      });
      return;
    }

    await inxdb.chatListidx.add({
      _id: roomId,
      participants: participants,
      lastMessage: lastMessage,
      lastupdated: timestamp
    });
    
    console.log('✅ Added new room to chatList:', roomId);
  } catch (error) {
    console.error('❌ addRoomToChatList error:', error);
    throw error;
  }
}

export async function updateChatListLastMessage(roomId, lastMessage, timestamp) {
  try {
    await inxdb.chatListidx.update(roomId, {
      lastMessage: lastMessage,
      lastupdated: timestamp
    });
  } catch (error) {
    console.error('❌ updateChatListLastMessage error:', error);
  }
}

export async function loadRoomsFromDexie() {
  try {
    const rooms = await inxdb.chatListidx.toArray();
    console.log('✅ Loaded rooms from Dexie:', rooms.length);
    return rooms;
  } catch (error) {
    console.error('❌ loadRoomsFromDexie error:', error);
    return [];
  }
}

// ============================================
// USERS
// ============================================
export async function cacheUserInfo(userData) {
  try {
    const userRecord = {
      _id: String(userData._id),
      username: userData.username || 'Unknown',
      picture: userData.avatar || null,
      bio: userData.bio || '',
      lastSeen: null,
    };

    const existing = await inxdb.users.get(userRecord._id);
    
    if (!existing) {
      await inxdb.users.add(userRecord);
      console.log('✅ Cached user info:', userRecord._id);
    }
  } catch (error) {
    console.error('❌ cacheUserInfo error:', error);
  }
}

export async function getCachedUserInfo(userId) {
  try {
    const user = await inxdb.users.get(userId);
    return user || null;
  } catch (error) {
    console.error('❌ getCachedUserInfo error:', error);
    return null;
  }
}

