import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayoutWrapper from './ConditionalLayoutWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tiffin Service App",
  description: "Your modern tiffin service website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConditionalLayoutWrapper>
          {children}
        </ConditionalLayoutWrapper>
      </body>
    </html>
  );
}