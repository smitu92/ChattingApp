// src/stores/testStore.js
import {create} from "zustand";

export const useTestStore = create((set, get) => ({
  // unique id helps detect duplicate instances in console
  _storeId: Math.random().toString(36).slice(2,9),
  user: { id: 1, name: "alice", email: "a@x.com" },
  setUser: (u) => set({ user: u }), // replace
  updateUser: (partial) => set((s) => ({ user: { ...(s.user || {}), ...partial } })),
}));
