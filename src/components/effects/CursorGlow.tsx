"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      const speed = 0.08;
      glowX += (mouseX - glowX) * speed;
      glowY += (mouseY - glowY) * speed;

      if (glow) {
        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      id="cursor-glow"
      className="pointer-events-none"
      style={{
        position: "fixed",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(0,245,255,0.06) 40%, transparent 70%)",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        mixBlendMode: "screen",
        pointerEvents: "none",
        willChange: "left, top",
      }}
    />
  );
}
