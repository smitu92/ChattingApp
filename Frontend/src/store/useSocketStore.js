// src/store/socketStore.js
import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useSocketStore = create((set, get) => ({
    // State
    socket: null,
    isConnected: false,
    isConnecting: false,
    
    // Actions
    connect: (userId, accessToken) => {
        const { socket: existingSocket } = get(); //to check socket object to see it has it existing socket
        
        // Don't reconnect if already connected
        if (existingSocket?.connected) {
            console.log('⚠️ Socket already connected');
            return;
        }

        set({ isConnecting: true });

        // Create socket connection
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            auth: { token: accessToken },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            query: { userId } // Send userId in connection
        });

        // Connection events
        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            set({ isConnected: true, isConnecting: false });
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
            set({ isConnected: false });
        });

        socket.on('connect_error', (error) => {
            console.error('🔴 Socket connection error:', error);
            set({ isConnecting: false });
        });

        socket.on('reconnect_attempt', (attempt) => {
            console.log(`🔄 Reconnection attempt ${attempt}`);
        });

        socket.on('reconnect', () => {
            console.log('✅ Socket reconnected');
            set({ isConnected: true });
        });

        set({ socket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            console.log('Disconnecting socket...');
            socket.disconnect();
            set({ socket: null, isConnected: false, isConnecting: false });
        }
    },

    // Helper methods for emitting events
    emit: (event, data) => {
        const { socket, isConnected } = get();
        if (!socket || !isConnected) {
            console.warn('⚠️ Cannot emit - socket not connected');
            return false;
        }
        socket.emit(event, data);
        return true;
    },

    joinRoom: (roomId, userId) => {
        const { emit } = get();
        return emit('joinRoom', { roomId, userId });
    },

    sendMessage: (messageData) => {
        const { emit } = get();
        return emit('sendMessage', messageData);
    },

    // Listen to events (called from components)
    on: (event, callback) => {
        const { socket } = get();
        if (!socket) {
            console.warn('⚠️ Socket not initialized');
            return;
        }
        socket.on(event, callback);
    },

    off: (event, callback) => {
        const { socket } = get();
        if (!socket) return;
        socket.off(event, callback);
    }
}));
