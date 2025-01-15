import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./Provider";

export const metadata: Metadata = {
  title: "LiveDocs - Where ideas come to life.",
  description: "LiveDocs is a real-time collaborative documentation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className="min-h-screen font-sans antialiased"
      >
        <Provider>
        {children}
        </Provider>
        
      </body>
    </html>
    </ClerkProvider>
  );
}
