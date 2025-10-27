// pages/App/Settings.jsx
import { useState } from "react";
import { useAppStore } from "../store/appStore";


export default function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const clearAuth = useAppStore((s) => s.clearAuth);
  
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('retro');

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data?')) {
      // Clear IndexedDB, localStorage, etc.
      localStorage.clear();
      alert('Cache cleared! Please refresh the page.');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      clearAuth();
      localStorage.clear();
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black mb-2">Settings</h1>
          <p className="text-gray-600">Manage your RetroChat preferences</p>
        </div>

        <div className="space-y-6">
          {/* Account Section */}
          <section className="rounded-3xl border-2 border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,0.25)] p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>👤</span> Account
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-black/10 bg-gray-50">
                <div>
                  <p className="font-bold">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button className="px-4 py-2 rounded-xl border-2 border-black bg-white font-bold text-sm hover:bg-yellow-200 shadow-[2px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-all">
                  Edit Profile
                </button>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="rounded-3xl border-2 border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,0.25)] p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🔔</span> Notifications
            </h2>
            <div className="space-y-4">
              <ToggleItem
                label="Push Notifications"
                description="Receive notifications for new messages"
                checked={notifications}
                onChange={setNotifications}
              />
              <ToggleItem
                label="Sound Effects"
                description="Play sounds for incoming messages"
                checked={soundEnabled}
                onChange={setSoundEnabled}
              />
            </div>
          </section>

          {/* Appearance Section */}
          <section className="rounded-3xl border-2 border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,0.25)] p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🎨</span> Appearance
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                {['retro', 'dark', 'light'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`
                      flex-1 px-4 py-3 rounded-xl border-2 border-black font-bold capitalize
                      transition-all
                      ${theme === t
                        ? 'bg-black text-white shadow-[4px_4px_0_rgba(0,0,0,0.25)]'
                        : 'bg-white hover:bg-yellow-200 shadow-[2px_2px_0_rgba(0,0,0,0.15)]'
                      }
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="rounded-3xl border-2 border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,0.25)] p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🔒</span> Privacy & Security
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-xl border-2 border-black bg-white font-bold hover:bg-blue-100 shadow-[2px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-all">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border-2 border-black bg-white font-bold hover:bg-blue-100 shadow-[2px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-all">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border-2 border-black bg-white font-bold hover:bg-blue-100 shadow-[2px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-all">
                Privacy Settings
              </button>
            </div>
          </section>

          {/* Data & Storage */}
          <section className="rounded-3xl border-2 border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,0.25)] p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>💾</span> Data & Storage
            </h2>
            <div className="space-y-3">
              <button 
                onClick={handleClearCache}
                className="w-full text-left px-4 py-3 rounded-xl border-2 border-black bg-white font-bold hover:bg-orange-100 shadow-[2px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-all"
              >
                Clear Cache
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border-2 border-black bg-white font-bold hover:bg-orange-100 shadow-[2px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-all">
                Download My Data
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-3xl border-2 border-red-600 bg-red-50 shadow-[8px_8px_0_rgba(220,38,38,0.25)] p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
              <span>⚠️</span> Danger Zone
            </h2>
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl border-2 border-red-600 bg-white font-bold text-red-600 hover:bg-red-100 shadow-[2px_2px_0_rgba(220,38,38,0.15)] hover:shadow-[4px_4px_0_rgba(220,38,38,0.25)] transition-all"
              >
                Logout from All Devices
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border-2 border-red-600 bg-white font-bold text-red-600 hover:bg-red-100 shadow-[2px_2px_0_rgba(220,38,38,0.15)] hover:shadow-[4px_4px_0_rgba(220,38,38,0.25)] transition-all">
                Delete Account
              </button>
            </div>
          </section>

          {/* Footer Info */}
          <div className="text-center py-4 text-sm text-gray-500">
            <p>RetroChat OS v1.0.0</p>
            <p className="text-xs mt-1">Last updated: October 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleItem({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-black/10 bg-gray-50">
      <div className="flex-1">
        <p className="font-bold">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative w-14 h-7 rounded-full border-2 border-black transition-all
          ${checked ? 'bg-green-400' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            absolute top-0.5 w-5 h-5 rounded-full bg-white border-2 border-black
            transition-transform shadow-[2px_2px_0_rgba(0,0,0,0.25)]
            ${checked ? 'translate-x-7' : 'translate-x-0.5'}
          `}
        />
      </button>
    </div>
  );
}