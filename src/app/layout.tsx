import { Metadata } from "next";
import Providers from "./providers";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Sinzo Shop BD",
  description: "Wood business. Advance Me",
  keywords: [
    "wood business",
    "wood business solution",
    "wood business solution provider",
    "wood business solution provider in Bangladesh",
  ],
  authors: [{ name: "sinzo shop", url: "https://wood-business.vercel.app" }],
  creator: "shop business",
  publisher: "shop business",
  icons: {
    icon: "/banners/sinzo.jpg",
    shortcut: "/banners/sinzo.jpg",
    apple: "/banners/sinzo.jpg",
  },
  openGraph: {
    title: "Sinzo Shop BD",
    description: "The e-commerce shopping platform in Bangladesh",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}