// components/ChatInfoPanel.jsx


export default function ChatInfoPanel() {
  return (
    <aside className="w-80 bg-card border-l p-4 overflow-y-auto hidden lg:block">
      <div className="font-semibold text-lg mb-4">Group Info</div>
      <div className="mb-2 text-sm text-muted-foreground">Shared Media</div>
      <div className="mb-2 text-sm text-muted-foreground">Members</div>
      <div className="mb-2 text-sm text-muted-foreground">Files</div>
    </aside>
  );
}
