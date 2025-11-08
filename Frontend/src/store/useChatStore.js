
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// useChatStore.js - UPDATE IMPORTS AT TOP

import { 
  loadSavedMessages, 
  saveSavedMessage, 
  saveMessage,
  loadRoomsFromDexie,
  getCachedUserInfo,
  loadMessagesFromDexie  // ✅ ADD THIS
} from '../../services/controllers/chatController.js';

import apiClient from '../../services/axios/api.js';
import inxdb from '../db/dexieDbs/index.js';

const SAVED_MESSAGES_CHAT = {
  id: "saved_messages",
  peerId: "self",
  isSaved: true,
  messages: []
};

export const useChatStore = create(
  devtools(
    (set, get) => ({
      // STATE
      chats: [SAVED_MESSAGES_CHAT],
      savedMessages: [],
      activeId: "saved_messages",
      previewChat: null,
      search: "",
      profileUser: null,
      showPicker: false,

      // COMPUTED
      getActiveChat: () => {
        const { activeId, chats, savedMessages, previewChat } = get();
        if (activeId === "saved_messages") {
          return { ...SAVED_MESSAGES_CHAT, messages: savedMessages };
        }
        if (activeId?.startsWith("preview_")) {
          return previewChat;
        }
        return chats.find(c => c.id === activeId) || null;
      },

      getFilteredChats: () => {
        const { chats, search } = get();
        if (!search.trim()) return chats;
        const q = search.toLowerCase();
        return chats.filter(chat => chat.peerId?.toLowerCase().includes(q));
      },

      getExistingPeerIds: () => {
        const { chats } = get();
        return new Set(chats.map(c => c.peerId));
      },

      // BASIC SETTERS
      setActiveId: (id) => set({ activeId: id }),
      setSearch: (search) => set({ search }),
      setProfileUser: (user) => set({ profileUser: user }),
      setShowPicker: (show) => set({ showPicker: show }),
      
      // CHAT MANAGEMENT
// In useChatStore.js - REPLACE pickChat

pickChat: async (chatId,userId) => {
  set({ activeId: chatId });

 console.log('🔍 pickChat called with:', { chatId, userId });
  
  // Load messages if real chat (not saved messages or preview)
  if (chatId !== "saved_messages" && !chatId.startsWith("preview_")) {
    const chat = get().chats.find(c => c.id === chatId);
    
    // Only load if chat exists and has no messages
    if (chat && (!chat.messages || chat.messages.length === 0)) {
      console.log('📥 Loading messages from Dexie for:', chatId);
      
      try {
        // // Get current user ID from appStore
        // const userState = window.useAppStore?.getState();
        // const userId = userState?.user?._id;
        
        if (!userId) {
          console.error('❌ No user ID found');
          return;
        }
        
        // ✅ Load from Dexie instead of API
        const messages = await loadMessagesFromDexie(chatId, userId);
        
        console.log(`✅ Loaded ${messages.length} messages from Dexie`);
        
        // Update chat with messages
        set(state => ({
          chats: state.chats.map(c => 
            c.id === chatId 
              ? { ...c, messages } 
              : c
          )
        }));
        
      } catch (err) {
        console.error('❌ Failed to load messages from Dexie:', err);
      }
    }
  }
},

     // useChatStore.js - UPDATE loadRoomsFromDexie

loadRoomsFromDexie: async (userId) => {
  try {
    console.log('📂 Loading rooms from Dexie...');
    const dexieRooms = await loadRoomsFromDexie();
    
    if (dexieRooms.length === 0) {
      console.log('⚠️ No rooms in Dexie');
      return;
    }

    const transformedChats = await Promise.all(
      dexieRooms.map(async (room) => {
        const peerId = room.participants.find(p => p !== userId);
        const userInfo = await getCachedUserInfo(peerId);
        
        // ✅ FIX: Load messages to get lastMessage
        const messages = await loadMessagesFromDexie(room._id, userId);
        const lastMessage = messages[messages.length - 1];
        
        return {
          id: room._id,
          peerId: peerId,
          messages: messages,  // ✅ Include messages
          userData: userInfo ? {
            _id: userInfo._id,
            username: userInfo.username,
            avatar: userInfo.picture,
            bio: userInfo.bio
          } : null,
          lastMessage: lastMessage?.text || room.lastMessage || null,  // ✅ Use actual last message
          lastupdated: lastMessage?.ts || room.lastupdated || null
        };
      })
    );

    set({ chats: [SAVED_MESSAGES_CHAT, ...transformedChats] });
    console.log('✅ Loaded', transformedChats.length, 'rooms with messages');
  } catch (error) {
    console.error('❌ Failed to load rooms from Dexie:', error);
  }
},

      // LOAD DATA
      loadUserRooms: async (userId, accessToken) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/rooms/user/${userId}`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
          );

          if (!response.ok) throw new Error('Failed to load rooms');
          const { rooms } = await response.json();

          const transformedChats = rooms.map(room => ({
            id: room._id,
            peerId: room.participants.find(p => p !== userId),
            messages: [],
            unreadCount: room.unreadCount || 0,
            isPinned: room.isPinned || false,
            isMuted: room.isMuted || false,
            lastMessage: room.lastMessage || null
          }));

          set({ chats: [SAVED_MESSAGES_CHAT, ...transformedChats] });
        } catch (error) {
          console.error('❌ Failed to load rooms:', error);
        }
      },

      loadSavedMessagesAction: async (userId) => {
        try {
          const messages = await loadSavedMessages(userId);
          set({ savedMessages: messages });
          console.log('📌 Loaded', messages.length, 'saved messages');
        } catch (err) {
          console.error('❌ Failed to load saved messages:', err);
        }
      },

      loadChatHistoryAction: async (roomId, userId, accessToken) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/messages/rooms/${roomId}`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
          );

          if (!response.ok) throw new Error('Failed to load messages');
          const { messages } = await response.json();

          const formatted = messages.map(msg => ({
            id: msg._id,
            from: msg.senderId === userId ? 'me' : 'them',
            text: msg.text,
            file: msg.file || null,
            ts: msg.sentTime
          }));

          set(state => ({
            chats: state.chats.map(c => 
              c.id === roomId ? { ...c, messages: formatted } : c
            )
          }));
        } catch (err) {
          console.error('❌ Failed to load chat history:', err);
        }
      },

      // START CHAT
      startChatWithUser: (selectedUser) => {
        console.log("📞 Starting chat with:", selectedUser);

        const existing = get().chats.find(
          c => c.peerId === selectedUser._id || c.peerId === selectedUser.id
        );
        
        if (existing) {
          console.log("✅ Chat already exists:", existing.id);
          get().pickChat(existing.id);
          set({ showPicker: false });
          return;
        }

        const previewId = `preview_${selectedUser._id || selectedUser.id}`;
        const preview = {
          id: previewId,
          peerId: selectedUser._id || selectedUser.id,
          messages: [],
          isPreview: true,
          userData: {
            _id: selectedUser._id,
            username: selectedUser.username,
            avatar: selectedUser.avatar,
            bio: selectedUser.bio,
            email: selectedUser.email,
            status: "online"
          }
        };

        set({ previewChat: preview, activeId: previewId, showPicker: false });
      },

      // CREATE ROOM
      createRoomForPreview: async (peerId, userId) => {
        try {
          const response = await apiClient.post("/room/create", { peerId, userId });
          
          if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed to create room');
          }

          const { roomId, isNew } = response.data;
          console.log(`✅ Room ${isNew ? 'created' : 'found'}:`, roomId);
          return roomId;
        } catch (error) {
          console.error('❌ Failed to create room:', error);
          throw error;
        }
      },

      // SEND MESSAGES
      sendSavedMessage: async (text, file, userId) => {
        const timestamp = Date.now();
        const messageId = `sm_${userId}_${timestamp}`;

        const newMessage = {
          id: messageId,
          from: "me",
          text,
          file: file || null,
          ts: timestamp
        };

        set(state => ({ savedMessages: [...state.savedMessages, newMessage] }));

        try {
          await saveSavedMessage(messageId, userId, text, file, timestamp);
        } catch (err) {
          console.error("❌ Failed to save message:", err);
        }
      },

      sendRegularMessage: async (roomId, text, file, userId) => {
        const timestamp = Date.now();
        const messageId = `m_${timestamp}`;

        const newMessage = {
          id: messageId,
          from: "me",
          text,
          file: file || null,
          ts: timestamp
        };

        set(state => ({
          chats: state.chats.map(c => 
            c.id === roomId ? { ...c, messages: [...c.messages, newMessage] } : c
          )
        }));

        try {
          await saveMessage(messageId, userId, roomId, text, file, timestamp);
        } catch (err) {
          console.warn("Failed to save to Dexie:", err);
        }

        return newMessage;
      },

      // RECEIVE MESSAGES
      receiveMessage: async (data, userId) => {
        console.log('📨 New message received:', data);

        const newMessage = {
          id: data.messageId,
          from: data.senderId === userId ? 'me' : 'them',
          text: data.text,
          file: data.file || null,
          ts: data.timestamp
        };

        set(state => ({
          chats: state.chats.map(chat => 
            chat.id === data.roomId
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          )
        }));

        if (data.roomId !== 'saved_messages') {
          try {
            await saveMessage(
              data.messageId,
              data.senderId,
              data.roomId,
              data.text,
              data.file,
              data.timestamp
            );
          } catch (err) {
            console.warn('Failed to save received message:', err);
          }
        }
      },
      // In useChatStore.js - ADD THIS ACTION

deleteChat: async (chatId, userId) => {
  try {
    console.log('🗑️ Deleting chat:', chatId);

    // Remove from Dexie
    await inxdb.chatListidx.delete(chatId);
    
    // Remove messages from Dexie
    await inxdb.messages.where('roomId').equals(chatId).delete();

    // Remove from chatStore
    set(state => ({
      chats: state.chats.filter(c => c.id !== chatId),
      activeId: state.activeId === chatId ? "saved_messages" : state.activeId
    }));

    console.log('✅ Chat deleted successfully');
  } catch (error) {
    console.error('❌ Failed to delete chat:', error);
    throw error;
  }
},


      // CANCEL PREVIEW
      cancelPreview: () => {
        set({ previewChat: null, activeId: "saved_messages" });
      },
    }),
    { name: 'ChatStore' }
  )
);

if (typeof window !== 'undefined') {
  window.checkChatStore = () => console.log('Chat Store State:', useChatStore.getState());
}
