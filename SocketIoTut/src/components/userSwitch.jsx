import { useState, useEffect } from "react";
import { userDb } from "../../IndexDb/user";
import useChatStore from "../store";


export default function UserSwitcher({ onUserChange }) {
  const [users, setUsers] = useState([]);

    const currentuser=useChatStore((state)=>state.currentuser);
    const addcurrentUser=useChatStore((state)=>state.addcurrentUser);
    // const currentUserKey=useChatStore((state)=>state.currentUserKey);
    const addCurrentUserKey=useChatStore((state)=>state.addCurrentUserKey);
  const [showModal, setShowModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    loadUsers();
  
  }, []);

  async function loadUsers() {
    const result = await userDb.getUsers();
    setUsers(result || []);
  }

  const handleUserSelect = (user) => {
    if (user.userId === currentuser) return;

    const confirmChange = window.confirm(
      `Switch to "${user.name}"?`
    );
    if (!confirmChange) return;

    addcurrentUser(user.userId);
    addCurrentUserKey(user.id);
    sessionStorage.setItem("currentUserId", user.userId);
    if (onUserChange) onUserChange(user);
  };

  const handleNewUserSubmit = async () => {
    if (!newUserName.trim()) return;

    const user = {
      userId: Date.now().toString(),
      name: newUserName.trim(),
    };

    await userDb.addUser(user);
    setUsers([...users, user]);
    setNewUserName("");
    setShowModal(false);
    handleUserSelect(user); // auto select new user
  };

  return (
    <div className="p-4 border rounded-lg shadow max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Select User</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
        >
          + New Chat
        </button>
      </div>

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.userId}
            onClick={() => handleUserSelect(user)}
            className={`cursor-pointer p-2 rounded ${
              currentuser === user.userId
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {user.name || `User ${user.userId}`}
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Start New Chat</h3>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter user name"
              className="w-full border px-3 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleNewUserSubmit}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
