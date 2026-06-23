"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        gutter={12}
        containerStyle={{ top: 80 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(5, 8, 22, 0.95)",
            color: "#fff",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            borderRadius: "12px",
            backdropFilter: "blur(20px)",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
    </SessionProvider>
  );
}
