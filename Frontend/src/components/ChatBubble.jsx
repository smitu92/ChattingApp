import { motion } from "framer-motion";
import { PALETTE } from "../lib/palette.js";

export default function ChatBubble({ side, text, ts }) {
  const isMe = side === "me";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[78%] md:max-w-[70%] p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.15)] ${
        isMe ? `bg-[${PALETTE.green}] self-end` : `bg-white`
      }`}
    >
      <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
      <div className="text-[10px] text-gray-700 mt-1">{new Date(ts).toLocaleTimeString()}</div>
    </motion.div>
  );
}

