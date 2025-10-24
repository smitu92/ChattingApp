export default function TitleBar({ right = null }) {
  return (
    <div className="rounded-3xl border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,0.25)] mb-4 px-4 py-3 flex items-center justify-between">
      <div className="font-extrabold">RetroChat OS</div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}
