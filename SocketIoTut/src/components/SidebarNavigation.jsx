import { FaComments, FaFolderOpen, FaUser, FaCog } from 'react-icons/fa';

const icons = [
  { icon: <FaComments />, label: "All chats" },
  { icon: <FaFolderOpen />, label: "Files" },
  { icon: <FaUser />, label: "Profile" },
  { icon: <FaCog />, label: "Settings" },
];

export default function SidebarNavigation() {
  return (
    <div className="flex flex-col items-center py-6 space-y-8">
      <div className="text-indigo-600 font-bold text-xl">▲</div>
      {icons.map((item, i) => (
        <button key={i} className="text-gray-600 hover:text-indigo-600 text-xl">
         {item.icon}
        </button>
      ))}
    </div>
  );
}
