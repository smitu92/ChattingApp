// // import { Outlet } from "react-router-dom";
// // import Sidebar from "../../components/Sidebar.jsx";
// // import { useEffect, useRef } from "react";
// // import { useAppStore } from "../../store/appStore.js";
// // import readData from "../../../services/offline/controllers/read.js";
// // import userIdx from "../../db/dexieDbs/userDB.js";


// // export default  function Applayout() {
// //     const hydrated = useRef(false);
// //     useEffect(()=>{
             
// //               if (hydrated.current) return;
// //               hydrated.current = true;
// //               (async ()=>{
// //                    try {
// //                        console.log("💧 Hydrating store from Dexie...");
// //                         const uid = localStorage.getItem("uId");
// //                         if (!uid) {
// //                             console.log("⚠️ No user ID found");
// //                             return;
// //                        }
// //                        // Load user from Dexie
// //                        const userData = await readData(userIdx, "user", uid);

// //                        if (userData) {
// //                            useAppStore.getState().setUser(userData);
// //                            console.log("✅ Store hydrated with user:", userData);
// //                        }
                     


// //                    } catch (error) {
// //                             console.error("❌ Failed to hydrate store:", error);
// //                    }
// //               })()

// //     },[])
    
// //     return(<div>

            
// //         <Sidebar/>
// //         <Outlet/>



// //     </div>)
// // }

// // src/pages/App/AppLayout.jsx
// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../../components/Sidebar.jsx";
// import { useEffect, useRef, useState } from "react";
// import { useAppStore } from "../../store/appStore.js";

// import  readData  from "../../../services/offline/controllers/read.js";
// import  userIdx  from "../../db/dexieDbs/userDB"; // adjust import path
// import RefreshTokenCall from "../../../services/Auth/RefreshTokenCall.js";

// export default function AppLayout() {
//   const navigate = useNavigate();
//   const [isHydrating, setIsHydrating] = useState(true);
//   const [error, setError] = useState(null);
//   const hydratedRef = useRef(false);

//   // Zustand actions
//   const setUser = useAppStore((s) => s.setUser);
//   const setAccessToken = useAppStore((s) => s.setAccessToken);
//   const user = useAppStore((s) => s.user);

//   useEffect(() => {
//     // Prevent double-run in React StrictMode
//     if (hydratedRef.current) return;
//     hydratedRef.current = true;

//     (async () => {
//       try {
//         console.log("🚀 AppLayout: Starting hydration...");

//         // 1️⃣ Get/Refresh Access Token
//         let token = useAppStore.getState().accessToken;
        
//         if (!token) {
//           console.log("🔑 No token found, refreshing...");
//           const res = await RefreshTokenCall();
          
//           if (!res?.accessToken) {
//             console.log("❌ No access token received, redirecting to login");
//             navigate("/auth/login");
//             return;
//           }
          
//           token = res.accessToken;
//           setAccessToken(token);
//           console.log("✅ Token refreshed");
//         }

//         // 2️⃣ Load User from Dexie
//         const uid = localStorage.getItem("uId");
        
//         if (!uid) {
//           console.log("⚠️ No user ID in localStorage, redirecting to login");
//           navigate("/auth/login");
//           return;
//         }

//         console.log("💾 Loading user from Dexie...");
//         const userData = await readData(userIdx, "user", uid);

//         if (!userData) {
//           console.log("⚠️ No user data found in Dexie, redirecting to login");
//           navigate("/auth/login");
//           return;
//         }

//         // 3️⃣ Hydrate Zustand Store
//         setUser(userData);
//         console.log("✅ Store hydrated with user:", userData);

//         // 4️⃣ Done!
//         setIsHydrating(false);

//       } catch (err) {
//         console.error("❌ Hydration error:", err);
//         setError(err.message);
//         setIsHydrating(false);
//         // Optionally redirect to login on error
//         // navigate("/auth/login");
//       }
//     })();
//   }, [navigate, setUser, setAccessToken]);

//   // 🔄 Token Refresh Interval (every 10 minutes)
//   useEffect(() => {
//     if (!user) return; // Only start refresh cycle if user exists

//     const refreshInterval = setInterval(async () => {
//       try {
//         console.log("🔄 Refreshing token (background)...");
//         const res = await RefreshTokenCall();
//         if (res?.accessToken) {
//           setAccessToken(res.accessToken);
//           console.log("✅ Token refreshed in background");
//         }
//       } catch (err) {
//         console.error("❌ Token refresh failed:", err);
//       }
//     }, 10 * 60 * 1000); // 10 minutes

//     return () => clearInterval(refreshInterval);
//   }, [user, setAccessToken]);

//   // 🎨 Loading Screen
//   if (isHydrating) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
//         <div className="text-center space-y-4">
//           <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
//           <div className="text-xl font-bold">Loading RetroChat OS...</div>
//           <div className="text-sm text-gray-600">Syncing your data</div>
//         </div>
//       </div>
//     );
//   }

//   // ❌ Error Screen
//   if (error) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-red-50">
//         <div className="max-w-md rounded-3xl border-2 border-red-600 bg-white p-6 shadow-xl text-center">
//           <div className="text-4xl mb-4">⚠️</div>
//           <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => navigate("/auth/login")}
//             className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Render App with Sidebar
//   return (
//     <div className="flex h-screen w-full">
//       <Sidebar />
//       <main className="flex-1 overflow-auto">
//         <Outlet />
//       </main>
//     </div>
//   );
// }



// src/pages/App/AppLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store/appStore.js";

import readData from "../../../services/controllers/offline/read.js";
import userIdx from "../../db/dexieDbs/userDB";
import RefreshTokenCall from "../../../services/Auth/RefreshTokenCall.js";
import { useSocketStore } from "../../store/useSocketStore.js";

export default function AppLayout() {
  const navigate = useNavigate();
  const [isHydrating, setIsHydrating] = useState(true);
  const [error, setError] = useState(null);
  const hydratedRef = useRef(false);

  // Zustand actions - App Store
  const setUser = useAppStore((s) => s.setUser);
  const setAccessToken = useAppStore((s) => s.setAccessToken);
  const user = useAppStore((s) => s.user);
  const accessToken = useAppStore((s) => s.accessToken);

  // 🔥 Zustand actions - Socket Store
  const { connect, disconnect, isConnected } = useSocketStore();

  // ============================================
  // 1️⃣ INITIAL HYDRATION (User + Token)
  // ============================================
  useEffect(() => {
    // Prevent double-run in React StrictMode
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    (async () => {
      try {
        console.log("🚀 AppLayout: Starting hydration...");

        // Get/Refresh Access Token
        let token = useAppStore.getState().accessToken;
        
        if (!token) {
          console.log("🔑 No token found, refreshing...");
          const res = await RefreshTokenCall();
          
          if (!res?.accessToken) {
            console.log("❌ No access token received, redirecting to login");
            navigate("/auth/login");
            return;
          }
          
          token = res.accessToken;
          setAccessToken(token);
          console.log("✅ Token refreshed");
        }

        // Load User from Dexie
        const uid = localStorage.getItem("uId");
        
        if (!uid) {
          console.log("⚠️ No user ID in localStorage, redirecting to login");
          navigate("/auth/login");
          return;
        }

        console.log("💾 Loading user from Dexie...");
        const userData = await readData(userIdx, "user", uid);

        if (!userData) {
          console.log("⚠️ No user data found in Dexie, redirecting to login");
          navigate("/auth/login");
          return;
        }

        // Hydrate Zustand Store
        setUser(userData);
        console.log("✅ Store hydrated with user:", userData);

        // Done!
        setIsHydrating(false);

      } catch (err) {
        console.error("❌ Hydration error:", err);
        setError(err.message);
        setIsHydrating(false);
      }
    })();
  }, [navigate, setUser, setAccessToken]);

  // ============================================
  // 2️⃣ SOCKET.IO CONNECTION (After user loaded)
  // ============================================
  useEffect(() => {
    if (!user?._id || !accessToken) {
      // Disconnect socket if user logs out
      disconnect();
      return;
    }

    // Connect socket when user is authenticated
    console.log("🔌 Connecting Socket.IO for user:", user.username);
    connect(user._id, accessToken);

    // Cleanup on unmount or user logout
    return () => {
      console.log("🔌 Disconnecting Socket.IO");
      disconnect();
    };
  }, [user?._id, accessToken, connect, disconnect]);

  // ============================================
  // 3️⃣ TOKEN REFRESH INTERVAL (Every 10 mins)
  // ============================================
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        console.log("🔄 Refreshing token (background)...");
        const res = await RefreshTokenCall();
        if (res?.accessToken) {
          setAccessToken(res.accessToken);
          console.log("✅ Token refreshed in background");
        }
      } catch (err) {
        console.error("❌ Token refresh failed:", err);
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, [user, setAccessToken]);

  // ============================================
  // 4️⃣ SOCKET CONNECTION STATUS LOG
  // ============================================
  useEffect(() => {
    if (isConnected) {
      console.log("🟢 Socket.IO connected and ready");
    } else if (user?._id) {
      console.log("🟡 Socket.IO disconnected");
    }
  }, [isConnected, user?._id]);

  // ============================================
  // 🎨 LOADING SCREEN
  // ============================================
  if (isHydrating) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-center space-y-4">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
          <div className="text-xl font-bold">Loading RetroChat OS...</div>
          <div className="text-sm text-gray-600">Syncing your data</div>
        </div>
      </div>
    );
  }

  // ============================================
  // ❌ ERROR SCREEN
  // ============================================
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-red-50">
        <div className="max-w-md rounded-3xl border-2 border-red-600 bg-white p-6 shadow-xl text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/auth/login")}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // ✅ RENDER APP WITH SIDEBAR
  // ============================================
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Optional: Connection Status Indicator */}
        {user && !isConnected && (
          <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-yellow-400 border-2 border-black rounded-xl shadow-lg text-sm font-bold">
            🔄 Connecting to server...
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
