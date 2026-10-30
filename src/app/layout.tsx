import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEEKS UNITED // Developer & Creative Collective",
  description: "A premier collective of developers, engineers, and creators building next-generation software, events, and hackathons.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#08080a] text-[#f5efeb] antialiased selection:bg-[#E8D5B5]/25 selection:text-[#FAF6F0]">
        {children}
      </body>
    </html>
  );
}
