import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Brand fonts (Brand Bible §10). Fraunces + JetBrains Mono via Google Fonts;
// Satoshi via Fontshare (<link> below) since it is not on Google Fonts.
// Load Fraunces as a VARIABLE font with the optical-size axis (opsz 9..144) —
// this is what gives the headlines their high-contrast editorial character at
// large sizes (Brand Bible §10). Omitting `weight` keeps the full wght range.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "GetPromptly — AI Guidance for UK Education",
  description: "Independent, KCSIE-aligned AI guidance for UK schools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
      style={{ ["--font-satoshi" as string]: "'Satoshi'" }}
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
