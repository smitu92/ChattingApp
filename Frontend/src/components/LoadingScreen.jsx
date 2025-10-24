import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RetroButton from "./RetroButton";
import { PALETTE } from "../lib/palette.js";

export function LoadingScreen({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#fdf3e6]" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="w-[90%] max-w-[520px] rounded-3xl border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">💾</div>
              <div>
                <div className="font-extrabold text-xl text-black">Installing Chat Vibes…</div>
                <div className="text-sm text-gray-800">Everything is the same but the name.</div>
              </div>
            </div>
            <div className="h-4 w-full rounded-full border-2 border-black bg-[#fdf3e6] overflow-hidden">
              <motion.div className="h-full bg-[#a9e2b2]" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} />
            </div>
            <div className="mt-3 text-xs text-gray-700">Estimated time: enough to waste your work day.</div>
            <div className="mt-6 flex items-center gap-3">
              <RetroButton variant="ghost" title="F*** IT">F*** IT</RetroButton>
              <RetroButton variant="mint" title="Not yet">Not yet</RetroButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}