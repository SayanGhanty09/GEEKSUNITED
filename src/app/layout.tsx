import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEEKS UNITED // Neural Matrix to Quantum CPU",
  description: "Cinematic, ultra-realistic futuristic technology transition video and scroll-driven hero experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#030712] text-gray-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
