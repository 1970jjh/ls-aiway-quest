import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LS Cable & System · AI Work Way Quest",
  description: "8 Quests. AI 시대 일하는 방식. 함께 만든 LS의 약속을 체화하라.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-ls-navy text-ls-white min-h-screen">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(61,217,255,0.10),_transparent_60%)]" />
        <div className="fixed inset-0 -z-10 circuit-bg opacity-50" />
        {children}
      </body>
    </html>
  );
}
