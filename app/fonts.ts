import { Inter, Space_Grotesk } from "next/font/google";

/**
 * Body font - Inter
 * Clean, readable font for body text
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Display font - Space Grotesk
 * Distinctive geometric sans-serif for headings
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Combined font variables for use in className
 */
export const fontVariables = `${inter.variable} ${spaceGrotesk.variable}`;
