// // src/stores/authStore.js
// import { create } from "zustand";
// import { devtools } from "zustand/middleware";

//  export const useAppStore = create(
//   devtools((set, get) => ({
//     // --- State ---
//     user: null,
//     accessToken: null,

//     // --- Actions ---
//     setUser: (user) => set({ user }),

//     // merge new fields into existing user object
//     updateUser: (partial) =>
//       set((state) => ({
//         user: { ...(state.user || {}), ...partial },
//       })),

//     setAccessToken: (token) => set({ accessToken: token }),

//     clearAuth: () => set({ user: null, accessToken: null }),
//   }))
// );

// // Debug: detect duplicate store instances
// if (typeof window !== "undefined") {
//   window.__AUTH_STORE_ID__ = window.__AUTH_STORE_ID__ || Math.random().toString(36).slice(2, 7);
//   console.log("✅ useAuthStore loaded (ID =", window.__AUTH_STORE_ID__, ")");
// }

// src/store/appStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Global singleton key
const STORE_KEY = "__APP_STORE_SINGLETON__";

// Check if store already exists globally
if (typeof window !== "undefined" && !window[STORE_KEY]) {
  window[STORE_KEY] = create(
    devtools((set, get) => ({
      user: null,
      accessToken: null,
      setUser: (user) => {
        console.log("🔵 setUser called:", user);
        set({ user });
        console.log("🔵 After set, store now has:", get().user);
      },
      updateUser: (partial) => {
        console.log("🟡 updateUser called:", partial);
        set((state) => ({
          user: { ...(state.user || {}), ...partial },
        }));
        console.log("🟡 After update, store now has:", get().user);
      },
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () => set({ user: null, accessToken: null }),
    }))
  );
  console.log("✅ Store created ONCE (first time)");
} else if (typeof window !== "undefined") {
  console.log("⚠️ Store module re-imported, reusing existing store");
}

// Always export the same instance
export const useAppStore = typeof window !== "undefined" 
  ? window[STORE_KEY] 
  : create(() => ({}));