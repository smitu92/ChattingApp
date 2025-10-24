import React from "react";
import { PALETTE } from "../lib/palette.js";

export default function RetroButton({ children, onClick, variant = "default", className = "", title, type }) {
  const base =
    "rounded-2xl px-4 py-2 font-semibold border-2 shadow-[4px_4px_0_rgba(0,0,0,0.25)] transition-transform active:translate-y-[2px] active:shadow-[2px_2px_0_rgba(0,0,0,0.25)]";
  const styles = {
    default: `bg-[${PALETTE.orange}] border-black text-[${PALETTE.ink}] hover:brightness-105`,
    ghost: `bg-white border-black text-[${PALETTE.ink}] hover:bg-[${PALETTE.bgCream}]`,
    mint: `bg-[${PALETTE.green}] border-black text-[${PALETTE.ink}] hover:brightness-105`,
  };
  return (
    <button type={type} title={title} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}