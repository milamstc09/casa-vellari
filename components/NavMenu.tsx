"use client";

import { useState } from "react";

export default function NavMenu({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        aria-label="Abrir menu"
        aria-expanded={aberto}
        onClick={() => setAberto(!aberto)}
      >
        ☰
      </button>
      <nav className={`main-nav ${aberto ? "open" : ""}`} onClick={() => setAberto(false)}>
        {children}
      </nav>
    </>
  );
}
