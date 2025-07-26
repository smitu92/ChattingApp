export default (plop)=> {
  plop.setGenerator('layout', {
    description: 'Generate folder layout for chat app',
    
    // 💡 even if not needed, include this
    prompts: [],

    actions: [
      { type: 'add', path: 'src/components/SidebarNavigation.jsx', template: '' },
      { type: 'add', path: 'src/components/ChatList.jsx', template: '' },
      { type: 'add', path: 'src/components/ChatWindow.jsx', template: '' },
      { type: 'add', path: 'src/components/ChatMessage.jsx', template: '' },
      { type: 'add', path: 'src/components/ChatInfoPanel.jsx', template: '' },
      { type: 'add', path: 'src/components/MessageInput.jsx', template: '' },

      { type: 'add', path: 'src/hooks/useIndexedDB.js', template: '' },

      { type: 'add', path: 'src/pages/ChatApp.jsx', template: '' },

      { type: 'add', path: 'src/db/chatDB.js', template: '' },

      { type: 'add', path: 'src/App.jsx', template: '' }
    ]
  });
};
