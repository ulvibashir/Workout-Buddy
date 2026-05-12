import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ulvi — Hybrid Athlete Dashboard",
  description: "Personal hybrid athlete tracking system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0f0f1a", color: "#ffffff", margin: 0, minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
