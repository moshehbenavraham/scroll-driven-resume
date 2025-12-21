import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Creative Developer",
    template: "%s | Portfolio",
  },
  description:
    "A cinematic portfolio experience showcasing creative development work with immersive animations and modern web technologies.",
  keywords: [
    "portfolio",
    "developer",
    "creative",
    "web development",
    "animation",
    "next.js",
    "react",
  ],
  authors: [{ name: "Developer" }],
  creator: "Developer",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
