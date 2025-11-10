import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const hostGrotesk = Nunito_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-host",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daddy",
  description: "Just a simple Daddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hostGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
