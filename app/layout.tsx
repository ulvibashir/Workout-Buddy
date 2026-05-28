import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "@/components/shared/AppProvider";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import Sidebar from "@/components/shared/Sidebar";

export const metadata: Metadata = {
  title: "Workout Buddy — Ulvi",
  description: "Personal hybrid athlete dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body style={{ margin: 0 }}>
        <ThemeProvider>
          <AppProvider>
            <div className="app-shell">
              <Sidebar />
              <main className="page-content">
                {children}
              </main>
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
