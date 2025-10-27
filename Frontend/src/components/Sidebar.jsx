// components/Sidebar.jsx - FIXED TOGGLE BUTTON POSITION
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

export default function RetroSidebar() {
  const [isOpen, setIsOpen] = useState(false); // Changed to false by default on mobile
  const location = useLocation();
  const user = useAppStore((s) => s.user);

  const navItems = [
    { path: '/', icon: '💬', label: 'Chats', badge: null },
    { path: '/profile', icon: '👤', label: 'Profile', badge: null },
    { path: '/testing', icon: '🧪', label: 'Testing', badge: null },
    { path: '/guild1', icon: '🎮', label: 'Guild', badge: 'NEW' },
  ];

  const settingsItems = [
    { path: '/settings', icon: '⚙️', label: 'Settings' },
    { path: '/auth/login', icon: '🚪', label: 'Logout' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile/Tablet Toggle Button - REPOSITIONED to not overlap */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.25)] transition-all active:scale-95"
        aria-label="Toggle Sidebar"
      >
        <div className="w-5 h-5 flex flex-col justify-center gap-1">
          <span className={`block h-0.5 bg-black transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block h-0.5 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 bg-black transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </div>
      </button>

      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen z-40
          w-64 lg:w-72
          bg-gradient-to-br from-purple-100 to-pink-100
          border-r-4 border-black
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b-4 border-black bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl border-2 border-black bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-xl shadow-[4px_4px_0_rgba(0,0,0,0.25)]">
                💾
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">RetroChat</h1>
                <p className="text-xs text-gray-600">OS v1.0</p>
              </div>
            </div>
            
            {/* Close button (mobile only)
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close Sidebar"
            >
              ✕
            </button> */}
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-b-2 border-black/10">
          <Link 
            to="/profile"
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
            className="block p-3 rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user?.avatarUrl || "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg"}
                  alt="User avatar"
                  className="w-12 h-12 rounded-full border-2 border-black object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{user?.name || 'Loading...'}</p>
                <p className="text-xs text-gray-600 truncate">@{user?.username || 'user'}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-bold text-gray-500 px-3 mb-2">NAVIGATION</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                border-2 border-black font-bold text-sm
                transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-black text-white shadow-[4px_4px_0_rgba(0,0,0,0.25)]'
                  : 'bg-white text-black hover:bg-yellow-200 shadow-[2px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-black bg-red-500 text-white rounded-full border border-black">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Settings/Logout Section */}
        <div className="p-4 border-t-2 border-black/10 space-y-2">
          <div className="text-xs font-bold text-gray-500 px-3 mb-2">SYSTEM</div>
          {settingsItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (item.label === 'Logout') {
                  useAppStore.getState().clearAuth();
                  localStorage.clear();
                }
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl
                border-2 border-black font-bold text-sm
                transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-black text-white shadow-[4px_4px_0_rgba(0,0,0,0.25)]'
                  : 'bg-white text-black hover:bg-red-100 shadow-[2px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t-4 border-black bg-white">
          <div className="text-center">
            <p className="text-xs text-gray-500 font-mono">© 2025 RetroChat</p>
            <p className="text-[10px] text-gray-400 mt-1">Made with 💖 by You</p>
          </div>
        </div>
      </aside>
    </>
  );
}