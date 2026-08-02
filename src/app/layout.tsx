import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trader Atlas — Trade Like the Greats",
  description:
    "Study the methodologies of 25 legendary traders. Reference, not advice. Education, not signals.",
  keywords: "trading, methodology, strategy, Chris Camillo, Warren Buffett, Mark Minervini",
  openGraph: {
    title: "Trader Atlas",
    description: "Trade Like the Greats — 25 legendary methodologies, one reference app.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise antialiased">{children}</body>
    </html>
  );
}
